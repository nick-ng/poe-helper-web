import React, { useEffect, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { BrowserRouter as Router, Switch, Route as R } from "react-router-dom";

import { useStashSummary } from "./services/use-stash-summary";
import { STASH_REFRESH_TIMEOUT } from "./constants";

import Nav from "./components/nav";

import Dashboard from "./components/dashboard";
import ItemSearch from "./components/item-search";
import StashDetails from "./components/stash-details";
import AtlasHelper from "./components/atlas-helper";
import LootFilterHelper from "./components/loot-filter-helper";
import NotFound from "./components/not-found";
import Settings from "./components/settings";
import GemPlanner from "./components/gem-planner";
import PoeRacingTrackers from "./components/poe-racing-trackers";
import CheatSheet from "./components/cheat-sheet";
import Help from "./components/help";

const GlobalStyle = createGlobalStyle`
body {
  color: white;
  background-color: black;
  font-family: sans-serif;
}

a {
  color: LightSteelBlue;
}
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: max-content auto;
  gap: 0 10px;
`;

const RefreshBar = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  width: 8px;

  background-color: grey;

  ${(props) =>
    props.countdown === 0
      ? `
  transition: height 0.1s linear;
  height: 100vh;
  `
      : `
  transition: height ${props.countdown}s linear;
  height: 0;
  `}
`;

export default function App() {
  const stashSummary = useStashSummary();

  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    setCountdown(0);

    setTimeout(() => {
      setCountdown(STASH_REFRESH_TIMEOUT / 1000);
    }, 110);
  }, [stashSummary]);

  return (
    <Router>
      <GlobalStyle />
      <Container>
        <Nav />
        <Switch>
          <R path="/settings">
            <Settings />
          </R>
          <R path="/item-search">
            <ItemSearch />
          </R>
          <R path="/" exact>
            <Dashboard summary={stashSummary} />
          </R>
          <R path="/stash-details">
            <StashDetails summary={stashSummary} />
          </R>
          <R path="/atlas-helper">
            <AtlasHelper />
          </R>
          <R path="/loot-filter-helper">
            <LootFilterHelper />
          </R>
          <R path="/poe-racing">
            <PoeRacingTrackers />
          </R>
          <R path={["/cheat-sheet", "/cheat"]}>
            <CheatSheet />
          </R>
          <R path="/gem-planner">
            <GemPlanner />
          </R>
          <R path="/help">
            <Help />
          </R>
          <R>
            <NotFound />
          </R>
        </Switch>
      </Container>
      <RefreshBar countdown={countdown} />
    </Router>
  );
}
