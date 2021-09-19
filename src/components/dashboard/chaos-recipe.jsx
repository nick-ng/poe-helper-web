import React, { useState, useEffect } from "react";
import styled from "styled-components";

import { getSettings } from "../../utils";
import { getVoices, sayWithVoice } from "../../services/text-to-speech";
import { VOICE_CHARACTER_STORE, VOICE_VOLUME_STORE } from "../../constants";
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
  const [prevItemTotals, setPrevItemTotals] = useState(0);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(
    localStorage.getItem(VOICE_CHARACTER_STORE) || ""
  );
  const [voiceVolume, setVoiceVolume] = useState(
    parseFloat(localStorage.getItem(VOICE_VOLUME_STORE) || 0.3)
  );

  const itemTotals = regalAndChaos.reduce((prev, curr) => {
    return prev + curr.count;
  }, 0);

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
    const { agentPort } = getSettings();
    if (agentPort && itemTotals !== prevItemTotals) {
      const itemCountsString = JSON.stringify(
        regalAndChaos.reduce((prev, curr) => {
          prev[curr.slot] = curr.count;
          return prev;
        }, {})
      );

      fetch(`http://localhost:${agentPort}/chaos-filter`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: itemCountsString,
      }).then(() => {
        if (voiceVolume > 0) {
          setPrevItemTotals(itemTotals);
          sayWithVoice("Loot filter updated.", selectedVoice, {
            volume: voiceVolume,
          });
        }
      });
    }
  }, [itemTotals]);

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
