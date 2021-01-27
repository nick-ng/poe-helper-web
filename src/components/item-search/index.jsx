import React, { useState, useEffect } from "react";
import { getMaxLink } from "./utils";

export default function ItemSearch() {
  const [itemText, setItemText] = useState("");
  const [itemArray, setItemArray] = useState([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const itemParam = urlParams.get("item").trim();

    setItemText(itemParam);
    setItemArray(itemParam.split("\n").map((a) => a.trim()));
  }, []);

  return (
    <div>
      <pre>{itemText}</pre>
      <div>
        Max Links: <span>{getMaxLink(itemText)}</span>
      </div>
    </div>
  );
}
