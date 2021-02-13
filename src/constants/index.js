export const FETCH_URL_KEY = "FETCH_URL";
export const MAX_FETCH_RETRIES = 5000;
export const DEFAULT_FETCH_URL = "https://example-fetch.herokuapp.com/";
export const CHARACTER_NAME_KEY = "CHARACTER_NAME";
export const ACCOUNT_KEY = "ACCOUNT";
export const LEAGUE_KEY = "LEAGUE";
export const POESESSID_KEY = "POESESSID";
export const SEARCH_REDIRECT_KEY = "SEARCH_REDIRECT";
export const SHOW_CHAOS_RECIPE_KEY = "SHOW_CHAOS_RECIPE";
export const TWITCH_CHANNEL_KEY = "TWITCH_CHANNEL";
export const SHOW_TWITCH_CHAT_KEY = "SHOW_TWITCH_CHAT";
export const TWITCH_CHAT_FIRST_KEY = "TWITCH_CHAT_FIRST";
export const DASHBOARD_LAYOUT_KEY = "DASHBOARD_LAYOUT";

export const STASH_REFRESH_TIMEOUT = 2.5 * 60 * 1000;

export const SNAPSHOTS_KEY = "SNAPSHOTS";
export const MANUAL_SNAPSHOTS_KEY = "MANUAL_SNAPSHOTS";
export const MAX_SNAPSHOTS = 500;

export const NORMAL_STASH_TABS = ["NormalStash", "QuadStash", "PremiumStash"];
export const SUPPORTED_TAB_TYPES = [
  "CurrencyStash",
  "FragmentStash",
  "DivinationCardStash",
  "DelveStash",
  "EssenceStash",
  "MetamorphStash",
  "BlightStash",
  "DeliriumStash",
];
export const EXCLUDED_CURRENCY = [
  "Armourer's Scrap",
  "Blacksmith's Whetstone",
  "Chromatic Orb",
  "Portal Scroll",
  "Silver Coin",
  "Scroll of Wisdom",
  "Glassblower's Bauble",
  "Perandus Coin",
  "Orb of Transmutation",
];

export const POE_NINJA_DATA_KEY = "POE_NINJA_DATA";
export const POE_NINJA_TIMESTAMP_KEY = "POE_NINJA_TIMESTAMP";
export const POE_NINJA_CURRENCY = ["Currency", "Fragment"];
export const POE_NINJA_ITEM = [
  "DeliriumOrb",
  "Watchstone",
  "Oil",
  // "Incubator",
  "Scarab",
  "Fossil",
  "Resonator",
  "Essence",
  "DivinationCard",
  // "Prophecy",
  // "SkillGem",
];
export const POE_NINJA_REFRESH_AGE = 30 * 60 * 1000;

export const NON_CURRENCY_THRESHOLD = 0.5;
export const MIN_STACK_VALUE = 1;

export const DASHBOARD_LAYOUTS = {
  default: "Default",
  streamlabs: "Stream Labs",
};
