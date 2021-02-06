import React, { useState, useEffect } from "react";

import { STASH_REFRESH_TIMEOUT, SHOW_CHAOS_RECIPE_KEY } from "../../constants";
import { getSummary } from "../../services/poe-stash-valuation";
import { getSnapshots, saveSnapshot } from "../../services/snapshots";
import { getSettings } from "../../utils";

import {
  DashboardContainer,
  Information,
  Card,
  LeftCard,
  DesktopOnlyCard,
  AnchorList,
} from "./style";
import NetWorth from "./net-worth";
import ChaosRecipe from "./chaos-recipe";
import PoeRacingWidget from "../poe-racing-widget";
import ManualSnapshot from "./manual-snapshot";

export default function Dashboard() {
  const [summary, setSummary] = useState({});
  const [snapshots, setSnapshots] = useState([]);

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
        <LeftCard>
          <h3>Settings</h3>
          <label>
            <input
              type="checkbox"
              checked={showChaosRecipe}
              onChange={() => {
                localStorage.setItem(SHOW_CHAOS_RECIPE_KEY, !showChaosRecipe);
                setShowChaosRecipe(!showChaosRecipe);
              }}
            />
            Show Chaos Recipe
          </label>
        </LeftCard>
        <DesktopOnlyCard style={{ flexShrink: 1 }}>
          <h3>
            <a href="https://poe-racing.com/" target="_blank">
              Path of Exile Racing
            </a>
          </h3>
          <PoeRacingWidget size={3} />
          {showChaosRecipe && (
            <p>
              The chaos recipe helper looks for tabs that start with "chaos_"
            </p>
          )}
          <h3>Links</h3>
          <AnchorList>
            <a
              href={`https://www.pathofexile.com/trade/search/${
                getSettings()?.league
              }`}
              target="_blank"
            >
              Trade - Path of Exile
            </a>
            <a href="https://www.poelab.com/" target="_blank">
              PoELab
            </a>
            <a href="https://poe.ninja/" target="_blank">
              poe.ninja
            </a>
            <a href="https://www.craftofexile.com/" target="_blank">
              Craft of Exile
            </a>
          </AnchorList>
        </DesktopOnlyCard>
        <Card style={{ flexShrink: 0 }}>
          <h3>Chaos per Ex: {summary?.chaosPerEx}</h3>
          <p>
            Net Worth: {summary?.totalChaosNetWorth?.toFixed(1)} c (
            {summary?.totalExNetWorth?.toFixed(2)} ex)
          </p>
          <NetWorth {...summary} />
          <h4>Snapshots</h4>
          <ManualSnapshot summary={summary} showChaosRecipe={showChaosRecipe} />
        </Card>
        {showChaosRecipe && (
          <Card
            style={{
              flexShrink: 0,
              textAlign: "center",
            }}
          >
            <ChaosRecipe {...summary} />
            <PoeRacingWidget size={2} />
          </Card>
        )}
      </Information>
    </DashboardContainer>
  );
}
