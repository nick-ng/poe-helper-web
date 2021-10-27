export const FETCH_URL_KEY = "FETCH_URL";
export const MAX_FETCH_RETRIES = 5000;
export const DEFAULT_FETCH_URL = "https://example-fetch.herokuapp.com/";
export const AGENT_PORT = "AGENT_PORT";
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
export const TOP_N_MOST_EXPENSIVE_KEY = "TOP_N_MOST_EXPENSIVE";
export const IGNORED_ITEMS_KEY = "IGNORED_ITEMS";
export const STARTS_WITH_TABS_KEY = "STARTS_WITH_TABS";
export const INCLUDES_TABS_KEY = "INCLUDES_TABS";
export const ENDS_WITH_TABS_KEY = "ENDS_WITH_TABS";
export const CHAOS_RECIPE_TABS_KEY = "CHAOS_RECIPE_TABS";
export const ATLAS_HELPER_COMPLETION_KEY = "ATLAS_HELPER_COMPLETION";
export const ATLAS_HELPER_ATLAS_KEY = "ATLAS_HELPER_ATLAS";
export const VOICE_CHARACTER_STORE = "VOICE_CHARACTER_POE_WEB";
export const VOICE_VOLUME_STORE = "VOICE_VOLUME_POE_WEB";
export const LAST_CHAOS_FILTER_SIZES_STORE = "LAST_CHAOS_FILTER_SIZES_POE_WEB";
export const LOOT_FILTER_HELPER_BASE_TYPES =
  "LOOT_FILTER_HELPER_BASE_TYPES_POE_WEB";

export const STASH_REFRESH_TIMEOUT = 2 * 60 * 1000;

export const SNAPSHOTS_KEY = "SNAPSHOTS";
export const MANUAL_SNAPSHOTS_KEY = "MANUAL_SNAPSHOTS";
export const MAX_SNAPSHOTS = 20;

export const NORMAL_STASH_TABS = ["NormalStash", "QuadStash", "PremiumStash"];
export const MINIMUM_TABS = 10;
export const SUPPORTED_TAB_TYPES = [
  "NormalStash",
  "QuadStash",
  "PremiumStash",
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
  "Portal Scroll",
  "Perandus Coin",
  "Alteration Shard",
  "Chaos Shard",
  "Binding Shard",
  "Harbinger's Shard",
  "Scroll Fragment",
  "Horizon Shard",
  "Engineer's Shard",
  "Alchemy Shard",
  "Ancient Shard",
  "Regal Shard",
  "Transmutation Shard",
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
export const POE_NINJA_UNIQUE = [
  "UniqueWeapon",
  "UniqueArmour",
  "UniqueAccessory",
  "UniqueFlask",
  "UniqueJewel",
];
export const POE_NINJA_REFRESH_AGE = 30 * 60 * 1000;

export const NON_CURRENCY_THRESHOLD = 1.1;
export const MIN_STACK_VALUE = 1;

export const DASHBOARD_LAYOUTS = {
  default: "Default",
  streamlabs: "Stream Labs",
};
