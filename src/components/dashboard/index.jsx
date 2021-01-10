import React, { useState, useEffect } from "react";

import { STASH_REFRESH_TIMEOUT, SNAPSHOTS_KEY } from "../../constants";
import { getSummary } from "../../services/poe-stash-valuation";
import { getSnapshots, saveSnapshot } from "../../services/snapshots";

import { DashboardContainer, Information, Card } from "./style";
import NetWorth from "./net-worth";
import ChaosRecipe from "./chaos-recipe";
import PerHour from "./per-hour";
import PoeRacingWidget from "../poe-racing-widget";

export default function Dashboard() {
  const [summary, setSummary] = useState({});
  const [snapshots, setSnapshots] = useState([]);

  useEffect(() => {
    let running = true;
    async function refresher() {
      if (!running) {
        return;
      }

      const newSummary = await getSummary();
      setSummary(newSummary);
      await saveSnapshot(newSummary);
      const allSnapshots = await getSnapshots();
      setSnapshots(allSnapshots);

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
        <Card>
          <h3>Chaos/Ex: {summary?.chaosPerEx}</h3>
          <NetWorth {...summary} />
          <h4>Per Hour</h4>
          <PerHour snapshots={snapshots} />
        </Card>
        <Card
          style={{
            textAlign: "center",
          }}
        >
          <ChaosRecipe {...summary} />
          <PoeRacingWidget size={2} />
        </Card>
      </Information>
    </DashboardContainer>
  );
}
