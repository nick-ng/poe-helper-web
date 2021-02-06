import React from "react";
import { getSettings } from "../../utils";

export default function TwitchChatWidget() {
  const { twitchChannel } = getSettings();
  const parent = location.hostname;
  return twitchChannel ? (
    <iframe
      src={`https://www.twitch.tv/embed/${twitchChannel}/chat?parent=${parent}&darkpopout`}
      height="100%"
      width="345px"
    />
  ) : (
    <div />
  );
}
