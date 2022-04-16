import React, { useState } from "react";

import {
  SHOW_CHAOS_RECIPE_KEY,
  SHOW_TWITCH_CHAT_KEY,
  TWITCH_CHAT_FIRST_KEY,
} from "../../../constants";

import { getSettings } from "../../../utils";
import { getUrls } from "../../cheat-sheet/links";

import DebugToggle from "../../common/debug-toggle";
import {
  DashboardContainer,
  Information,
  Card,
  LeftCard,
  DesktopOnlyCard,
  AnchorList,
  LabelList,
} from "../style";
import NetWorth from "../net-worth";
import ChaosRecipe from "../chaos-recipe";
import PoeRacingWidget from "../../poe-racing-widget";
import TwitchChatWidget from "../../twitch-chat-widget";
import ManualSnapshot from "../manual-snapshot";

export default function DefaultDashboard({ summary }) {
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
  const [debugMode, setDebugMode] = useState(false);

  const isLoading = Object.keys(summary).length === 0;

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
            <h3>Twitch Chat - {getSettings()?.twitchChannel}</h3>
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
            {getUrls(getSettings).map(({ url, title }) => (
              <a key={url} href={url} target="_blank">
                {title}
              </a>
            ))}
          </AnchorList>
          {showChaosRecipe && (
            <p>
              The chaos recipe helper looks for tabs that start with "chaos_"
            </p>
          )}
        </DesktopOnlyCard>
        <DesktopOnlyCard>
          <h3>Chaos per Ex: {summary?.chaosPerEx}</h3>
          <table>
            <tbody>
              {[9, 8, 7, 6, 5, 4, 3, 2, 1].map((a) => (
                <tr key={`partial-ex-${a}`}>
                  <td style={{ textAlign: "right" }}>{a / 10} ex</td>
                  <td style={{ textAlign: "right" }}>
                    {(summary?.chaosPerEx * (a / 10)).toFixed(2)} c
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </DesktopOnlyCard>
        <Card style={{ flexShrink: 0 }}>
          {isLoading ? (
            <>
              <h3>Net Worth</h3>
              <div>Please wait, loading...</div>
            </>
          ) : (
            <>
              <h3>
                Net Worth: {summary?.totalChaosNetWorth?.toFixed(1)} c (
                {summary?.totalExNetWorth?.toFixed(2)} ex){" "}
              </h3>
              <NetWorth {...summary} />
              <h4>Snapshots</h4>
              <ManualSnapshot
                summary={summary}
                showChaosRecipe={showChaosRecipe}
              />
            </>
          )}
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
      <DebugToggle
        onChange={() => {
          setDebugMode((prev) => !prev);
        }}
        checked={debugMode}
      />
    </DashboardContainer>
  );
}
