import localforage from "localforage";

import {
  NON_CURRENCY_THRESHOLD,
  POE_NINJA_CURRENCY,
  POE_NINJA_ITEM,
  POE_NINJA_DATA_KEY,
  POE_NINJA_TIMESTAMP_KEY,
  POE_NINJA_REFRESH_AGE,
} from "../constants";
import { fetcher } from "../utils";

export const getPoeNinjaDatum = async (typeLine) => {
  const each = await localforage.getItem(
    `${POE_NINJA_DATA_KEY}-${typeLine.replace(/ /g, "_")}`
  );
  return {
    typeLine,
    each: each ?? 0,
  };
};

export const setPoeNinjaData = async (data) => {
  await Promise.all(
    data.map(({ typeLine, each }) =>
      localforage.setItem(
        `${POE_NINJA_DATA_KEY}-${typeLine.replace(/ /g, "_")}`,
        each
      )
    )
  );
  localStorage.setItem(POE_NINJA_TIMESTAMP_KEY, Date.now());
};

export const updatePoeNinjaData = async ({ league }) => {
  // Check that the data isn't too old
  if (
    Date.now() - parseInt(localStorage.getItem(POE_NINJA_TIMESTAMP_KEY), 10) <
    POE_NINJA_REFRESH_AGE
  ) {
    return;
  }

  let newData = [];
  console.log(`${new Date()} Fetching poe.ninja data`);

  for (const type of POE_NINJA_CURRENCY) {
    const requestType = "currency";
    try {
      const res = await fetcher(
        `https://poe.ninja/api/data/${requestType}overview?league=${league}&type=${type}&language=en`,
        {
          method: "GET",
          mode: "cors",
        }
      );
      const resJson = await res.json();

      newData = newData.concat(
        resJson.lines.map((a) => ({
          typeLine: a.currencyTypeName,
          each: a.chaosEquivalent,
        }))
      );
    } catch (e) {
      console.log("[stash] error when fetching from poe.ninja", e);
    }
  }

  for (const type of POE_NINJA_ITEM) {
    const requestType = "item";
    try {
      const res = await fetcher(
        `https://poe.ninja/api/data/${requestType}overview?league=${league}&type=${type}&language=en`,
        {
          method: "GET",
          mode: "cors",
        }
      );
      const resJson = await res.json();

      newData = newData.concat(
        resJson.lines
          .map((a) => ({
            typeLine: a.name,
            each: a.chaosValue,
          }))
          .filter((a) => a.each > NON_CURRENCY_THRESHOLD)
      );
    } catch (e) {
      console.log("[stash] error when fetching from poe.ninja", e);
    }
  }

  await setPoeNinjaData(newData);
};
