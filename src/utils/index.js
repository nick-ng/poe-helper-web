import {
  DEFAULT_FETCH_URL,
  FETCH_URL_KEY,
  MAX_FETCH_RETRIES,
  CHARACTER_NAME_KEY,
  ACCOUNT_KEY,
  LEAGUE_KEY,
  POESESSID_KEY,
} from "../constants";

const ratio = 1.01;
let counter = 1;

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
      const msPer = parseInt(res.headers.get("x-ms-per-request"), 10) || 1000;
      const ms = msPer * counter++ * ratio + 50 * Math.random();
      console.log(`Fetch limit hit. Waiting for ${ms} ms`);
      await wait(ms);
      continue;
    }

    if (res.status === 429) {
      const ms = 30000;
      console.log(`Rate limit hit. Waiting for ${ms} ms`);
      await wait(ms);
      continue;
    }

    counter = 1;
    return res;
  }
};
