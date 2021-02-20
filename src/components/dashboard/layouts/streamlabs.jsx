import React, { useState, useEffect } from "react";

import {
  STASH_REFRESH_TIMEOUT,
  SHOW_CHAOS_RECIPE_KEY,
} from "../../../constants";
import { getSummary } from "../../../services/poe-stash-valuation";
import { getSnapshots, saveSnapshot } from "../../../services/snapshots";

import { DashboardContainer, Information, Card } from "../style";
import NetWorth from "../net-worth";
import ChaosRecipe from "../chaos-recipe";
import ManualSnapshot from "../manual-snapshot";

export default function StreamlabsDashboard() {
  const [summary, setSummary] = useState({});
  const [snapshots, setSnapshots] = useState([]);
  const [fetching, setFetching] = useState(false);

  // Controls
  const [showChaosRecipe, setShowChaosRecipe] = useState(
    localStorage.getItem(SHOW_CHAOS_RECIPE_KEY) === "true"
  );

  useEffect(() => {
    (async () => {
      const allSnapshots = await getSnapshots();
      setSnapshots(allSnapshots);
      setSummary(allSnapshots[0]?.data);
    })();

    let running = true;
    async function refresher() {
      if (!running) {
        return;
      }

      setFetching(true);
      console.log("a");
      const newSummary = await getSummary();
      console.log("b");
      console.log("newSummary", newSummary);
      setSummary(newSummary);
      await saveSnapshot(newSummary);
      const allSnapshots = await getSnapshots();
      setSnapshots(allSnapshots);
      setFetching(false);

      setTimeout(refresher, STASH_REFRESH_TIMEOUT);
    }
    refresher();

    return () => {
      running = false;
    };
  }, []);

  return (
    <DashboardContainer>
      <Information>
        <Card style={{ flexShrink: 1, flexGrow: 1 }}>
          <h3>Snapshots</h3>
          <ManualSnapshot summary={summary} showChaosRecipe={showChaosRecipe} />
        </Card>
        <Card style={{ flexShrink: 0, flexGrow: 1 }}>
          <h3>Chaos per Ex: {summary?.chaosPerEx}</h3>
          <p>
            Net Worth: {summary?.totalChaosNetWorth?.toFixed(1)} c (
            {summary?.totalExNetWorth?.toFixed(2)} ex){" "}
            {fetching && <span>...</span>}
          </p>
          <NetWorth {...summary} />
        </Card>

        <Card
          style={{
            flexShrink: 0,
            flexGrow: 0,
            textAlign: "right",
          }}
        >
          <input
            type="checkbox"
            checked={showChaosRecipe}
            onChange={() => {
              localStorage.setItem(SHOW_CHAOS_RECIPE_KEY, !showChaosRecipe);
              setShowChaosRecipe(!showChaosRecipe);
            }}
          />
          {showChaosRecipe && <ChaosRecipe {...summary} />}
        </Card>
      </Information>
    </DashboardContainer>
  );
}
