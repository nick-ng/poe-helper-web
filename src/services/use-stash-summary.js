import { useEffect, useState } from "react";

import { getSummary } from "./poe-stash-valuation";
import { saveSnapshot } from "./snapshots";
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

    refresh();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return stashSummary;
}
