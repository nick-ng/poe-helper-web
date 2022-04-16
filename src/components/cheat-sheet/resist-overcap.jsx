import React from "react";

export default function ResistOvercap() {
  return (
    <div>
      <h3>Resist Overcap</h3>
      <table>
        <thead>
          <tr>
            <th>Curse Source</th>
            <th>Lowered Res.</th>
            <th>Overcap</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>White Map</td>
            <td>0</td>
            <td>75</td>
          </tr>
          <tr>
            <td>Yellow Map</td>
            <td>-29 (lvl 10)</td>
            <td>104</td>
          </tr>
          <tr>
            <td>Red Map</td>
            <td>-34 (lvl 15)</td>
            <td>109</td>
          </tr>
          <tr>
            <td>lvl 83+ Monster</td>
            <td>-40 (single element)</td>
            <td>155</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
