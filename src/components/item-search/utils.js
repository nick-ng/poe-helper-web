import { snake } from "case";
import { itemMap, poeNinjaMap } from "../../constants/poe-item-slot";

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

const getPoeNinjaUrl = (item) => {
  const name = encodeURIComponent(item.name || "");

  if (item.rarity === "unique") {
    return `https://poe.ninja/challenge/unique-${
      item.poeNinjaClass || "weapons"
    }?name=${name}`;
  }
  if (item.rarity === "gem") {
    return `https://poe.ninja/challenge/skill-gems?name=${name}`;
  }
  return null;
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
  };

  // Do some stuff
  const itemGroups = itemStringToGroups(itemString);
  if (itemGroups[0][0] === "Rarity: Magic") {
    item.identified = true;
    item.rarity = "magic";
    item.name = itemGroups[0][1];
    // const temp = itemGroups[0][1]
    //   .replace("'", "")
    //   .replace(/(^\S+)|(of.+)/g, "")
    //   .trim();
    item.baseType = snake(itemGroups[0][1]);
  } else if (itemGroups[0].length === 2) {
    item.identified = false;
    item.rarity = itemGroups[0][0].toLowerCase().replace("rarity: ", "");
    item.baseType = snake(itemGroups[0][1]);
  } else {
    item.identified = true;
    item.rarity = itemGroups[0][0].toLowerCase().replace("rarity: ", "");
    item.name = itemGroups[0][1];
    item.baseType = snake(itemGroups[0][2]);
  }

  if (item.rarity === "gem") {
    item.name = itemGroups[0][1];
  }

  if (item.baseType) {
    item.class = itemMap[item.baseType] || null;
  }

  if (item.class) {
    item.poeNinjaClass = poeNinjaMap[item.class] || null;
  }

  item.poeNinjaUrl = getPoeNinjaUrl(item);

  return item;
};
