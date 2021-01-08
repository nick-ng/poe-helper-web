import {
  DEFAULT_FETCH_URL,
  FETCH_URL_KEY,
  ACCOUNT_KEY,
  LEAGUE_KEY,
  POESESSID_KEY,
} from "../constants";

export const getSettings = () => ({
  fetchUrl: localStorage.getItem(FETCH_URL_KEY) || DEFAULT_FETCH_URL,
  account: localStorage.getItem(ACCOUNT_KEY),
  league: localStorage.getItem(LEAGUE_KEY),
  poesessid: localStorage.getItem(POESESSID_KEY),
});

export const fetcher = (url, options) => {
  const fetchUrl = getSettings();
  return fetch(fetchUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url,
      options,
    }),
  });
};
