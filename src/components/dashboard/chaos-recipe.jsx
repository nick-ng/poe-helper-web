import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";

import { getSettings } from "../../utils";
import { getVoices, sayWithVoice } from "../../services/text-to-speech";
import {
  VOICE_CHARACTER_STORE,
  VOICE_VOLUME_STORE,
  LAST_CHAOS_FILTER_SIZES_STORE,
} from "../../constants";
import { getStyle } from "./style";

const LOW_ITEM_THRESHOLD = 3;
const HIGH_ITEM_THRESHOLD = 8;
const LOW_FONT_SIZE = 15;
const HIGH_FONT_SIZE = 45;

/**
 * @param {number} count
 * @return {number} size
 */
const getSize = (count) => {
  if (count < LOW_ITEM_THRESHOLD) {
    return HIGH_FONT_SIZE;
  }

  if (count > HIGH_ITEM_THRESHOLD) {
    return 0;
  }

  return LOW_FONT_SIZE;
};

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

const Container = styled.div`
  text-align: right;
`;

const VoiceControls = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export default function ({
  chaosItems = 0,
  lowestSlot = 0,
  regalAndChaos = defaultRegalAndChaos,
}) {
  const isFirstRun = useRef(true);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(
    localStorage.getItem(VOICE_CHARACTER_STORE) || ""
  );
  const [voiceVolume, setVoiceVolume] = useState(
    parseFloat(localStorage.getItem(VOICE_VOLUME_STORE) || 0.3)
  );

  const itemSizes = regalAndChaos.reduce((prev, curr) => {
    prev[curr.slot] = getSize(curr.count);
    return prev;
  }, {});

  const itemSizeString = Object.keys(itemSizes)
    .sort((a, b) => a.localeCompare(b))
    .map((a) => itemSizes[a])
    .join("-");

  useEffect(() => {
    const bb = async () => {
      const newVoices = await getVoices();
      setVoices(newVoices);
      if (!selectedVoice) {
        const defaultVoice = newVoices.filter((a) => a.default);
        if (defaultVoice.length > 0) {
          setSelectedVoice(defaultVoice[0].voiceURI);
          localStorage.setItem(VOICE_CHARACTER_STORE, defaultVoice[0].voiceURI);
        } else {
          const enVoices = newVoices.filter((a) => a.lang.startsWith("en-"));
          setSelectedVoice(enVoices[0].voiceURI);
          localStorage.setItem(VOICE_CHARACTER_STORE, enVoices[0].voiceURI);
        }
      }
    };

    bb();
  }, []);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    const { agentPort } = getSettings();
    if (agentPort) {
      const lastChaosFilterSizes = localStorage.getItem(
        LAST_CHAOS_FILTER_SIZES_STORE
      );
      if (lastChaosFilterSizes === itemSizeString) {
        return;
      }
      localStorage.setItem(LAST_CHAOS_FILTER_SIZES_STORE, itemSizeString);

      fetch(`http://localhost:${agentPort}/chaos-filter`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemSizes),
      }).then(() => {
        if (voiceVolume > 0) {
          sayWithVoice("Loot filter updated.", selectedVoice, {
            volume: voiceVolume,
          });
        }
      });
    }
  }, [itemSizeString]);

  return (
    <Container>
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
      <VoiceControls>
        <label>
          Voice:&nbsp;
          <select
            onChange={(e) => {
              localStorage.setItem(VOICE_CHARACTER_STORE, e.target.value);
              setSelectedVoice(e.target.value);
            }}
            value={selectedVoice}
          >
            {voices
              .filter((a) => a.lang.startsWith("en-"))
              .map(({ name, voiceURI }) => (
                <option key={voiceURI} value={voiceURI}>
                  {name}
                </option>
              ))}
          </select>
        </label>
        <label>
          Volume:&nbsp;
          <input
            type="number"
            value={voiceVolume}
            min="0"
            max="1"
            step="0.05"
            onChange={(e) => {
              setVoiceVolume(parseFloat(e.target.value));
              localStorage.setItem(VOICE_VOLUME_STORE, e.target.value);
            }}
          />
        </label>
      </VoiceControls>
    </Container>
  );
}
