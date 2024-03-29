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
import { getSettings } from "../utils";

export const getChaosRecipeTabs = (tabs) => {
  const chaosRecipeTabs = getSettings().chaosRecipeTabs.filter((a) => a);
  const defaultChaosTabs = tabs.filter((tab) => tab.n.includes("chaos_"));
  const normalTabs = tabs.filter(
    (tab) => tab.type === "NormalStash" && !tab.n.includes("(Remove-only)")
  );
  if (chaosRecipeTabs.length > 0) {
    return tabs.filter((tab) => chaosRecipeTabs.includes(tab.n));
  }
  if (defaultChaosTabs.length > 0) {
    return defaultChaosTabs;
  }

  return normalTabs;
};

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

  if (RING.some((a) => typeLine.toLowerCase().includes(a))) {
    return { slot: "ring", count: 0.5 };
  }

  console.warn("[stash] Unknown item", item);
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

export const getChaosRecipeTabContents = (
  otherContents = {
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
  },
  { items }
) => {
  const itemsBySlot = {
    weapon: [],
    boot: [],
    glove: [],
    body: [],
    helm: [],
    ring: [],
    amulet: [],
    belt: [],
    unknown: [],
  };
  const result = items.reduce((prev, curr) => {
    const value = chaosRecipeItemValue(curr);

    if (!value || value.recipeType === "chance") {
      return prev;
    }

    const { recipeType, slot, count } = value;

    itemsBySlot[slot].push(curr.typeLine);
    prev[recipeType][slot] = (prev[recipeType][slot] || 0) + count;

    return prev;
  }, otherContents);
  return result;
};

export const getChaosRecipeTabsValue = (hydratedTabs) => {
  return hydratedTabs.reduce(getChaosRecipeTabContents, {
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
  });
};
