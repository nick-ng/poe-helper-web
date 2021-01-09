import React from "react";
import moment from "moment";

import { Thl, Thc, Thr, Tdl, Tdr } from "./style";

export default function PerHour({ snapshots }) {
  const rates = [];
  for (let n = 1; n < snapshots.length; n++) {
    const newer = snapshots[n - 1];
    const older = snapshots[n];
    const durationMs = newer?.timestamp - older?.timestamp;
    const durationHr = durationMs / (1000 * 60 * 60);
    const midTime = moment((newer?.timestamp + older?.timestamp) / 2);
    const chaos =
      (newer?.data?.totalChaosNetWorth - older?.data?.totalChaosNetWorth) /
      durationHr;
    const chaosB =
      (newer?.data?.totalChaosNetWorthB - older?.data?.totalChaosNetWorthB) /
      durationHr;
    const ex =
      (newer?.data?.totalExNetWorth - older?.data?.totalExNetWorth) /
      durationHr;
    const exB =
      (newer?.data?.totalExNetWorthB - older?.data?.totalExNetWorthB) /
      durationHr;

    rates.push({
      durationMs,
      midTime,
      chaos,
      chaosB,
      ex,
      exB,
    });
  }

  const someRates = rates.slice(0, 3);

  return (
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
        {someRates.map(({ midTime, chaos, chaosB, ex, exB }) => {
          return (
            <tr>
              <Tdl>{midTime.format("LT")}</Tdl>
              <Tdr>{chaosB}</Tdr>
              <Tdr>{chaos}</Tdr>
              <Tdr>{exB}</Tdr>
              <Tdr>{ex}</Tdr>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
