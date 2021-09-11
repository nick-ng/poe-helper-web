import React, { useState } from "react";

import { SHOW_CHAOS_RECIPE_KEY } from "../../../constants";

import { DashboardContainer, Information, Card } from "../style";
import NetWorth from "../net-worth";
import ChaosRecipe from "../chaos-recipe";
import ManualSnapshot from "../manual-snapshot";

export default function StreamlabsDashboard({ summary }) {
  // Controls
  const [showChaosRecipe, setShowChaosRecipe] = useState(
    localStorage.getItem(SHOW_CHAOS_RECIPE_KEY) === "true"
  );

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
