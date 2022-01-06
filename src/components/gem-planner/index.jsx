import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";

import { GEM_PLANNER_STORE } from "../../constants";

import GemDisplay from "./gem-display";

const PLAYER_CLASSES = [
  "Duelist",
  "Marauder",
  "Ranger",
  "Scion",
  "Shadow",
  "Templar",
  "Witch",
];

const QUEST_ORDER = [
  [
    "Enemy at the Gate",
    "The Twilight Strand",
    "Breaking Some Eggs",
    "The Caged Brute",
    "The Siren's Cadence",
  ],
  ["Intruders in Black", "The Root of the Problem"],
];

const Container = styled.div``;

export default function GemPlanner() {
  const [gemData, setGemData] = useState([]);
  const [playerClass, setPlayerClass] = useState("Scion");
  const [questSelection, setQuestSelection] = useState([]);
  const [vendorSelection, setVendorSelection] = useState([]);
  const [doingLibrary, setDoingLibrary] = useState(false);

  const handleGemSelection = (gemName, rewardType, selected) => {
    if (rewardType === "vendor") {
      if (selected) {
        setVendorSelection((prev) => prev.concat([gemName]));
      } else {
        setVendorSelection((prev) => prev.filter((a) => a !== gemName));
      }
    }

    if (selected) {
      setQuestSelection((prev) => prev.concat([gemName]));
    } else {
      setQuestSelection((prev) => prev.filter((a) => a !== gemName));
    }
  };

  useEffect(() => {
    const fetchGemData = async () => {
      try {
        const res = await fetch("/gem-data.json");
        const resJson = await res.json();
        setGemData(resJson);
      } catch (e) {
        console.error(e);
      }
    };

    fetchGemData();
  }, []);

  const filteredGems = useMemo(
    () =>
      gemData.filter((gemDatum) => {
        const { classes } = gemDatum;
        return classes.includes(playerClass) || classes.includes("All");
      }),
    [gemData, playerClass]
  );

  return (
    <Container>
      <h2>Gem Planner</h2>
      <label>
        Class:{" "}
        <select
          onChange={(e) => {
            setPlayerClass(e.target.value);
          }}
          value={playerClass}
        >
          {PLAYER_CLASSES.map((playerClass) => {
            return (
              <option key={playerClass} value={playerClass}>
                {playerClass}
              </option>
            );
          })}
        </select>
      </label>
      <div>
        {filteredGems.map(({ gem, imageURL }) => {
          return <GemDisplay gem={gem} imageURL={imageURL} />;
        })}
      </div>
    </Container>
  );
}
