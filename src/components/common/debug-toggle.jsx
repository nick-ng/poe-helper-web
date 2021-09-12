import React from "react";
import styled from "styled-components";

const Container = styled.label`
  position: fixed;
  top: 0;
  right: 0;
  opacity: ${(props) => (props.alwaysShow ? 1 : 0)};
  transition: opacity 0.2s;
  padding: 0.5em;

  &:hover {
    opacity: 1;
  }
`;

export default function DebugToggle({ checked, onChange }) {
  return (
    <Container alwaysShow={checked}>
      Debug:&nbsp;
      <input
        type="checkbox"
        onChange={() => {
          onChange();
        }}
        checked={checked}
      />
    </Container>
  );
}
