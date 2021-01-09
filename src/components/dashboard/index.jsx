import React, { useState, useEffect } from "react";

import { STASH_REFRESH_TIMEOUT, SNAPSHOTS_KEY } from "../../constants";
import { getSummary } from "../../services/poe-stash-valuation";

import { DashboardContainer, Information, Card } from "./style";
import NetWorth from "./net-worth";
import ChaosRecipe from "./chaos-recipe";
import PerHour from "./per-hour";
import PoeRacingWidget from "../poe-racing-widget";

export default function Dashboard() {
  const [summary, setSummary] = useState({});
  const [snapshots, setSnapshots] = useState(
    JSON.parse(localStorage.getItem(SNAPSHOTS_KEY) || "[]")
  );

  useEffect(() => {
    let running = true;
    async function refresher() {
      if (!running) {
        return;
      }

      const newSummary = await getSummary();
      setSummary(newSummary);
      setSnapshots((prevSnapshots) =>
        [
          {
            timestamp: Date.now(),
            data: newSummary,
          },
          ...prevSnapshots,
        ].slice(0, 1000)
      );

      setTimeout(refresher, STASH_REFRESH_TIMEOUT);
    }
    refresher();

    return () => {
      running = false;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(SNAPSHOTS_KEY, JSON.stringify(snapshots));
  }, [snapshots]);

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
