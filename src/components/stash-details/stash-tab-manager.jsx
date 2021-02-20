import React, { useState } from "react";
import styled from "styled-components";

import {
  STARTS_WITH_TABS_KEY,
  INCLUDES_TABS_KEY,
  ENDS_WITH_TABS_KEY,
} from "../../constants";
import { getSettings } from "../../utils";

const Container = styled.div`
  p {
    margin-bottom: 0;
  }

  textarea {
    display: block;
  }
`;

export default function StashTabManager({ refresh, autoSave }) {
  const [startsWithTabs, setStartsWithTabs] = useState(
    getSettings().startsWithTabs
  );
  const [includesTabs, setIncludesTabs] = useState(getSettings().includesTabs);
  const [endsWithTabs, setEndsWithTabs] = useState(getSettings().endsWithTabs);

  const save = () => {
    localStorage.setItem(STARTS_WITH_TABS_KEY, JSON.stringify(startsWithTabs));
    localStorage.setItem(INCLUDES_TABS_KEY, JSON.stringify(includesTabs));
    localStorage.setItem(ENDS_WITH_TABS_KEY, JSON.stringify(endsWithTabs));
  };

  return (
    <Container>
      <p>Also show normal tabs that start with:</p>
      <textarea
        value={startsWithTabs.join("\n")}
        onChange={(event) => {
          setStartsWithTabs(event.target.value.split("\n"));
          if (autoSave) {
            save();
          }
        }}
      />
      <p>Also show normal tabs that include:</p>
      <textarea
        value={includesTabs.join("\n")}
        onChange={(event) => {
          setIncludesTabs(event.target.value.split("\n"));
          if (autoSave) {
            save();
          }
        }}
      />
      <p>Also show normal tabs that end with:</p>
      <textarea
        value={endsWithTabs.join("\n")}
        onChange={(event) => {
          setEndsWithTabs(event.target.value.split("\n"));
          if (autoSave) {
            save();
          }
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
