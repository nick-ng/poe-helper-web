import {
  fetchStashTabHeaders,
  getSpecialTabs,
  hydrateTabList,
  getSpecialTabsValue,
} from "./poe-stash-tab";
import { getChaosRecipeTabs, getChaosRecipeTabsValue } from "./poe-items";
import { updatePoeNinjaData, getPoeNinjaDatum } from "./poe-ninja";
import { getSettings } from "../utils";

export const summary = async (chaosRecipeTab, specialTab) => {
  const regalAndChaos = [];
  let chaosItems = 0;
  const { chaos, regal } = chaosRecipeTab;
  Object.keys(chaos).forEach((slot) => {
    const count = chaos[slot] + regal[slot];
    regalAndChaos.push({ slot, count, chaosCount: chaos[slot] });
    chaosItems = chaosItems + chaos[slot];
  });

  const lowestSlot = Math.min(...regalAndChaos.map((a) => a.count));
  const regalAndChaosCount = regalAndChaos.reduce((p, c) => p + c.count, 0);

  const chaosPerEx = (await getPoeNinjaDatum("Exalted Orb")).each;
  let totalChaosNetWorth = 0;
  let totalExNetWorth = 0;
  specialTab?.tabs?.forEach((curr) => {
    totalChaosNetWorth = totalChaosNetWorth + curr.chaosValue;
    totalExNetWorth = totalExNetWorth + curr.exValue;
  });

  const recipeInChaos = (2 * regalAndChaosCount) / 8;
  const recipeInEx = recipeInChaos / chaosPerEx;
  const totalChaosNetWorthB = totalChaosNetWorth + recipeInChaos;
  const totalExNetWorthB = totalExNetWorth + recipeInEx;

  return {
    timestamp: Date.now(),
    chaosRecipeTab,
    specialTab,
    chaosPerEx,
    chaosItems,
    lowestSlot,
    recipeInChaos,
    regalAndChaos,
    totalChaosNetWorth,
    totalChaosNetWorthB,
    recipeInEx,
    totalExNetWorth,
    totalExNetWorthB,
  };
};

export const getSummary = async (fullTabs = false) => {
  const { account, league, poesessid } = getSettings();

  if (!account || !league || !poesessid) {
    return {};
  }

  await updatePoeNinjaData({ league });

  const allTabs = await fetchStashTabHeaders({ account, league, poesessid });
  const specialHydratedTabs = await hydrateTabList(getSpecialTabs(allTabs), {
    account,
    league,
    poesessid,
  });
  const chaosHydratedTabs = await hydrateTabList(getChaosRecipeTabs(allTabs), {
    account,
    league,
    poesessid,
  });

  const special = await getSpecialTabsValue(specialHydratedTabs);
  const chaos = getChaosRecipeTabsValue(chaosHydratedTabs);

  if (fullTabs) {
    return {
      ...summary(chaos, special),
      fullTabs: specialHydratedTabs,
    };
  }

  return summary(chaos, special);
};
