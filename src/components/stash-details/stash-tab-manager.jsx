import React, { useState, useEffect } from "react";
import styled from "styled-components";

import {
  STARTS_WITH_TABS_KEY,
  INCLUDES_TABS_KEY,
  ENDS_WITH_TABS_KEY,
  CHAOS_RECIPE_TABS_KEY,
} from "../../constants";
import { getSettings } from "../../utils";

const Container = styled.div`
  max-width: 20vw;

  p {
    margin-bottom: 0;
  }

  textarea {
    display: block;
  }
`;

export default function StashTabManager({ refresh, autoSave, showChaos }) {
  const [startsWithTabs, setStartsWithTabs] = useState(
    getSettings().startsWithTabs
  );
  const [includesTabs, setIncludesTabs] = useState(getSettings().includesTabs);
  const [endsWithTabs, setEndsWithTabs] = useState(getSettings().endsWithTabs);
  const [chaosRecipeTabs, setChaosRecipeTabs] = useState(
    getSettings().chaosRecipeTabs
  );

  const save = () => {
    localStorage.setItem(STARTS_WITH_TABS_KEY, JSON.stringify(startsWithTabs));
    localStorage.setItem(INCLUDES_TABS_KEY, JSON.stringify(includesTabs));
    localStorage.setItem(ENDS_WITH_TABS_KEY, JSON.stringify(endsWithTabs));
    localStorage.setItem(
      CHAOS_RECIPE_TABS_KEY,
      JSON.stringify(chaosRecipeTabs)
    );
  };

  useEffect(() => {
    if (!autoSave) {
      return;
    }

    save();
  }, [startsWithTabs, includesTabs, endsWithTabs, chaosRecipeTabs]);

  return (
    <Container>
      {showChaos && (
        <>
          <p>
            Look for Chaos Recipe in these tabs (exact match, if blank, looks in
            tabs that start with "chaos_"):
          </p>
          <textarea
            value={chaosRecipeTabs.join("\n")}
            onChange={(event) => {
              setChaosRecipeTabs(event.target.value.split("\n"));
            }}
          />
        </>
      )}
      <p>Also show normal tabs that start with:</p>
      <textarea
        value={startsWithTabs.join("\n")}
        onChange={(event) => {
          setStartsWithTabs(event.target.value.split("\n"));
        }}
      />
      <p>Also show normal tabs that include:</p>
      <textarea
        value={includesTabs.join("\n")}
        onChange={(event) => {
          setIncludesTabs(event.target.value.split("\n"));
        }}
      />
      <p>Also show normal tabs that end with:</p>
      <textarea
        value={endsWithTabs.join("\n")}
        onChange={(event) => {
          setEndsWithTabs(event.target.value.split("\n"));
        }}
      />
      {!autoSave && (
        <button
          onClick={() => {
            save();
            refresh();
          }}
        >
          Save
        </button>
      )}
    </Container>
  );
}
