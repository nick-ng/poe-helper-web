import {
  DEFAULT_FETCH_URL,
  FETCH_URL_KEY,
  MAX_FETCH_RETRIES,
  CHARACTER_NAME_KEY,
  ACCOUNT_KEY,
  LEAGUE_KEY,
  POESESSID_KEY,
  SEARCH_REDIRECT_KEY,
  TWITCH_CHANNEL_KEY,
  DASHBOARD_LAYOUT_KEY,
  DASHBOARD_LAYOUTS,
  TOP_N_MOST_EXPENSIVE_KEY,
  IGNORED_ITEMS_KEY,
  EXCLUDED_CURRENCY,
  STARTS_WITH_TABS_KEY,
  INCLUDES_TABS_KEY,
  ENDS_WITH_TABS_KEY,
  CHAOS_RECIPE_TABS_KEY,
  AGENT_PORT,
} from "../constants";

const ratio = 1.05;
let counter = 1;

export const wait = (ms) =>
  new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });

export const getSettings = () => {
  const searchRedirectRaw = localStorage.getItem(SEARCH_REDIRECT_KEY);
  const ignoredItemRaw = localStorage.getItem(IGNORED_ITEMS_KEY);

  return {
    account: localStorage.getItem(ACCOUNT_KEY),
    characterName: localStorage.getItem(CHARACTER_NAME_KEY),
    fetchUrl: localStorage.getItem(FETCH_URL_KEY) || DEFAULT_FETCH_URL,
    league: localStorage.getItem(LEAGUE_KEY),
    poesessid: localStorage.getItem(POESESSID_KEY),
    searchRedirect: searchRedirectRaw ? searchRedirectRaw === "true" : true,
    twitchChannel: localStorage.getItem(TWITCH_CHANNEL_KEY),
    dashboardLayout:
      localStorage.getItem(DASHBOARD_LAYOUT_KEY) || DASHBOARD_LAYOUTS.default,
    topNMostExpensive: localStorage.getItem(TOP_N_MOST_EXPENSIVE_KEY) ?? 5,
    ignoredItems: ignoredItemRaw
      ? JSON.parse(ignoredItemRaw)
      : EXCLUDED_CURRENCY,
    startsWithTabs: JSON.parse(
      localStorage.getItem(STARTS_WITH_TABS_KEY) || "[]"
    ),
    includesTabs: JSON.parse(localStorage.getItem(INCLUDES_TABS_KEY) || "[]"),
    endsWithTabs: JSON.parse(localStorage.getItem(ENDS_WITH_TABS_KEY) || "[]"),
    chaosRecipeTabs: JSON.parse(
      localStorage.getItem(CHAOS_RECIPE_TABS_KEY) || "[]"
    ),
    agentPort: localStorage.getItem(AGENT_PORT),
  };
};

export const fetcher = async (url, options) => {
  const { fetchUrl, agentPort } = getSettings();

  let actualFetchUrl = fetchUrl;

  if (agentPort) {
    const agentUrl = `http://localhost:${agentPort}`;
    try {
      const res = await fetch(agentUrl, {
        mode: "cors",
      });

      if (res.status === 200) {
        actualFetchUrl = agentUrl;
      }
    } catch (e) {
      console.warn("Agent not started?");
    }
  }

  for (let n = 0; n < MAX_FETCH_RETRIES; n++) {
    const res = await fetch(actualFetchUrl, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        options,
      }),
    });

    if (res.status === 429) {
      const msPer = parseInt(res.headers.get("x-ms-per-request"), 10) || 30000;
      const ms =
        Math.min(msPer * counter++ * ratio, 240000) + 500 * Math.random();
      console.warn(`Fetch limit hit. Waiting for ${ms} ms`);
      await wait(ms);
      continue;
    }

    counter = 1;
    return res;
  }
};
