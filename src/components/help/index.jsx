import React from "react";
import styled from "styled-components";

const Container = styled.div``;

const Column = styled.div`
  & ~ & {
    margin-left: 0.5em;
  }
`;

const Columns = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;

export default function Help() {
  return (
    <Container>
      <h1>Path of Exile Tools</h1>
      <h2>Help</h2>
      <Columns>
        <Column>
          <p>Chaos Loot Filter. Paste at the top of your loot filter.</p>
          <textarea
            style={{ width: "35em", height: "50vh" }}
            onChange={() => {}}
            onClick={(e) => {
              e.target.select();
            }}
            value={getChaosLootFilter()}
          />
        </Column>
      </Columns>
    </Container>
  );
}

function getChaosLootFilter() {
  return `Show
	Class "Body Armour"
	SetBorderColor 255 255 255
	Continue

Show
	Class "Gloves"
	SetBorderColor 255 0 0
	Continue

Show
	Class "Boots"
	SetBorderColor 0 0 255
	Continue

Show
	Class "Helm"
	SetBorderColor 0 255 0
	Continue

Show
	Class "Ring"
	SetBorderColor 255 0 255
	Continue

Show
	Class "Amulet"
	SetBorderColor 255 255 0
	Continue

Show
	Class "Belt"
	SetBorderColor 0 255 255
	Continue

Show
	ItemLevel >= 60
	Class "Gloves" "Helm" "Boots" "Body Armour"
	Rarity Rare
	Identified False
	Sockets < 6
	LinkedSockets < 5
	SetBackgroundColor 0 0 0
	SetTextColor 255 255 119
	SetFontSize 30

Show
	ItemLevel >= 60
	Class "Ring" "Amulet" "Belt"
	Rarity Rare
	Identified False
	SetBackgroundColor 0 0 0
	SetTextColor 255 255 119
	SetFontSize 40

Show
	ItemLevel >= 60
	Class "Bow"
	Rarity Rare
	Height 3
	Width 2
	Identified False
	Sockets < 6
	LinkedSockets < 5
	SetBackgroundColor 0 0 0
	SetBorderColor 0 0 0
	SetTextColor 255 255 119
	SetFontSize 30

Show
	ItemLevel >= 60
	Rarity Rare
	Height 3
	Width 1
	Identified False
	SetBackgroundColor 0 0 0
	SetBorderColor 0 0 0
	SetTextColor 255 255 119
	SetFontSize 30
`;
}
