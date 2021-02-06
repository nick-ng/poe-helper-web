import React, { useState, useEffect } from "react";
import moment from "moment";
import styled from "styled-components";

import {
  getSnapshots,
  saveSnapshot,
  deleteManualSnapshot,
  snapshotDiff,
} from "../../services/snapshots";

import Icon from "../icon";
import { Thl, Thc, Thr, Tdl, Tdr, Tdc } from "./style";

const Controls = styled.form`
  display: flex;
  flex-direction: row;
  margin: 5px 0;

  input {
    flex-grow: 1;
    align-self: center;
    padding: 6px;
  }

  button {
    padding: 5px 10px;
    margin: 0;
  }
`;

export default function ManualSnapshot({ summary, showChaosRecipe }) {
  const [manualSnapshots, setManualSnapshots] = useState([]);
  const [newSnapshotNote, setNewSnapshotNote] = useState("");

  useEffect(() => {
    (async () => {
      setManualSnapshots(await getSnapshots(true));
    })();
  }, []);

  return (
    <div>
      <Controls
        onSubmit={async (e) => {
          e.preventDefault();

          await saveSnapshot(
            {
              ...summary,
              snapshotNote: newSnapshotNote,
            },
            true
          );
          setNewSnapshotNote("");
          setManualSnapshots(await getSnapshots(true));
        }}
      >
        <input
          placeholder="Snapshot note"
          onChange={(e) => {
            setNewSnapshotNote(e.target.value);
          }}
          value={newSnapshotNote}
        />
        <button>Save</button>
      </Controls>
      <table>
        <thead>
          {showChaosRecipe ? (
            <tr>
              <Thl rowSpan={2}>Ago (Hours)</Thl>
              <Thl rowSpan={2}>Notes</Thl>
              <Thc colSpan={2}>Chaos Difference</Thc>
              <Thc colSpan={2}>Ex Difference</Thc>
            </tr>
          ) : (
            <tr>
              <Thl>Ago (Hours)</Thl>
              <Thl>Notes</Thl>
              <Thr>Chaos Diff.</Thr>
              <Thr>Ex Diff.</Thr>
            </tr>
          )}
          {showChaosRecipe && (
            <tr>
              <Thr>With Recipe</Thr>
              <Thr>No Recipe</Thr>
              <Thr>With Recipe</Thr>
              <Thr>No Recipe</Thr>
            </tr>
          )}
        </thead>
        <tbody>
          {manualSnapshots.map((snapshot) => {
            const { chaos, chaosB, ex, exB } = snapshotDiff(
              {
                timestamp: summary?.timestamp,
                data: summary,
              },
              snapshot
            );

            const hoursAgo = moment().diff(
              moment(snapshot?.timestamp),
              "hours",
              true
            );

            return (
              snapshot?.timestamp && (
                <tr key={snapshot?.timestamp}>
                  <Tdl>
                    {moment(snapshot?.timestamp).fromNow()} (
                    {hoursAgo.toFixed(2)})
                  </Tdl>
                  <Tdl>{snapshot?.data?.snapshotNote}</Tdl>
                  {showChaosRecipe && (
                    <Tdr>
                      {chaosB.toFixed(2)} ({(chaosB / hoursAgo).toFixed(2)}/hr)
                    </Tdr>
                  )}
                  <Tdr>
                    {chaos.toFixed(2)} ({(chaos / hoursAgo).toFixed(2)}/hr)
                  </Tdr>
                  {showChaosRecipe && (
                    <Tdr>
                      {exB.toFixed(2)} ({(exB / hoursAgo).toFixed(2)}/hr)
                    </Tdr>
                  )}
                  <Tdr>
                    {ex.toFixed(2)} ({(ex / hoursAgo).toFixed(2)}/hr)
                  </Tdr>
                  <Tdc style={{ padding: "0" }}>
                    <button
                      style={{
                        padding: "5px 8px",
                        margin: "0",
                      }}
                      onClick={async () => {
                        await deleteManualSnapshot(snapshot?.timestamp);
                        setManualSnapshots(await getSnapshots(true));
                      }}
                    >
                      <Icon icon="fa-trash" />
                    </button>
                  </Tdc>
                </tr>
              )
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
