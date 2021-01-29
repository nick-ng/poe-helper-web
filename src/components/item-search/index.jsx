import React, { useState, useEffect } from "react";
import { getMaxLink, parseItem, itemStringToGroups } from "./utils";
import { itemMap } from "../../constants/poe-item-slot";

export default function ItemSearch() {
  const [itemText, setItemText] = useState("");
  const [itemArray, setItemArray] = useState({});
  const [item, setItem] = useState({});

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const itemParam = urlParams.get("item").trim();

    setItemText(itemParam);
    setItem(parseItem(itemParam));
    setItemArray(itemStringToGroups(itemParam));
  }, []);

  return (
    <div>
      <pre>{JSON.stringify(item, null, "  ")}</pre>
      <pre>{JSON.stringify(itemArray, null, "  ")}</pre>
      <hr />
      <pre>{itemText}</pre>
      <pre>{JSON.stringify(itemMap, null, "  ")}</pre>
    </div>
  );
}
