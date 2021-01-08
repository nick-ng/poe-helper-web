import {
  BODY,
  BOOT,
  GLOVE,
  HELM,
  RING,
  AMULET,
  BELT,
  TWO_HANDED_WEAPON,
} from "../constants/poe";

export const chaosRecipeTabIds = (tabs) =>
  tabs.filter((tab) => tab.n.includes("chaos_")).map((tab) => tab.i);

export const chaosRecipeItemSlot = (item) => {
  const { typeLine } = item;

  if (item.identified) {
    return { slot: "identified", count: 0 };
  }

  if (item.properties) {
    const { properties } = item;
    if (properties.some((property) => property.name === "Physical Damage")) {
      if (
        TWO_HANDED_WEAPON.some((a) =>
          properties[0].name.toLowerCase().includes(a)
        )
      ) {
        return { slot: "weapon", count: 1 };
      }

      return { slot: "weapon", count: 0.5 };
    }

    if (properties.some((property) => property.name === "Chance to Block")) {
      return { slot: "weapon", count: 0.5 };
    }
  }

  if (RING.some((a) => typeLine.toLowerCase().includes(a))) {
    return { slot: "ring", count: 0.5 };
  }

  if (AMULET.some((a) => typeLine.toLowerCase().includes(a))) {
    return { slot: "amulet", count: 1 };
  }

  if (BELT.some((a) => typeLine.toLowerCase().includes(a))) {
    return { slot: "belt", count: 1 };
  }

  if (HELM.some((a) => typeLine.toLowerCase().includes(a))) {
    return { slot: "helm", count: 1 };
  }

  if (BOOT.some((a) => typeLine.toLowerCase().includes(a))) {
    return { slot: "boot", count: 1 };
  }

  if (GLOVE.some((a) => typeLine.toLowerCase().includes(a))) {
    return { slot: "glove", count: 1 };
  }

  if (BODY.some((a) => typeLine.toLowerCase().includes(a))) {
    return { slot: "body", count: 1 };
  }

  console.log("[stash] Unknown item", item);
  return { slot: "unknown", count: 0 };
};

export const chaosRecipeItemValue = (item) => {
  if (item.identified) {
    return null;
  }

  const { slot, count } = chaosRecipeItemSlot(item);

  if (slot === "unknown" || slot === "identified") {
    return null;
  }

  let recipeType = "chance";
  if (item.ilvl >= 75) {
    recipeType = "regal";
  } else if (item.ilvl >= 60) {
    recipeType = "chaos";
  }

  return {
    slot,
    count,
    recipeType,
  };
};

export const chaosRecipeTabContents = (items) => {
  return items.reduce(
    (prev, curr) => {
      const value = chaosRecipeItemValue(curr);

      if (!value || value.recipeType === "chance") {
        return prev;
      }

      const { recipeType, slot } = value;

      prev[recipeType][slot] = (prev[recipeType][slot] || 0) + info.count;

      return prev;
    },
    {
      regal: {
        weapon: 0,
        boot: 0,
        glove: 0,
        body: 0,
        helm: 0,
        ring: 0,
        amulet: 0,
        belt: 0,
      },
      chaos: {
        weapon: 0,
        boot: 0,
        glove: 0,
        body: 0,
        helm: 0,
        ring: 0,
        amulet: 0,
        belt: 0,
      },
    }
  );
};
