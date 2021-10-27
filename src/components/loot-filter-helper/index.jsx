import React, { useEffect, useState } from "react";
import styled from "styled-components";
import localforage from "localforage";

import { getSettings } from "../../utils";
import { updatePoeNinjaData } from "../../services/poe-ninja";
import {
  POE_NINJA_DATA_KEY,
  LOOT_FILTER_HELPER_BASE_TYPES,
} from "../../constants";

const Container = styled.div``;

const BaseTypeOutput = styled.div`
  display: flex;
  flex-direction: column;
`;

const Table = styled.table`
  border-collapse: collapse;

  td,
  th {
    border: 1px solid grey;
    padding: 5px;
  }
`;

const ItemsCell = styled.td`
  max-width: 20vw;
`;

export default function LootFilterHelper() {
  const [uniqueItems, setUniqueItems] = useState([]);
  const [lootFilterBaseTypes, setLootFilterBaseTypes] = useState({});
  const [debug, setDebug] = useState("");

  const updateStuff = async (force = false) => {
    await updatePoeNinjaData(getSettings(), force);
    const allKeys = await localforage.keys();
    const uniquesKeys = allKeys
      .filter((key) => key.includes("UNIQUE"))
      .filter((key) => !(key.endsWith("6l") || key.endsWith("5l")));

    const temp = await Promise.all(
      uniquesKeys.map(async (key) => {
        const baseTypeKey = key.replace("UNIQUE", "BASE_TYPE");
        const baseType = await localforage.getItem(baseTypeKey);
        return {
          item: key.replace(`${POE_NINJA_DATA_KEY}-UNIQUE-`, ""),
          value: await localforage.getItem(key),
          baseType,
        };
      })
    );

    setUniqueItems(temp);
    setDebug(JSON.stringify(temp, null, "  "));
  };

  useEffect(() => {
    const savedLootFilterBaseTypes = localStorage.getItem(
      LOOT_FILTER_HELPER_BASE_TYPES
    );
    try {
      setLootFilterBaseTypes(JSON.parse(savedLootFilterBaseTypes));
    } catch (e) {}

    updateStuff();
  }, []);

  useEffect(() => {
    localStorage.setItem(
      LOOT_FILTER_HELPER_BASE_TYPES,
      JSON.stringify(lootFilterBaseTypes)
    );
  }, [lootFilterBaseTypes]);

  const sortedUniques = uniqueItems.reduce((prev, curr) => {
    const { baseType } = curr;
    if (!prev[baseType]) {
      prev[baseType] = {
        baseType,
        uniques: [curr],
      };
      return prev;
    }

    prev[baseType].uniques = prev[baseType].uniques.concat([curr]);
    return prev;
  }, {});

  const sortedBaseTypes = Object.entries(lootFilterBaseTypes).reduce(
    (prev, curr) => {
      const [key, value] = curr;
      if (!prev[value]) {
        prev[value] = [];
      }

      prev[value] = prev[value].concat([key]);
      return prev;
    },
    {}
  );

  const topBases =
    sortedBaseTypes.top && `"${sortedBaseTypes.top.join('" "')}"`;
  const unsureBases =
    sortedBaseTypes.unsure && `"${sortedBaseTypes.unsure.join('" "')}"`;
  const hideBases =
    sortedBaseTypes.hide && `"${sortedBaseTypes.hide.join('" "')}"`;

  return (
    <Container>
      <h2>Loot Filter Helper</h2>
      <BaseTypeOutput>
        <label>
          Top <input style={{ width: "20vw" }} value={topBases || ""} />
        </label>
        <label>
          Unsure <input style={{ width: "20vw" }} value={unsureBases || ""} />
        </label>
        <label>
          Hide <input style={{ width: "20vw" }} value={hideBases || ""} />
        </label>
      </BaseTypeOutput>
      <hr />
      <button onClick={() => updateStuff(true)}>Update</button>
      <button
        onClick={() => {
          const threshold = 5;
          Object.values(sortedUniques).forEach(({ baseType, uniques }) => {
            const baseTypeValues = uniques.map((a) => parseFloat(a.value));
            const minValue = Math.min(...baseTypeValues);
            const maxValue = Math.max(...baseTypeValues);

            if (maxValue > threshold) {
              return;
            }

            const lootFilterSetting = lootFilterBaseTypes[baseType];

            if (!lootFilterSetting) {
              setLootFilterBaseTypes((prevBaseTypes) => {
                return { ...prevBaseTypes, [baseType]: "normal" };
              });
            }
          });
        }}
      >
        Auto Threshold 5
      </button>
      <button
        onClick={() => {
          const threshold = 1;
          Object.values(sortedUniques).forEach(({ baseType, uniques }) => {
            if (baseType.toLowerCase().endsWith(" ring")) {
              setLootFilterBaseTypes((prevBaseTypes) => {
                return { ...prevBaseTypes, [baseType]: "normal" };
              });
              return;
            }
            const baseTypeValues = uniques.map((a) => parseFloat(a.value));
            const minValue = Math.min(...baseTypeValues);
            const maxValue = Math.max(...baseTypeValues);

            if (maxValue > threshold) {
              return;
            }

            setLootFilterBaseTypes((prevBaseTypes) => {
              return { ...prevBaseTypes, [baseType]: "hide" };
            });
          });
        }}
      >
        Auto Hide 1
      </button>

      <Table>
        <thead>
          <tr>
            <th>Base Type</th>
            <th>Items</th>
            <th>Min/Max Value</th>
            <th>Top Unsure Normal Hide</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(sortedUniques).map(({ baseType, uniques }) => {
            const baseTypeValues = uniques.map((a) => parseFloat(a.value));
            const minValue = Math.min(...baseTypeValues);
            const maxValue = Math.max(...baseTypeValues);
            const lootFilterSetting = lootFilterBaseTypes[baseType];

            return (
              <tr
                style={{
                  backgroundColor: lootFilterSetting ? "black" : "navy",
                }}
                key={baseType}
              >
                <td>{baseType}</td>
                <ItemsCell>
                  {uniques
                    .sort((a, b) => b.value - a.value)
                    .map((a, i) => (
                      <>
                        {i > 0 && ", "}
                        <a
                          key={`${a.item}-link`}
                          target="_blank"
                          href={`https://www.poewiki.net/wiki/${a.item}`}
                        >
                          {a.item.replaceAll("_", " ")} ({a.value})
                        </a>
                      </>
                    ))}
                </ItemsCell>
                <td>
                  {minValue}, {maxValue}
                </td>
                <td>
                  <input
                    type="radio"
                    name={`${baseType}-radio`}
                    checked={lootFilterSetting === "top"}
                    onChange={() => {
                      setLootFilterBaseTypes((prevBaseTypes) => {
                        return { ...prevBaseTypes, [baseType]: "top" };
                      });
                    }}
                  />
                  <input
                    type="radio"
                    name={`${baseType}-radio`}
                    checked={lootFilterSetting === "unsure"}
                    onChange={() => {
                      setLootFilterBaseTypes((prevBaseTypes) => {
                        return { ...prevBaseTypes, [baseType]: "unsure" };
                      });
                    }}
                  />
                  <input
                    type="radio"
                    name={`${baseType}-radio`}
                    checked={lootFilterSetting === "normal"}
                    onChange={() => {
                      setLootFilterBaseTypes((prevBaseTypes) => {
                        return { ...prevBaseTypes, [baseType]: "normal" };
                      });
                    }}
                  />
                  <input
                    type="radio"
                    name={`${baseType}-radio`}
                    checked={lootFilterSetting === "hide"}
                    onChange={() => {
                      setLootFilterBaseTypes((prevBaseTypes) => {
                        return { ...prevBaseTypes, [baseType]: "hide" };
                      });
                    }}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
}
