import React, { useState, useEffect } from "react";

import { STASH_REFRESH_TIMEOUT } from "../../constants";
import { wait } from "../../utils";

let counter = 0;

export default function Dashboard() {
  useEffect(() => {
    let running = true;
    async function refresher() {
      if (!running) {
        console.log("stopped running refresher");
        return;
      }
      console.log("counter", counter++);
      await wait(100);
      setTimeout(refresher, STASH_REFRESH_TIMEOUT);
    }
    refresher();

    return () => {
      running = false;
    };
  }, []);

  return <div>Dashboard goes here</div>;
}
