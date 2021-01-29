import React, { useState, useEffect } from "react";
import { parseItem, itemStringToGroups } from "./utils";
import { getSettings } from "../../utils";

export default function ItemSearch() {
  const [itemText, setItemText] = useState("");
  const [itemArray, setItemArray] = useState({});
  const [item, setItem] = useState({});
  const [poeNinjaLink, setPoeNinjaLink] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const itemParam = urlParams.get("item").trim();
    const tempItem = parseItem(itemParam);

    setItemText(itemParam);
    setItem(tempItem);
    setItemArray(itemStringToGroups(itemParam));

    const poeNinjaClass = tempItem.poeNinjaClass || "weapons";
    const name = encodeURIComponent(tempItem.name || "");
    const url = `https://poe.ninja/challenge/unique-${poeNinjaClass}?name=${name}`;
    setPoeNinjaLink(url);

    if (tempItem.rarity === "unique" && getSettings().searchRedirect) {
      setTimeout(() => {
        window.location.replace(url);
      }, 100);
    }
  }, []);

  return (
    <div>
      <a href={poeNinjaLink} target="_blank">
        {poeNinjaLink}
      </a>
      <pre>{JSON.stringify(item, null, "  ")}</pre>
      <pre>{JSON.stringify(itemArray, null, "  ")}</pre>
      <hr />
      <pre>{itemText}</pre>
    </div>
  );
}
