import React from "react";
import styled from "styled-components";

import { Thl, Thr, Tdl, Tdr } from "./style";

const ItemName = styled.div`
  position: relative;
  padding-left: 1.5em;
`;

const ItemIcon = styled.img`
  position: absolute;
  left: -5px;
  top: 0px;
  bottom: 0;
  margin: auto;
  height: 1.6em;
  margin-right: 0.5em;
`;

const itemBlackList = ["Exalted Orb", "Chaos Orb"];

const getTopNExpensiveItems = (combinedItems, n = 5) => {
  if (!Array.isArray(combinedItems)) {
    return [];
  }
  const sortedItems = [...combinedItems]
    .filter((a) => !itemBlackList.includes(a.typeLine))
    .sort((a, b) => b.each - a.each);

  return sortedItems.slice(0, n);
};

const getTopNExpensiveStacks = (combinedItems, n = 5) => {
  if (!Array.isArray(combinedItems)) {
    return [];
  }
  const sortedItems = [...combinedItems]
    .filter((a) => !itemBlackList.includes(a.typeLine))
    .sort((a, b) => b.stackValue - a.stackValue);

  return sortedItems.slice(0, n);
};

export default function NetWorth({ chaosPerEx, specialTab }) {
  if (![chaosPerEx, specialTab].every((a) => a)) {
    return <div>Net worth summary loading...</div>;
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            <Thl>Most Expensive Items</Thl>
            <Thr>#</Thr>
            <Thr>Each</Thr>
            <Thr>Total</Thr>
            <Thr>Tabs</Thr>
          </tr>
        </thead>
        <tbody>
          {getTopNExpensiveItems(specialTab?.combinedItems).map(
            ({ typeLine, icon, each, inTabs, stackSize, stackValue }) => (
              <tr key={typeLine}>
                <Tdl>
                  <ItemName>
                    <ItemIcon src={icon} />
                    {typeLine}
                  </ItemName>
                </Tdl>
                <Tdr>{stackSize}</Tdr>
                <Tdr>{each.toFixed(2)} c</Tdr>
                <Tdr>{stackValue.toFixed(2)} c</Tdr>
                <Tdl>{inTabs.join(", ")}</Tdl>
              </tr>
            )
          )}
        </tbody>
      </table>
      <table style={{ marginTop: "0.5em" }}>
        <thead>
          <tr>
            <Thl>Most Expensive Stacks</Thl>
            <Thr>#</Thr>
            <Thr>Each</Thr>
            <Thr>Total</Thr>
            <Thr>Tabs</Thr>
          </tr>
        </thead>
        <tbody>
          {getTopNExpensiveStacks(specialTab?.combinedItems).map(
            ({ typeLine, icon, each, inTabs, stackSize, stackValue }) => (
              <tr key={typeLine}>
                <Tdl>
                  <ItemName>
                    <ItemIcon src={icon} />
                    {typeLine}
                  </ItemName>
                </Tdl>
                <Tdr>{stackSize}</Tdr>
                <Tdr>{each.toFixed(2)} c</Tdr>
                <Tdr>{stackValue.toFixed(2)} c</Tdr>
                <Tdl>{inTabs.join(", ")}</Tdl>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
