import React from "react";
import styled from "styled-components";

import FlaskAffixes from "./flask-affixes";
import CraftingIlvl from "./crafting-ilvl";
import ResistOvercap from "./resist-overcap";
import Links from "./links";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;

  table {
    border-collapse: collapse;

    th {
      padding: 0.5em;
    }

    td {
      padding: 0.3em 0.5em;
    }

    th,
    td {
      border: 1px solid lightgrey;
    }

    tr:nth-child(odd) {
      td {
        background-color: #333333;
      }
    }
  }

  li {
    line-height: 1.5;
  }

  & > * {
    margin: 0.5em 0.5em 0;
  }
`;

export default function CheatSheet() {
  return (
    <Container>
      <Links />
      <FlaskAffixes />
      <CraftingIlvl />
      <ResistOvercap />
    </Container>
  );
}
