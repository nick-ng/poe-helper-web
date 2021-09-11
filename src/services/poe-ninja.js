import localforage from "localforage";

import {
  NON_CURRENCY_THRESHOLD,
  POE_NINJA_CURRENCY,
  POE_NINJA_ITEM,
  POE_NINJA_UNIQUE,
  POE_NINJA_DATA_KEY,
  POE_NINJA_TIMESTAMP_KEY,
  POE_NINJA_REFRESH_AGE,
} from "../constants";
import { fetcher } from "../utils";

export const getPoeNinjaDatum = async (typeLine) => {
  if (typeLine === "Chaos Orb") {
    return {
      typeLine,
      each: 1,
    };
  }
  const each = await localforage.getItem(
    `${POE_NINJA_DATA_KEY}-${typeLine.replace(/ /g, "_")}`
  );
  return {
    typeLine,
    each: each ?? 0,
  };
};

export const getPoeNinjaDatumUnique = async (name, links = 0) => {
  const itemKey =
    links > 0
      ? `${POE_NINJA_DATA_KEY}-UNIQUE-${name.replace(/ /g, "_")}-${links}l`
      : `${POE_NINJA_DATA_KEY}-UNIQUE-${name.replace(/ /g, "_")}`;

  const each = await localforage.getItem(itemKey);
  return {
    name,
    each: each ?? 0,
  };
};

export const setPoeNinjaData = async (data) => {
  await Promise.all(
    data.map(({ typeLine, each, name, rarity }) => {
      if (name && rarity) {
        return localforage.setItem(
          `${POE_NINJA_DATA_KEY}-${rarity}-${name.replace(/ /g, "_")}`,
          each
        );
      }

      return localforage.setItem(
        `${POE_NINJA_DATA_KEY}-${typeLine.replace(/ /g, "_")}`,
        each
      );
    })
  );
};

export const updatePoeNinjaData = async ({ league }) => {
  // Check that the data isn't too old
  if (
    Date.now() - parseInt(localStorage.getItem(POE_NINJA_TIMESTAMP_KEY), 10) <
    POE_NINJA_REFRESH_AGE
  ) {
    return;
  }
  localStorage.setItem(POE_NINJA_TIMESTAMP_KEY, Date.now());

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
      console.warn("[stash] error when fetching from poe.ninja", e);
    }
  }

  for (const type of [...POE_NINJA_UNIQUE, ...POE_NINJA_ITEM]) {
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

      if (POE_NINJA_UNIQUE.includes(type)) {
        newData = newData.concat(
          resJson.lines.map((a) => {
            let uName = a.name;
            if (a.links && a.links >= 5) {
              uName = `${uName}-${a.links}l`;
            }
            return {
              name: uName,
              rarity: "UNIQUE",
              each: a.chaosValue >= NON_CURRENCY_THRESHOLD ? a.chaosValue : 0,
            };
          })
        );
      } else {
        newData = newData.concat(
          resJson.lines.map((a) => ({
            typeLine: a.name,
            each: a.chaosValue >= NON_CURRENCY_THRESHOLD ? a.chaosValue : 0,
          }))
        );
      }
    } catch (e) {
      console.warn("[stash] error when fetching from poe.ninja", e);
    }
  }

  await setPoeNinjaData(newData);
};
