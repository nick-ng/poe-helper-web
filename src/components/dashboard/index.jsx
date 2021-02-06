import React, { useState, useEffect } from "react";

import {
  STASH_REFRESH_TIMEOUT,
  SHOW_CHAOS_RECIPE_KEY,
  SHOW_TWITCH_CHAT_KEY,
  TWITCH_CHAT_FIRST_KEY,
} from "../../constants";
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
  LabelList,
} from "./style";
import NetWorth from "./net-worth";
import ChaosRecipe from "./chaos-recipe";
import PoeRacingWidget from "../poe-racing-widget";
import TwitchChatWidget from "../twitch-chat-widget";
import ManualSnapshot from "./manual-snapshot";

export default function Dashboard() {
  const [summary, setSummary] = useState({});
  const [snapshots, setSnapshots] = useState([]);

  // Controls
  const [showChaosRecipe, setShowChaosRecipe] = useState(
    localStorage.getItem(SHOW_CHAOS_RECIPE_KEY) === "true"
  );
  const [showTwitchChat, setShowTwitchChat] = useState(
    localStorage.getItem(SHOW_TWITCH_CHAT_KEY) === "true"
  );
  const [twitchChatFirst, setTwitchChatFirst] = useState(
    localStorage.getItem(TWITCH_CHAT_FIRST_KEY) === "true"
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
          <LabelList>
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
            <label>
              <input
                type="checkbox"
                checked={showTwitchChat}
                onChange={() => {
                  localStorage.setItem(SHOW_TWITCH_CHAT_KEY, !showTwitchChat);
                  setShowTwitchChat(!showTwitchChat);
                }}
              />
              Show Twitch Chat
            </label>
            {showTwitchChat && (
              <label>
                <input
                  type="checkbox"
                  checked={twitchChatFirst}
                  onChange={() => {
                    localStorage.setItem(
                      TWITCH_CHAT_FIRST_KEY,
                      !twitchChatFirst
                    );
                    setTwitchChatFirst(!twitchChatFirst);
                  }}
                />
                Twitch Chat First
              </label>
            )}
          </LabelList>
        </LeftCard>
        {showTwitchChat && (
          <DesktopOnlyCard
            style={{ order: twitchChatFirst ? -1 : 0, width: "350px" }}
          >
            <h3>Twitch Chat</h3>
            <TwitchChatWidget />
          </DesktopOnlyCard>
        )}
        <DesktopOnlyCard style={{ flexShrink: 1 }}>
          {!showChaosRecipe && (
            <h3>
              <a href="https://poe-racing.com/" target="_blank">
                Path of Exile Racing
              </a>
            </h3>
          )}
          {!showChaosRecipe && <PoeRacingWidget size={3} />}
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
          {showChaosRecipe && (
            <p>
              The chaos recipe helper looks for tabs that start with "chaos_"
            </p>
          )}
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
