import React from "react";

import { Thl, Thr, Tdl, Tdr } from "./style";

export default function NetWorth({
  chaosPerEx,
  specialTab,
  totalChaosNetWorthB,
  totalExNetWorthB,
  recipeInChaos,
  recipeInEx,
}) {
  if (
    ![
      chaosPerEx,
      specialTab,
      totalChaosNetWorthB,
      totalExNetWorthB,
      recipeInChaos,
      recipeInEx,
    ].every((a) => a)
  ) {
    return <div />;
  }
  return (
    <table>
      <thead>
        <tr>
          <Thl>Stash Tab</Thl>
          <Thr>Chaos</Thr>
          <Thr>Ex</Thr>
          <Thl>Notes</Thl>
        </tr>
      </thead>
      <tbody>
        <tr>
          <Tdl>Total</Tdl>
          <Tdr>{totalChaosNetWorthB.toFixed(2)}</Tdr>
          <Tdr>{totalExNetWorthB.toFixed(3)}</Tdr>
          <Tdl></Tdl>
        </tr>
        <tr>
          <Tdl>Chaos Recipe</Tdl>
          <Tdr>{recipeInChaos.toFixed(2)}</Tdr>
          <Tdr>{recipeInEx.toFixed(3)}</Tdr>
          <Tdl></Tdl>
        </tr>
        {specialTab?.tabs?.map(
          ({ tabName, chaosValue, exValue, mostExpensiveStack }) => (
            <tr key={tabName}>
              <Tdl>{tabName}</Tdl>
              <Tdr>{chaosValue.toFixed(2)}</Tdr>
              <Tdr>{exValue.toFixed(3)}</Tdr>
              <Tdl>
                {mostExpensiveStack.stackSize} {mostExpensiveStack.typeLine} ={" "}
                {mostExpensiveStack.value.toFixed(2)} c (
                {(mostExpensiveStack.value / chaosPerEx).toFixed(3)} ex)
              </Tdl>
            </tr>
          )
        )}
      </tbody>
    </table>
  );
}
