import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { BrowserRouter as Router, Switch, Route as R } from "react-router-dom";

import Nav from "./components/nav";

import Dashboard from "./components/dashboard";
import NotFound from "./components/not-found";
import Settings from "./components/settings";

const GlobalStyle = createGlobalStyle`
body {
  color: white;
  background-color: black;
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

export default function App() {
  return (
    <Router>
      <GlobalStyle />
      <Container>
        <Nav />
        <Switch>
          <R path="/settings">
            <Settings />
          </R>
          <R path="/" exact>
            <Dashboard />
          </R>
          <R>
            <NotFound />
          </R>
        </Switch>
      </Container>
    </Router>
  );
}
