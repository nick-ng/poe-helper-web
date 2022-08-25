import React from "react";

export default function CraftingIlvl() {
  return (
    <div>
      <h3>Crafting ilvl Breakpoints</h3>
      <table>
        <thead>
          <tr>
            <th>Slot</th>
            <th>ilvl</th>
            <th>Tier</th>
            <th>Regex</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Ring</td>
            <td>44</td>
            <td>T1 Life</td>
            <td></td>
          </tr>
          <tr>
            <td>Amulet</td>
            <td>54</td>
            <td>T1 Life</td>
          </tr>
          <tr>
            <td>Belt</td>
            <td>64</td>
            <td>T1 Life</td>
          </tr>
          <tr>
            <td>Amulet, Belt, Ring</td>
            <td>72</td>
            <td>T2 Ele. Res.</td>
          </tr>
          <tr>
            <td>Amulet, Belt, Ring</td>
            <td>81</td>
            <td>T1 Chaos Res.</td>
          </tr>
          <tr>
            <td>Amulet, Belt, Ring</td>
            <td>84</td>
            <td>T1 Ele. Res.</td>
          </tr>
          <tr>
            <td>Jewels</td>
            <td>33-59</td>
            <td>Corrupted Blood Corruption</td>
            <td>"level: (3[3-9]|[4-5][0-9])"</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
