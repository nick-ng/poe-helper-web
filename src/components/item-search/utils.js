import { snake } from "case";
import { flattenDeep } from "lodash";
import {
  itemMap,
  poeNinjaMap,
  poeNinjaRegex,
} from "../../constants/poe-item-slot";

const HANDLED_RARITIES = ["unique", "currency", "normal"];

const trim = (a) => {
  return a.trim();
};
const itemStringToArray = (itemString) => {
  return itemString
    .trim()
    .split("\n")
    .map(trim)
    .filter((a) => a !== "--------");
};

export const itemStringToGroups = (itemString) => {
  return itemString
    .split("--------")
    .map(trim)
    .map((a) => a.split("\n").map(trim));
};

export const getMaxLink = (itemString) => {
  const itemArray = itemStringToArray(itemString);

  const a = itemArray.find((a) => a.startsWith("Sockets:"));

  if (!a) {
    return 0;
  }
  const b = a.replace("Sockets: ", "").split(" ");
  console.log("b", b);
  return itemStringToGroups(itemString);
};

const getPoeNinjaClass = (item) => {
  if (item.class) {
    return poeNinjaMap[item.class] || null;
  }

  switch (item.rarity) {
    case "gem":
      return "skill-gems";
    case "divination card":
      return "divination-cards";
    default:
    // nothing
  }

  for (const entry of poeNinjaRegex) {
    if (item?.name.match(entry.regex)) {
      return entry.class;
    }
  }

  return null;
};

const getPoeNinjaUrl = (item) => {
  const name = encodeURIComponent(item.name || "");

  if (item.rarity === "unique") {
    return `https://poe.ninja/challenge/unique-${
      item.poeNinjaClass || "weapons"
    }?name=${name}`;
  }
  if (item.poeNinjaClass) {
    return `https://poe.ninja/challenge/${item.poeNinjaClass}?name=${name}`;
  }
  return null;
};

const getFromStart = (itemGroups, startString) => {
  const flatGroups = flattenDeep(itemGroups);
  const found = flatGroups.find((a) =>
    a.toLowerCase().startsWith(startString.toLowerCase())
  );

  if (found) {
    return found.split(": ")[1]?.toLowerCase();
  }

  return "";
};

export const parseItem = (itemString) => {
  const item = {
    rarity: null,
    name: null,
    baseType: null,
    class: null,
    slot: null,
    maxLink: 0,
    identified: null,
    corrupted: false,
    influence: [],
    poeNinjaClass: null,
    poeNinjaUrl: null,
    poeappUrl: `https://poeapp.com/#/item-import/${encodeURIComponent(
      itemString
    )}`,
  };

  // Do some stuff
  const itemGroups = itemStringToGroups(itemString);
  item.rarity = getFromStart(itemGroups, "rarity:");
  item.class = getFromStart(itemGroups, "item class:");

  if (item.rarity === "magic") {
    item.identified = true;

    item.name = itemGroups[0][1];
    // const temp = itemGroups[0][1]
    //   .replace("'", "")
    //   .replace(/(^\S+)|(of.+)/g, "")
    //   .trim();
    item.baseType = snake(itemGroups[0][1]);
  } else if (itemGroups[0].length === 3) {
    item.identified = false;
    item.rarity = itemGroups[0][0].toLowerCase().replace("rarity: ", "");
    item.baseType = snake(itemGroups[0][1]);
  } else {
    item.identified = true;
    item.name = itemGroups[0][2];
    item.baseType = snake(itemGroups[0][3]);
  }

  if (!item.name) {
    item.name = itemGroups[0][1];
  }

  // if (item.baseType) {
  //   item.class = itemMap[item.baseType] || null;
  // }

  item.poeNinjaClass = getPoeNinjaClass(item);
  item.poeNinjaUrl = getPoeNinjaUrl(item);

  return item;
};
