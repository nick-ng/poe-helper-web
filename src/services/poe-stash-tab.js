import { fetcher } from "../utils";
import {
  EXCLUDED_CURRENCY,
  MIN_STACK_VALUE,
  NORMAL_STASH_TABS,
  SUPPORTED_TAB_TYPES,
} from "../constants";
import { getPoeNinjaDatum } from "./poe-ninja";

export const fetchStashTabHeaders = async ({ account, league, poesessid }) => {
  const res = await fetcher(
    `https://www.pathofexile.com/character-window/get-stash-items?accountName=${account}&realm=pc&league=${league}&tabs=1`,
    {
      credentials: "include",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:84.0) Gecko/20100101 Firefox/84.0",
        cookie: `POESESSID=${poesessid}`,
      },
      method: "GET",
    }
  );

  try {
    const jsonRes = await res.json();
    if (jsonRes?.error) {
      console.log("[stash] error when fetching tab headers", jsonRes);
      return [];
    }

    return jsonRes.tabs;
  } catch (e) {
    console.log("[stash] error when fetching tab headers", e);
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
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:84.0) Gecko/20100101 Firefox/84.0",
        cookie: `POESESSID=${poesessid}`,
      },
      method: "GET",
    }
  );

  try {
    const jsonRes = await res.json();
    return jsonRes.items || [];
  } catch (e) {
    console.log("[stash] error when fetching tab contents", e);
    return [];
  }
};

export const getSpecialTabs = (tabs) => {
  return tabs.filter((tab) => !NORMAL_STASH_TABS.includes(tab.type));
};

export const hydrateTabList = (tabs, { account, league, poesessid }) => {
  return Promise.all(
    tabs.map(async (tab) => ({
      ...tab,
      items: await fetchStashTabItems(tab.i, { account, league, poesessid }),
    }))
  );
};

export const getSpecialTabsValue = (hydratedTabs) => {
  const result = [];
  let chaosPerEx = getPoeNinjaDatum("Exalted Orb").each;

  for (const tab of hydratedTabs) {
    if (!SUPPORTED_TAB_TYPES.includes(tab.type)) {
      continue;
    }

    let mostExpensiveStack = { value: -1 };
    const { items } = tab;

    let chaosValue = 0;
    items.forEach((item) => {
      const { typeLine, stackSize } = item;

      if (EXCLUDED_CURRENCY.includes(typeLine)) {
        return;
      }

      const { each } = getPoeNinjaDatum(typeLine);

      if (each < 0) {
        return;
      }

      const stackValue = stackSize * each;

      if (stackValue < MIN_STACK_VALUE) {
        return;
      }

      if (mostExpensiveStack.value < stackValue) {
        mostExpensiveStack = {
          typeLine,
          stackSize,
          value: stackValue,
        };
      }
      chaosValue = chaosValue + each * stackSize;
    });

    result.push({
      tabName: tab.n,
      chaosValue,
      exValue: chaosValue / chaosPerEx,
      mostExpensiveStack,
    });
  }

  return {
    tabs: result,
    timestamp: Date.now(),
  };
};
