import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { parseItem, itemStringToGroups } from "./utils";
import { getSettings } from "../../utils";

const Container = styled.div`
  overflow-wrap: break-word;
  pre {
    overflow: hidden;
    width: 90vw;
  }
`;

export default function ItemSearch() {
  const [itemText, setItemText] = useState(null);
  const [itemArray, setItemArray] = useState({});
  const [item, setItem] = useState({});
  const [poeNinjaLink, setPoeNinjaLink] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const itemParam = urlParams.get("item")?.trim();
    if (itemParam) {
      setItemText(itemParam);
    }
  }, []);

  useEffect(() => {
    if (!itemText) {
      return;
    }
    const tempItem = parseItem(itemText);
    setItem(tempItem);
    setItemArray(itemStringToGroups(itemText));
    setPoeNinjaLink(tempItem.poeNinjaUrl || tempItem.poeappUrl);

    if (
      (tempItem.poeNinjaUrl || tempItem.poeappUrl) &&
      getSettings().searchRedirect
    ) {
      setTimeout(() => {
        window.location.replace(tempItem.poeNinjaUrl || tempItem.poeappUrl);
      }, 100);
    }
  }, [itemText]);

  return (
    <Container>
      <textarea
        onChange={(event) => {
          if (event.target.value) {
            setItemText(event.target.value);
          }
        }}
        value={itemText || ""}
        rows={1}
        cols={50}
      />
      <hr />
      <a href={poeNinjaLink} target="_blank">
        {poeNinjaLink}
      </a>
      <pre>{JSON.stringify(item, null, "  ")}</pre>
      <pre>{JSON.stringify(itemArray, null, "  ")}</pre>
      <hr />
      <pre>{itemText}</pre>
    </Container>
  );
}
