import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { getSettings } from "../../utils";
import {
  getPoeNinjaDatum,
  getPoeNinjaDatumUnique,
  updatePoeNinjaData,
} from "../../services/poe-ninja";

const Container = styled.div``;

const StashTable = styled.table`
  border-collapse: collapse;

  td,
  th {
    padding: 0 0.5em;
  }
`;

const StashRow = styled.tr`
  &:nth-child(odd) {
    background-color: #222222;
  }

  color: ${(props) => (props.ignored ? "#777777" : "white")};
`;

const ItemIcon = styled.img`
  margin-top: 0.2em;
  height: 1.6em;
`;

const groupItems = (items) => {
  const groupedItems = [];
  const stackableItems = {};

  items.forEach((item) => {
    if (!item.stackSize) {
      groupedItems.push(item);
      return;
    }

    if (stackableItems[item.typeLine]) {
      stackableItems[item.typeLine].stackSize += item.stackSize;
    } else {
      stackableItems[item.typeLine] = item;
    }
  });

  return groupedItems.concat(Object.values(stackableItems));
};

export const priceItems = async (items, ignoredItems = []) => {
  await updatePoeNinjaData(getSettings());
  const chaosPerEx = (await getPoeNinjaDatum("Exalted Orb")).each;
  const groupedItems = groupItems(items);
  let stashTotal = 0;
  let stashTotalEx = 0;
  const pricedItems = await Promise.all(
    groupedItems.map(async (item) => {
      if (ignoredItems.includes(item.typeLine)) {
        return {
          ...item,
          each: 0,
          eachEx: 0,
          total: 0,
          totalEx: 0,
          sortOrder: -1,
        };
      }
      const { each } = item.name
        ? await getPoeNinjaDatumUnique(item.name)
        : await getPoeNinjaDatum(item.typeLine);
      const eachEx = each / chaosPerEx;
      const total = each * (item.stackSize || 1);
      stashTotal += total;
      const totalEx = eachEx * (item.stackSize || 1);
      stashTotalEx += totalEx;
      return {
        ...item,
        each,
        eachEx,
        total,
        totalEx,
        sortOrder: total,
      };
    })
  );

  return {
    items: pricedItems.sort((a, b) => b.sortOrder - a.sortOrder),
    totals: {
      c: stashTotal,
      ex: stashTotalEx,
    },
  };
};

export default function StashTab({
  debugMode,
  tab,
  ignoredItems,
  setIgnoredItems,
}) {
  const [items, setItems] = useState([]);
  const [stashTotals, setStashTotals] = useState({ c: 0, ex: 0 });

  useEffect(() => {
    if (!tab) {
      return <div>Nothing here</div>;
    }

    const run = async () => {
      const { items, totals } = await priceItems(tab.items, ignoredItems);

      setItems(items);
      setStashTotals(totals);
    };

    run();
    return;
  }, [tab, ignoredItems]);

  return (
    <Container>
      <p>
        Tab Total: {stashTotals.c.toFixed(0)}c ({stashTotals.ex.toFixed(1)}ex)
      </p>
      <StashTable>
        <thead>
          <tr>
            <th></th>
            <th style={{ textAlign: "right" }}>#</th>
            <th style={{ textAlign: "left" }}>Item</th>
            <th style={{ textAlign: "right" }}>Each</th>
            <th style={{ textAlign: "right" }}>Total</th>
            <th>Ignore</th>
            {debugMode && <th style={{ textAlign: "left" }}>Debug</th>}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const {
              id,
              icon,
              name,
              typeLine,
              stackSize = 1,
              each,
              eachEx,
            } = item;
            const total = each * stackSize;
            const totalEx = eachEx * stackSize;
            return (
              <StashRow key={id} ignored={ignoredItems.includes(typeLine)}>
                <td style={{ textAlign: "center" }}>
                  <ItemIcon src={icon} />
                </td>
                <td style={{ textAlign: "right" }}>{stackSize || 1}</td>
                <td>{name || typeLine}</td>
                <td style={{ textAlign: "right" }}>{each.toFixed(1)}c</td>
                <td style={{ textAlign: "right" }}>
                  {total.toFixed(0)}c ({totalEx.toFixed(1)}ex)
                </td>
                <td style={{ textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={ignoredItems.includes(typeLine)}
                    onChange={() => {
                      if (ignoredItems.includes(typeLine)) {
                        setIgnoredItems(
                          ignoredItems.filter((a) => a !== typeLine)
                        );
                      } else {
                        setIgnoredItems([...ignoredItems, typeLine]);
                      }
                    }}
                  />
                </td>
                {debugMode && (
                  <td>
                    <pre>{JSON.stringify(item, null, "  ")}</pre>
                  </td>
                )}
              </StashRow>
            );
          })}
        </tbody>
      </StashTable>
    </Container>
  );
}
