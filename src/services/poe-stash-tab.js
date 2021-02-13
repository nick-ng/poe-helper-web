import localforage from "localforage";

import { fetcher, wait } from "../utils";
import {
  EXCLUDED_CURRENCY,
  MIN_STACK_VALUE,
  NORMAL_STASH_TABS,
  SUPPORTED_TAB_TYPES,
  LAST_MAP_STASH_KEY,
  NEXT_CHANGE_ID_KEY,
  NEXT_CHANGE_ID_AGE_KEY,
} from "../constants";
import { getPoeNinjaDatum } from "./poe-ninja";

export const fetchStashTabHeaders = async ({ account, league, poesessid }) => {
  const res = await fetcher(
    `https://www.pathofexile.com/character-window/get-stash-items?accountName=${account}&realm=pc&league=${league}&tabs=1`,
    {
      credentials: "include",
      headers: {
        "User-Agent": navigator.userAgent,
        cookie: `POESESSID=${poesessid}`,
      },
      method: "GET",
    }
  );

  try {
    const jsonRes = await res.json();
    if (jsonRes?.error) {
      console.warn("[stash] error when fetching tab headers", jsonRes);
      return [];
    }

    return jsonRes.tabs;
  } catch (e) {
    console.warn("[stash] error when fetching tab headers", e);
    return [];
  }
};

export const fetchStashTabItems = async (
  tabId,
  { account, league, poesessid }
) => {
  const res = await fetcher(
    `https://www.pathofexile.com/character-window/get-stash-items?accountName=${account}&realm=pc&league=${league}&tabIndex=${tabId}`,
    {
      credentials: "include",
      headers: {
        "User-Agent": navigator.userAgent,
        cookie: `POESESSID=${poesessid}`,
      },
      method: "GET",
    }
  );

  try {
    const jsonRes = await res.json();
    return jsonRes.items || [];
  } catch (e) {
    console.warn("[stash] error when fetching tab contents", e);
    return [];
  }
};

const fetchMapTabItemsA = async ({ account, league }) => {
  let nextChangeId = localStorage.getItem(NEXT_CHANGE_ID_KEY);
  const nextChangeIdAge = localStorage.getItem(NEXT_CHANGE_ID_AGE_KEY) || 0;
  if (Date.now() - nextChangeIdAge > 1000 * 60 * 60) {
    const resA = await fetcher("https://poe.ninja/api/Data/GetStats", {
      method: "GET",
    });
    const jsonResA = await resA.json();
    console.log("jsonResA", jsonResA);
    nextChangeId = jsonResA.next_change_id;
  }
  const nextChangeQuery = nextChangeId ? `?id=${nextChangeId}` : "";
  const res = await fetcher(
    `http://www.pathofexile.com/api/public-stash-tabs${nextChangeQuery}`,
    {
      headers: {
        "User-Agent": navigator.userAgent,
      },
      method: "GET",
    }
  );

  try {
    const jsonRes = await res.json();
    console.log("next_change_id", jsonRes.next_change_id);
    localStorage.setItem(NEXT_CHANGE_ID_KEY, jsonRes.next_change_id);
    localStorage.setItem(NEXT_CHANGE_ID_AGE_KEY, Date.now());
    const yourMapTabs = jsonRes?.stashes?.filter(
      (b) => b.accountName === account
    );
    if (yourMapTabs.length > 0) {
      return yourMapTabs;
    }
  } catch (e) {
    console.warn("[stash] error when fetching tab contents", e);
    return [];
  }
  return false;
};

export const fetchMapTabItems = async ({ account, league }) => {
  for (let i = 0; i < 10; i++) {
    const a = await fetchMapTabItemsA({ account, league });
    console.log("i", i);
    if (a) {
      console.log("a", a);
      return [];
    }
    await wait(1000);
  }
  return [];
};

export const getSpecialTabs = (tabs) => {
  return tabs.filter((tab) => !NORMAL_STASH_TABS.includes(tab.type));
};

export const hydrateTabList = (tabs, { account, league, poesessid }) => {
  return Promise.all(
    tabs.map(async (tab) => {
      if (tab.type === "MapStash") {
        return {
          ...tab,
          items: await fetchMapTabItems({ account, league }),
        };
      }
      return {
        ...tab,
        items: await fetchStashTabItems(tab.i, { account, league, poesessid }),
      };
    })
  );
};

export const getSpecialTabsValue = async (hydratedTabs) => {
  const chaosPerEx = (await getPoeNinjaDatum("Exalted Orb")).each;
  const combinedItems = {};

  const result = await Promise.all(
    hydratedTabs.map(async (tab) => {
      if (!SUPPORTED_TAB_TYPES.includes(tab.type)) {
        return {
          tabName: tab.n,
          chaosValue: 0,
          exValue: 0,
          mostExpensiveStack: { value: -1 },
        };
      }

      const items = await Promise.all(
        tab.items.map(async (item) => {
          const { typeLine, stackSize } = item;

          if (EXCLUDED_CURRENCY.includes(typeLine)) {
            return {
              ...item,
              stackValue: 0,
              each: 0,
            };
          }

          const { each } = await getPoeNinjaDatum(typeLine);

          if (each < 0) {
            return {
              ...item,
              stackValue: 0,
              each: 0,
            };
          }

          const stackValue = stackSize * each;

          return {
            ...item,
            stackValue,
            each,
          };
        })
      );

      const { chaosValue, mostExpensiveStack } = items.reduce(
        (prev, item) => {
          const { chaosValue, mostExpensiveStack } = prev;
          const { typeLine, stackSize, stackValue } = item;

          if (!combinedItems[typeLine]) {
            const { each, icon } = item;
            combinedItems[typeLine] = {
              typeLine,
              each,
              icon,
              stackSize,
              stackValue,
              inTabs: [tab.n],
            };
          } else {
            combinedItems[typeLine].stackSize += stackSize;
            combinedItems[typeLine].inTabs = [
              ...combinedItems[typeLine].inTabs,
              tab.n,
            ];
          }

          if (!stackValue || stackValue < MIN_STACK_VALUE) {
            return prev;
          }

          const newChaosValue = chaosValue + stackValue;

          if (mostExpensiveStack.value < stackValue) {
            return {
              chaosValue: newChaosValue,
              mostExpensiveStack: {
                typeLine,
                stackSize,
                value: stackValue,
              },
            };
          }

          return {
            chaosValue: newChaosValue,
            mostExpensiveStack,
          };
        },
        {
          chaosValue: 0,
          mostExpensiveStack: { value: -1 },
        }
      );

      return {
        tabName: tab.n,
        chaosValue,
        exValue: chaosValue / chaosPerEx,
        mostExpensiveStack,
      };
    })
  );

  return {
    tabs: result,
    combinedItems: Object.values(combinedItems),
    timestamp: Date.now(),
  };
};
