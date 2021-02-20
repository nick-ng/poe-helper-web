import React, { useState } from "react";
import styled from "styled-components";

import { TOP_N_MOST_EXPENSIVE_KEY } from "../../constants";
import { getSettings } from "../../utils";
import { Thl, Thr, Tdl, Tdr } from "./style";

const Container = styled.div`
  table {
    margin-top: 0.5em;
  }
`;

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
  console.log("chaosPerEx", chaosPerEx);
  console.log("special tab", specialTab);
  if (![chaosPerEx, specialTab].every((a) => a)) {
    return <div>Net worth summary loading...</div>;
  }

  const [topNMostExpensive, setTopNMostExpensive] = useState(
    getSettings()?.topNMostExpensive ?? 5
  );

  return (
    <Container>
      <input
        style={{ fontSize: "11pt", width: "5em" }}
        onChange={(event) => {
          const value = parseInt(event.target.value);
          localStorage.setItem(TOP_N_MOST_EXPENSIVE_KEY, value);
          setTopNMostExpensive(value);
        }}
        value={topNMostExpensive}
        type="number"
      ></input>
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
          {getTopNExpensiveItems(
            specialTab?.combinedItems,
            topNMostExpensive
          ).map(({ typeLine, icon, each, inTabs, stackSize, stackValue }) => (
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
          ))}
        </tbody>
      </table>
      <table>
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
          {getTopNExpensiveStacks(
            specialTab?.combinedItems,
            topNMostExpensive
          ).map(({ typeLine, icon, each, inTabs, stackSize, stackValue }) => (
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
          ))}
        </tbody>
      </table>
    </Container>
  );
}
