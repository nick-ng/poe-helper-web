import { DEFAULT_FETCH_URL, FETCH_URL_KEY } from "../constants";

export const fetcher = (url, options) => {
  const fetchUrl = localStorage.getItem(FETCH_URL_KEY) || DEFAULT_FETCH_URL;
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
