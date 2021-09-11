import { useEffect, useState } from "react";

import { getSummary } from "./poe-stash-valuation";
import { getSnapshots, saveSnapshot } from "./snapshots";
import { STASH_REFRESH_TIMEOUT } from "../constants";

export function useStashSummary() {
  const [stashSummary, setStashSummary] = useState({});

  useEffect(() => {
    let timeoutId = null;

    const refresh = async () => {
      const newSummary = await getSummary();
      await saveSnapshot(newSummary);
      setStashSummary(newSummary);

      timeoutId = setTimeout(refresh, STASH_REFRESH_TIMEOUT);
    };

    const init = async () => {
      const snapshots = await getSnapshots();

      if (snapshots.length > 0) {
        setStashSummary(snapshots[0].data);
      }

      refresh();
    };

    init();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return stashSummary;
}
