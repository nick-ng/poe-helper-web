import React from "react";
import { Link } from "react-router-dom";

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
    <p>
      Please enter a Twitch channel on the{" "}
      <Link to="/settings">Settings page</Link>.
    </p>
  );
}
