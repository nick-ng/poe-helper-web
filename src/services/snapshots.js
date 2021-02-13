import localforage from "localforage";

import {
  SNAPSHOTS_KEY,
  MANUAL_SNAPSHOTS_KEY,
  MAX_SNAPSHOTS,
} from "../constants";

export const getSnapshotKeys = async (isManual = false) => {
  const keys = await localforage.keys();
  return keys
    .filter((a) =>
      a.startsWith(isManual ? MANUAL_SNAPSHOTS_KEY : SNAPSHOTS_KEY)
    )
    .sort((a, b) => {
      const [_a, aTimestampString] = a.split("-");
      const [_b, bTimestampString] = b.split("-");
      return parseInt(bTimestampString, 10) - parseInt(aTimestampString, 10);
    });
};

export const getSnapshots = async (isManual = false) => {
  const someSnapshotkeys = (await getSnapshotKeys(isManual)).slice(
    0,
    MAX_SNAPSHOTS
  );

  return Promise.all(someSnapshotkeys.map((key) => localforage.getItem(key)));
};

export const snapshotCleaner = async () => {
  const snapshotKeys = await getSnapshotKeys();
  const snapshots = await Promise.all(
    snapshotKeys.map((key) => localforage.getItem(key))
  );

  const threshold = 0.001;
  for (let n = 1; n < snapshots.length - 1; n++) {
    const aa = snapshots[n - 1];
    const bb = snapshots[n];
    const cc = snapshots[n + 1];

    const comparisons = [
      aa?.data?.totalChaosNetWorth - bb?.data?.totalChaosNetWorth,
      bb?.data?.totalChaosNetWorth - cc?.data?.totalChaosNetWorth,
      aa?.data?.totalChaosNetWorthB - bb?.data?.totalChaosNetWorthB,
      bb?.data?.totalChaosNetWorthB - cc?.data?.totalChaosNetWorthB,
      aa?.data?.totalExNetWorth - bb?.data?.totalExNetWorth,
      bb?.data?.totalExNetWorth - cc?.data?.totalExNetWorth,
      aa?.data?.totalExNetWorthB - bb?.data?.totalExNetWorthB,
      bb?.data?.totalExNetWorthB - cc?.data?.totalExNetWorthB,
    ];

    if (
      n > MAX_SNAPSHOTS ||
      comparisons.every((a) => Math.abs(a) < threshold)
    ) {
      const localforageKey = `${SNAPSHOTS_KEY}-${bb.timestamp}`;
      localforage.removeItem(localforageKey);
    }
  }
};

export const saveSnapshot = async (data, isManual = false, id = null) => {
  const timestamp = id || Date.now();
  const localforageKey = isManual
    ? `${MANUAL_SNAPSHOTS_KEY}-${timestamp}`
    : `${SNAPSHOTS_KEY}-${timestamp}`;
  await localforage.setItem(localforageKey, {
    timestamp,
    data,
  });
  await snapshotCleaner();
};

export const deleteManualSnapshot = async (timestamp) => {
  const localforageKey = `${MANUAL_SNAPSHOTS_KEY}-${timestamp}`;
  await localforage.removeItem(localforageKey);
  return getSnapshots(true);
};

export const snapshotDiff = (snapshotA, snapshotB) => {
  const [newer, older] = [snapshotA, snapshotB].sort(
    (a, b) => b?.timestamp - a?.timestamp
  );

  const durationMs = newer?.timestamp - older?.timestamp;
  const durationHr = durationMs / (1000 * 60 * 60);

  const midTime = (newer?.timestamp + older?.timestamp) / 2;
  const chaos =
    newer?.data?.totalChaosNetWorth - older?.data?.totalChaosNetWorth;
  const chaosB =
    newer?.data?.totalChaosNetWorthB - older?.data?.totalChaosNetWorthB;
  const ex = newer?.data?.totalExNetWorth - older?.data?.totalExNetWorth;
  const exB = newer?.data?.totalExNetWorthB - older?.data?.totalExNetWorthB;

  return {
    durationMs,
    startTime: older?.timestamp,
    endTime: newer?.timestamp,
    midTime,
    chaos,
    chaosPerHr: chaos / durationHr,
    chaosB,
    chaosPerHrB: chaosB / durationHr,
    ex,
    exPerHr: ex / durationHr,
    exB,
    exPerHrB: exB / durationHr,
  };
};
