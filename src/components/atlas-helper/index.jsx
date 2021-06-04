import React, { useEffect, useState, useReducer } from "react";
import styled from "styled-components";
import { range } from "lodash";

import {
  ATLAS_HELPER_ATLAS_KEY,
  ATLAS_HELPER_COMPLETION_KEY,
} from "../../constants";

import AtlasMap from "./atlas-map";
import AtlasParser from "./atlas-parser";
import defaultAtlas from "./default-atlas";

const MAP_TIERS = range(1, 17);

const Container = styled.div``;

const Table = styled.table`
  border-collapse: collapse;
  border: 1px solid grey;
  margin: 0.5em 0;

  td,
  th {
    border: 1px solid grey;
  }

  th {
    padding: 0.2em;
  }

  td {
    padding: 0.2em 0;
    vertical-align: top;
    padding: 0;
    overflow: hidden;
  }
`;

const Controls = styled.div`
  label {
    margin-right: 0.5em;
  }
`;

const initialState = {};

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "update":
      return { ...state, [payload.mapName]: payload.completion };
    case "set":
      return payload;
    default:
      throw new Error(
        `Unhandled dispatch type: ${JSON.stringify(action, null, "  ")}`
      );
  }
};

export default function AtlasHelper() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [atlas, setAtlas] = useState(defaultAtlas);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const savedCompletion = JSON.parse(
      localStorage.getItem(ATLAS_HELPER_COMPLETION_KEY) || "{}"
    );
    dispatch({
      type: "set",
      payload: savedCompletion,
    });

    const rawSavedAtlas = localStorage.getItem(ATLAS_HELPER_ATLAS_KEY);
    if (rawSavedAtlas) {
      setAtlas(JSON.parse(rawSavedAtlas));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(ATLAS_HELPER_COMPLETION_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    localStorage.setItem(ATLAS_HELPER_ATLAS_KEY, JSON.stringify(atlas));
  }, [atlas]);

  return (
    <Container>
      <h2>Atlas Helper</h2>
      <Controls>
        <label>
          <input
            type="radio"
            name="atlas-filter"
            value="all"
            checked={filter === "all"}
            onChange={() => setFilter("all")}
          />
          All
        </label>
        <label>
          <input
            type="radio"
            name="atlas-filter"
            value="atlas"
            checked={filter === "atlas"}
            onChange={() => setFilter("atlas")}
          />
          Atlas
        </label>
        <label>
          <input
            type="radio"
            name="atlas-filter"
            value="bonus"
            checked={filter === "bonus"}
            onChange={() => setFilter("bonus")}
          />
          Bonus
        </label>
        <label>
          <input
            type="radio"
            name="atlas-filter"
            value="awakening"
            checked={filter === "awakening"}
            onChange={() => setFilter("awakening")}
          />
          Awakening
        </label>
      </Controls>
      <Table>
        <thead>
          <tr>
            {MAP_TIERS.map((tier) => (
              <th key={`map-tier-${tier}`}>{tier}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {MAP_TIERS.map((tier) => (
              <td key={`map-list-tier-${tier}`}>
                {atlas[tier]?.sort().map((mapName) => {
                  const atlas =
                    state[mapName]?.atlas ||
                    state[mapName]?.bonus ||
                    state[mapName]?.awakening ||
                    false;
                  const bonus = state[mapName]?.bonus || false;
                  const awakening = state[mapName]?.awakening || false;
                  if (
                    (filter === "atlas" && atlas) ||
                    (filter === "bonus" && bonus) ||
                    (filter === "awakening" && awakening)
                  ) {
                    return null;
                  }
                  return (
                    <AtlasMap
                      key={mapName}
                      mapName={mapName}
                      atlas={atlas}
                      bonus={bonus}
                      awakening={awakening}
                      onChange={(completion) => {
                        dispatch({
                          type: "update",
                          payload: {
                            mapName,
                            completion,
                          },
                        });
                      }}
                    />
                  );
                })}
              </td>
            ))}
          </tr>
        </tbody>
      </Table>
      <Controls>
        <button
          onClick={() => {
            if (confirm("Really reset all map completion?"))
              dispatch({ type: "set", payload: {} });
          }}
        >
          Reset
        </button>
      </Controls>
      <AtlasParser
        onUpdate={(newAtlas) => setAtlas(newAtlas)}
        onReset={() => setAtlas(defaultAtlas)}
      />
    </Container>
  );
}
