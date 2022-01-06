import React from "react";
import styled from "styled-components";

import GemDisplay from "./gem-display";

const Container = styled.tr``;

export default function QuestDisplay({
  gemData,
  questName,
  questSelection,
  vendorSelection,
  doingLibrary,
}) {
  return (
    <Container>
      <td>{questName}</td>
      <td></td>
    </Container>
  );
}
