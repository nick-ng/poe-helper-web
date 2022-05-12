import React, { useState } from "react";
import styled from "styled-components";

import EZForm from "./ez-form";

import {
  POE_RACING_LEAGUE_STORE,
  POE_RACING_CHARACTERS_STORE,
  POE_RACING_SIZE_STORE,
} from "../../constants";

const parseJson = (jsonString, defaultResult = []) => {
  try {
    return JSON.parse(jsonString) || defaultResult;
  } catch (e) {
    return defaultResult;
  }
};

const trackerSizes = {
  1: { width: 175, height: 65 },
  2: { width: 175, height: 115 },
  3: { width: 350, height: 230 },
};

const Container = styled.div``;

const AllTrackers = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
`;

const PoeRacingTracker = styled.div`
  margin-top: 0.5em;
  text-align: center;

  iframe {
    border: 1px solid grey;
  }
`;

export default function PoeRacingTrackers() {
  const [charactersJSON, setCharactersJSON] = useState(() =>
    localStorage.getItem(POE_RACING_CHARACTERS_STORE)
  );
  const [defaultLeague, setDefaultLeague] = useState(() =>
    localStorage.getItem(POE_RACING_LEAGUE_STORE)
  );
  const [trackerSize, setTrackerSize] = useState(() =>
    parseInt(localStorage.getItem(POE_RACING_SIZE_STORE) || 2)
  );

  const characters = parseJson(charactersJSON);

  return (
    <Container>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
        }}
      >
        <EZForm
          label="Change Default League"
          submitHandler={(newLeague) => {
            setDefaultLeague(newLeague);
            localStorage.setItem(POE_RACING_LEAGUE_STORE, newLeague);
            return "";
          }}
        />
        <div style={{ marginLeft: "1em" }}>
          <div>Tracker Size</div>
          <div>
            <label>
              <input
                type="radio"
                name="tracker-size"
                value="1"
                checked={trackerSize === 1}
                onChange={() => {
                  setTrackerSize(1);
                  localStorage.setItem(POE_RACING_SIZE_STORE, 1);
                }}
              />
              1
            </label>{" "}
            <label>
              <input
                type="radio"
                name="tracker-size"
                value="2"
                checked={trackerSize === 2}
                onChange={() => {
                  setTrackerSize(2);
                  localStorage.setItem(POE_RACING_SIZE_STORE, 2);
                }}
              />
              2
            </label>{" "}
            <label>
              <input
                type="radio"
                name="tracker-size"
                value="3"
                checked={trackerSize === 3}
                onChange={() => {
                  setTrackerSize(3);
                  localStorage.setItem(POE_RACING_SIZE_STORE, 3);
                }}
              />
              3
            </label>
          </div>
        </div>
      </div>
      <h1>
        <a href="https://poe-racing.com/" target="_blank">
          PoE Racing
        </a>{" "}
        Trackers: {defaultLeague}
      </h1>
      <EZForm
        label="Add Character"
        submitHandler={(newCharacter) => {
          const newCharactersJSON = JSON.stringify([
            ...characters,
            newCharacter,
          ]);
          setCharactersJSON(newCharactersJSON);
          localStorage.setItem(POE_RACING_CHARACTERS_STORE, newCharactersJSON);
          return "";
        }}
        placeholder="Character:League (Character name and league are case-sensitive)"
        style={{ width: "30em" }}
      />
      <AllTrackers>
        {characters.map((character) => {
          const [characterName, league] = character
            .split(":")
            .map((a) => a.trim());
          const poeRacingUrl = `https://tracker.poe-racing.com/?size=${trackerSize}&special=EXPERIENCE&event=${
            league || defaultLeague
          }&character=${characterName}`;
          return (
            <PoeRacingTracker key={`${character}-poe-racing-tracker`}>
              <div
                style={{
                  maxWidth: `${trackerSizes[trackerSize].width}px`,
                  height: "25px",
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  marginBottom: "3px",
                }}
              >
                {character}
              </div>
              <iframe
                key={`${character}-poe-racing-tracker-iframe`}
                src={poeRacingUrl}
                width={trackerSizes[trackerSize].width}
                height={trackerSizes[trackerSize].height}
              />
              <div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(poeRacingUrl);
                  }}
                >
                  Copy Tracker URL
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Stop tracking ${character}?`)) {
                      const newCharactersJSON = JSON.stringify(
                        characters.filter((a) => a !== character)
                      );
                      setCharactersJSON(newCharactersJSON);
                      localStorage.setItem(
                        POE_RACING_CHARACTERS_STORE,
                        newCharactersJSON
                      );
                    }
                  }}
                >
                  X
                </button>
              </div>
            </PoeRacingTracker>
          );
        })}
      </AllTrackers>
    </Container>
  );
}
