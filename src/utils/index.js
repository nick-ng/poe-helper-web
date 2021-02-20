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
  };
};

export const fetcher = async (url, options) => {
  const { fetchUrl } = getSettings();

  for (let n = 0; n < MAX_FETCH_RETRIES; n++) {
    const res = await fetch(fetchUrl, {
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
      console.log(`Fetch limit hit. Waiting for ${ms} ms`);
      await wait(ms);
      continue;
    }

    counter = 1;
    return res;
  }
};
