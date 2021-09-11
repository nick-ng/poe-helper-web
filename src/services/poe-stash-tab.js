import { fetcher, getSettings } from "../utils";
import {
  MIN_STACK_VALUE,
  NORMAL_STASH_TABS,
  SUPPORTED_TAB_TYPES,
  MINIMUM_TABS,
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

export const getSpecialTabs = (tabs) => {
  const { startsWithTabs, includesTabs, endsWithTabs } = getSettings();
  const specialTabs = tabs.filter((tab) => {
    return (
      !NORMAL_STASH_TABS.includes(tab.type) ||
      startsWithTabs
        .filter((a) => a)
        .some((pattern) => tab?.n.startsWith(pattern)) ||
      includesTabs
        .filter((a) => a)
        .some((pattern) => tab?.n.includes(pattern)) ||
      endsWithTabs.filter((a) => a).some((pattern) => tab?.n.includes(pattern))
    );
  });

  if (specialTabs.length < MINIMUM_TABS) {
    const remainingTabs = tabs
      .filter((tab) => !specialTabs.map((tab2) => tab2.id).includes(tab.id))
      .filter((tab) => !tab.n.includes("(Remove-only)"));
    return specialTabs.concat(
      remainingTabs.slice(0, MINIMUM_TABS - specialTabs.length)
    );
  }

  return specialTabs;
};

export const hydrateTabList = (tabs, { account, league, poesessid }) => {
  return Promise.all(
    tabs.map(async (tab) => ({
      ...tab,
      items: await fetchStashTabItems(tab.i, { account, league, poesessid }),
    }))
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
        tab.items.map(async (item, i) => {
          const { typeLine, stackSize } = item;

          if (getSettings().ignoredItems.includes(typeLine)) {
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

          const stackValue = (stackSize || 1) * each;

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
