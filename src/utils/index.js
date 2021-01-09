import {
  DEFAULT_FETCH_URL,
  FETCH_URL_KEY,
  CHARACTER_NAME_KEY,
  ACCOUNT_KEY,
  LEAGUE_KEY,
  POESESSID_KEY,
} from "../constants";

export const getSettings = () => ({
  account: localStorage.getItem(ACCOUNT_KEY),
  characterName: localStorage.getItem(CHARACTER_NAME_KEY),
  fetchUrl: localStorage.getItem(FETCH_URL_KEY) || DEFAULT_FETCH_URL,
  league: localStorage.getItem(LEAGUE_KEY),
  poesessid: localStorage.getItem(POESESSID_KEY),
});

export const fetcher = (url, options) => {
  const { fetchUrl } = getSettings();
  return fetch(fetchUrl, {
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
};

export const wait = (ms) =>
  new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
