import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 30vw;
  display: flex;
  flex-direction: column;
`;

const NON_ATLAS_MAPS = [
  "The Beachhead Map",
  "Pit of the Chimera Map",
  "Lair of the Hydra Map",
  "Maze of the Minotaur Map",
  "Forge of the Phoenix Map",
];

export default function ({ onUpdate, onReset }) {
  const [rawMapTiers, setRawMapTiers] = useState("");

  return (
    <Container>
      <textarea
        onChange={(e) => {
          setRawMapTiers(e.target.value);
        }}
        value={rawMapTiers}
      />
      <div>
        <button
          onClick={() => {
            const newAtlas = {};
            rawMapTiers
              .split(/tier/i)
              .filter((e) => e)
              .map((a) =>
                a
                  .split(/\n+/)
                  .filter((e) => e)
                  .map((e) => e.trim())
                  .filter((e) => !NON_ATLAS_MAPS.includes(e))
              )
              .forEach((mapTier) => {
                const [tier, ...maps] = mapTier;
                newAtlas[tier] = maps;
              });
            console.log("New Atlas", JSON.stringify(newAtlas));
            onUpdate(newAtlas);
          }}
        >
          Update
        </button>
        <button onClick={onReset}>Reset</button>
      </div>
    </Container>
  );
}
