import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { getSettings } from "../../utils";
import { IGNORED_ITEMS_KEY } from "../../constants";

import DebugToggle from "../common/debug-toggle";
import StashTab, { priceItems } from "./stash-tab";
import StashTabManager from "./stash-tab-manager";

const Container = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1em;
`;

const StashTabNav = styled.div`
  display: flex;
  margin-top: 1em;
  flex-direction: column;
`;

const StashTabButton = styled.button`
  background-color: ${(props) => (props.active ? "#555555" : "black")};
  color: white;
  border: 1px solid grey;
  padding: 0.3em 1em;

  display: flex;
  flex-direction: row;
  justify-content: space-between;

  & span ~ span {
    margin-left: 0.5em;
  }
`;

const getActiveTab = (tabs, activeTabName) => {
  if (!tabs) {
    return null;
  }

  const activeTab = tabs.find((tab) => tab.n === activeTabName);

  return activeTab || tabs[0];
};

export default function StashDetails({ summary }) {
  const [activeTabName, setActiveTabName] = useState(null);
  const [stashTotals, setStashTotals] = useState({});
  const [ignoredItems, setIgnoredItems] = useState(getSettings()?.ignoredItems);
  const [debugMode, setDebugMode] = useState(false);

  const { fullTabs } = summary;

  useEffect(() => {
    const updateTabTotals = async () => {
      const { fullTabs } = summary;
      if (!fullTabs) {
        return;
      }
      const results = await Promise.all(
        fullTabs.map(async (tab) => {
          const { totals } = await priceItems(tab.items, ignoredItems);
          return {
            id: tab.id,
            totals,
          };
        })
      );

      const b = results.reduce((prev, curr) => {
        const { id, totals } = curr;
        prev[id] = totals;
        return prev;
      }, {});

      setStashTotals(b);
    };

    updateTabTotals();
  }, [summary]);

  useEffect(() => {
    localStorage.setItem(IGNORED_ITEMS_KEY, JSON.stringify(ignoredItems));
  }, [ignoredItems]);

  if (!fullTabs) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <StashTabNav>
        {fullTabs?.map((tab, i) => {
          const totals = stashTotals[tab.id];

          return (
            <StashTabButton
              key={tab.id}
              onClick={() => {
                setActiveTabName(tab.n);
              }}
              active={activeTabName ? activeTabName === tab.n : i === 0}
            >
              <span>
                {tab.n}
                {tab.isGuild && " (Guild)"}
              </span>
              {totals && <span>{`${totals.c.toFixed(0)}c`}</span>}
              {debugMode && <span>{tab.type}</span>}
            </StashTabButton>
          );
        })}
      </StashTabNav>
      <StashTab
        tab={getActiveTab(fullTabs, activeTabName)}
        ignoredItems={ignoredItems}
        setIgnoredItems={setIgnoredItems}
        debugMode={debugMode}
      />
      <StashTabManager />
      <DebugToggle
        onChange={() => {
          setDebugMode((prev) => !prev);
        }}
        checked={debugMode}
      />
    </Container>
  );
}
