import React, { useState, useEffect } from "react";

import { STASH_REFRESH_TIMEOUT } from "../../constants";
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
        <Card style={{ flexShrink: 1 }}>
          <p>The chaos recipe helper looks for tabs that start with "chaos_"</p>
        </Card>
        <Card style={{ flexShrink: 0 }}>
          <h3>Chaos/Ex: {summary?.chaosPerEx}</h3>
          <NetWorth {...summary} />
          <h4>Per Hour</h4>
          <PerHour snapshots={snapshots} />
        </Card>
        <Card
          style={{
            flexShrink: 0,
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
