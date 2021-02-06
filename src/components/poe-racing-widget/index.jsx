import React from "react";
import { Link } from "react-router-dom";

import { getSettings } from "../../utils";

const SIZES = {
  1: {
    width: "170px",
    height: "62px",
  },
  2: {
    width: "170px",
    height: "98px",
  },
  3: {
    width: "350px",
    height: "220px",
  },
};

export default function PoeRacingWidget({ size }) {
  const { characterName, league } = getSettings();
  return league && characterName && size ? (
    <iframe
      src={`https://tracker.poe-racing.com/?event=${league}&character=${characterName}&size=${size}`}
      width={SIZES[size]?.width || "350px"}
      height={SIZES[size]?.height || "220px"}
    />
  ) : (
    <p>
      Please enter at Character name on the{" "}
      <Link to="/settings">Settings page</Link>.
    </p>
  );
}
