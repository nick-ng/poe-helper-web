import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { getSummary } from "../../services/poe-stash-valuation";
import { getSnapshots, saveSnapshot } from "../../services/snapshots";
import { STASH_REFRESH_TIMEOUT } from "../../constants";

import StashTab from "./stash-tab";
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
`;

const getActiveTab = (tabs, activeTabName) => {
  if (!tabs) {
    return null;
  }

  const activeTab = tabs.find((tab) => tab.n === activeTabName);

  return activeTab || tabs[0];
};

export default function StashDetails() {
  const [summary, setSummary] = useState({});
  const [snapshots, setSnapshots] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [activeTabName, setActiveTabName] = useState(null);

  const refresh = async () => {
    setFetching(true);
    const newSummary = await getSummary();
    setSummary(newSummary);
    await saveSnapshot(newSummary);
    const allSnapshots = await getSnapshots();
    setSnapshots(allSnapshots);
    setFetching(false);
  };

  useEffect(() => {
    (async () => {
      const allSnapshots = await getSnapshots();
      setSnapshots(allSnapshots);
      setSummary(allSnapshots[0]?.data);
    })();

    let running = true;
    async function refresher() {
      if (!running) {
        return;
      }

      await refresh();

      setTimeout(refresher, STASH_REFRESH_TIMEOUT);
    }
    refresher();

    return () => {
      running = false;
    };
  }, []);

  const { fullTabs } = summary;

  if (!fullTabs) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <StashTabNav>
        {fullTabs?.map((tab, i) => {
          return (
            <StashTabButton
              key={tab.id}
              onClick={() => {
                setActiveTabName(tab.n);
              }}
              active={activeTabName ? activeTabName === tab.n : i === 0}
            >
              {tab.n}
            </StashTabButton>
          );
        })}
      </StashTabNav>
      <StashTab tab={getActiveTab(fullTabs, activeTabName)} />
      <StashTabManager refresh={refresh} />
    </Container>
  );
}
