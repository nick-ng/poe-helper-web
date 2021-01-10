import React from "react";

import { getStyle } from "./style";

const defaultRegalAndChaos = [
  {
    slot: "boot",
    count: 0,
    chaosCount: 0,
  },
  {
    slot: "body",
    count: 0,
    chaosCount: 0,
  },
  {
    slot: "helm",
    count: 0,
    chaosCount: 0,
  },
  {
    slot: "glove",
    count: 0,
    chaosCount: 0,
  },
  {
    slot: "ring",
    count: 0,
    chaosCount: 0,
  },
  {
    slot: "weapon",
    count: 0,
    chaosCount: 0,
  },
  {
    slot: "belt",
    count: 0,
    chaosCount: 0,
  },
  {
    slot: "amulet",
    count: 0,
    chaosCount: 0,
  },
];

export default function ({
  chaosItems = 0,
  lowestSlot = 0,
  regalAndChaos = defaultRegalAndChaos,
}) {
  return (
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
  );
}
