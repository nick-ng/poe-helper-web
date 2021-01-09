import {
  DEFAULT_FETCH_URL,
  FETCH_URL_KEY,
  MAX_FETCH_RETRIES,
  CHARACTER_NAME_KEY,
  ACCOUNT_KEY,
  LEAGUE_KEY,
  POESESSID_KEY,
} from "../constants";

let ratio = 1;

export const wait = (ms) =>
  new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });

export const getSettings = () => ({
  account: localStorage.getItem(ACCOUNT_KEY),
  characterName: localStorage.getItem(CHARACTER_NAME_KEY),
  fetchUrl: localStorage.getItem(FETCH_URL_KEY) || DEFAULT_FETCH_URL,
  league: localStorage.getItem(LEAGUE_KEY),
  poesessid: localStorage.getItem(POESESSID_KEY),
});

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

    if (res.status === 400 && res.headers.get("x-ms-per-request")) {
      const ms =
        (parseInt(res.headers.get("x-ms-per-request"), 10) || 1000) * ratio;
      ratio = ratio * 1.1;
      console.log(`limit hit. waiting for ${ms} ms`);
      await wait(ms);
      continue;
    }

    ratio = 1;
    return res;
  }
};
