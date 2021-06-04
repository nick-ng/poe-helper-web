import React, { useReducer } from "react";
import styled from "styled-components";

const Container = styled.div`
  border-bottom: 1px solid grey;
  padding: 0.2em;
  flex-direction: row;
  justify-content: flex-start;

  &:last-of-type {
    border-bottom: none;
  }

  input:first-of-type {
    margin-left: 0;
  }

  div {
    white-space: nowrap;
  }
`;

export default function ({ mapName, atlas, bonus, awakening, onChange }) {
  const handleChange = (next) => {
    onChange({
      atlas,
      bonus,
      awakening,
      ...next,
    });
  };

  return (
    <Container>
      <div>{mapName.replace(/map/i, "").trim()}</div>
      <input
        type="checkbox"
        onChange={() => handleChange({ atlas: !atlas })}
        checked={atlas}
      />
      <input
        type="checkbox"
        onChange={() => handleChange({ bonus: !bonus })}
        checked={bonus}
      />
      <input
        type="checkbox"
        onChange={() => handleChange({ awakening: !awakening })}
        checked={awakening}
      />
    </Container>
  );
}
