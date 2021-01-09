import React from "react";

import { getStyle } from "./style";

export default function ({ chaosItems, lowestSlot, regalAndChaos }) {
  return chaosItems && lowestSlot && regalAndChaos ? (
    <div>
      <h2
        style={{
          color: chaosItems < lowestSlot ? "red" : "white",
        }}
      >
        Chaos Recipe:{" "}
        {Math.min(chaosItems, ...regalAndChaos.map((a) => a.count))}
      </h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginBottom: "0.5em",
        }}
      >
        {regalAndChaos
          .sort((a, b) => a.count - b.count)
          .map(({ slot, count, chaosCount }) => (
            <div
              style={getStyle(slot, Math.max((20 - count) / 7, 0.1))}
              key={slot}
            >{`${slot}: ${count} (${chaosCount})`}</div>
          ))}
      </div>
    </div>
  ) : (
    <div />
  );
}
