import React from "react";
import { getSettings } from "../../utils";

export const getUrls = ({ league }) => {
  return [
    {
      url: `https://www.pathofexile.com/trade/search/${league}`,
      title: "Trade - Path of Exile",
    },
    {
      url: "https://www.poelab.com/",
      title: "PoELab",
    },
    {
      url: "https://poe.ninja/",
      title: "poe.ninja",
    },
    {
      url: "https://www.craftofexile.com/",
      title: "Craft of Exile",
    },
    {
      url: "https://poedb.tw/us/",
      title: "PoEDB",
    },
    {
      url: "https://poedb.tw/us/Betrayal_league#SafehouseReward",
      title: "Syndicate Rewards",
    },
    {
      url: "https://i.redd.it/dx3ivjjwp0v61.png",
      title: "Syndicate Cheatsheet",
    },
  ];
};

export default function Links() {
  return (
    <div>
      <h3>Links</h3>
      <ul>
        {getUrls(getSettings()).map(({ url, title }) => (
          <li>
            <a key={url} href={url} target="_blank">
              {title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
