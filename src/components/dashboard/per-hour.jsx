import React from "react";
import moment from "moment";

import { snapshotDiff } from "../../services/snapshots";

import { Thl, Thc, Thr, Tdl, Tdr } from "./style";

export default function PerHour({ snapshots }) {
  const rates = [];
  for (let n = 1; n < snapshots.length; n++) {
    rates.push(snapshotDiff(snapshots[n - 1], snapshots[n]));
  }

  const someRates = rates.slice(0, 3);

  return rates.length > 0 ? (
    <table>
      <thead>
        <tr>
          <Thl rowSpan={2}>Time</Thl>
          <Thc colSpan={2}>Chaos/hr</Thc>
          <Thc colSpan={2}>Ex/hr</Thc>
        </tr>
        <tr>
          <Thr>With Recipe</Thr>
          <Thr>No Recipe</Thr>
          <Thr>With Recipe</Thr>
          <Thr>No Recipe</Thr>
        </tr>
      </thead>
      <tbody>
        {someRates.map(
          ({
            startTime,
            midTime,
            endTime,
            chaosPerHr,
            chaosPerHrB,
            exPerHr,
            exPerHrB,
          }) => {
            return (
              <tr key={midTime}>
                <Tdl>
                  {moment(startTime).format("LT")} -{" "}
                  {moment(endTime).format("LT")}
                </Tdl>
                <Tdr>{chaosPerHrB.toFixed(2)}</Tdr>
                <Tdr>{chaosPerHr.toFixed(2)}</Tdr>
                <Tdr>{exPerHrB.toFixed(3)}</Tdr>
                <Tdr>{exPerHr.toFixed(3)}</Tdr>
              </tr>
            );
          }
        )}
      </tbody>
    </table>
  ) : (
    <div>Per hour loading...</div>
  );
}
