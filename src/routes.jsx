import React from "react";
import { BrowserRouter as Router, Switch, Route as R } from "react-router-dom";

export default function App() {
  return (
    <Router>
      <div>Hello world!!</div>
      <Switch>
        <R path="/aaa">
          <div>aaa</div>
        </R>
        <R path="/bbb">
          <div>bbb</div>
        </R>
        <R path="/">
          <div>___</div>
        </R>
      </Switch>
    </Router>
  );
}
