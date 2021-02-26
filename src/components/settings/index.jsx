import React, { useState, useEffect } from "react";
import styled from "styled-components";

import {
  FETCH_URL_KEY,
  CHARACTER_NAME_KEY,
  ACCOUNT_KEY,
  LEAGUE_KEY,
  POESESSID_KEY,
  SEARCH_REDIRECT_KEY,
  TWITCH_CHANNEL_KEY,
  DASHBOARD_LAYOUT_KEY,
  DASHBOARD_LAYOUTS,
  TOP_N_MOST_EXPENSIVE_KEY,
} from "../../constants";
import { getSettings } from "../../utils";
import StashTabManager from "../stash-details/stash-tab-manager";

const Container = styled.div``;

const Columns = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;

const Column = styled.div`
  & + & {
    margin-left: 2em;
  }

  table {
    font-size: 16pt;
    input {
      font-size: 16pt;
      margin-left: 0.5em;
    }
  }

  button {
    padding: 0.5em 1em;
    margin: 0.5em 0;
  }
`;

export default function Home() {
  const [account, setAccount] = useState("");
  const [characterName, setCharacterName] = useState("");
  const [fetchUrl, setFetchUrl] = useState("");
  const [league, setLeague] = useState("");
  const [poesessid, setPoesessid] = useState("");
  const [searchRedirect, setSearchRedirect] = useState(false);
  const [twitchChannel, setTwitchChannel] = useState("");
  const [dashboardLayout, setDashboardLayout] = useState(
    DASHBOARD_LAYOUTS.default
  );
  const [topNMostExpensive, setTopNMostExpensive] = useState(0);

  const resetSettings = () => {
    const settings = getSettings();
    setAccount(settings.account || "");
    setCharacterName(settings.characterName || "");
    setFetchUrl(settings.fetchUrl || "");
    setLeague(settings.league || "");
    setPoesessid(settings.poesessid || "");
    setSearchRedirect(settings.searchRedirect);
    setTwitchChannel(settings.twitchChannel || "");
    setDashboardLayout(settings.dashboardLayout);
    setTwitchChannel(settings.twitchChannel);
    setTopNMostExpensive(settings.topNMostExpensive);
  };

  useEffect(() => {
    resetSettings();
  }, []);

  return (
    <Container>
      <h1>Path of Exile Tools</h1>
      <Columns>
        <Column>
          <h2>Main Settings</h2>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              localStorage.setItem(ACCOUNT_KEY, account);
              localStorage.setItem(FETCH_URL_KEY, fetchUrl);
              localStorage.setItem(LEAGUE_KEY, league);
              localStorage.setItem(POESESSID_KEY, poesessid);
            }}
          >
            <table>
              <tbody>
                <tr>
                  <td>League</td>
                  <td>
                    <input
                      value={league}
                      onChange={(event) => {
                        setLeague(event.target.value);
                      }}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Account</td>
                  <td>
                    <input
                      value={account}
                      onChange={(event) => {
                        setAccount(event.target.value);
                      }}
                    />
                  </td>
                </tr>
                <tr>
                  <td>POESESSID</td>
                  <td>
                    <input
                      type="password"
                      value={poesessid}
                      onChange={(event) => {
                        setPoesessid(event.target.value);
                      }}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Fetch URL</td>
                  <td>
                    <input
                      type="password"
                      value={fetchUrl}
                      onChange={(event) => {
                        setFetchUrl(event.target.value);
                      }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <button>Save</button>
            <button type="button" onClick={resetSettings}>
              Cancel
            </button>
          </form>
          <hr />
          <h2>Dashboard</h2>
          <table>
            <tbody>
              <tr>
                <td>Layout</td>
                <td>
                  <select
                    value={dashboardLayout}
                    onChange={(event) => {
                      localStorage.setItem(
                        DASHBOARD_LAYOUT_KEY,
                        event.target.value
                      );
                      setDashboardLayout(event.target.value);
                    }}
                  >
                    {Object.values(DASHBOARD_LAYOUTS).map((value) => {
                      return (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      );
                    })}
                  </select>
                </td>
              </tr>
              <tr>
                <td>Most Expensive Items</td>
                <td>
                  <input
                    style={{ fontSize: "10pt", width: "5em" }}
                    onChange={(event) => {
                      const value = parseInt(event.target.value);
                      localStorage.setItem(TOP_N_MOST_EXPENSIVE_KEY, value);
                      setTopNMostExpensive(value);
                    }}
                    value={topNMostExpensive}
                    type="number"
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <hr />
          <h2>Item Search Settings</h2>
          <table>
            <tbody>
              <tr>
                <td>Auto-redirect</td>
                <td>
                  <input
                    type="checkbox"
                    checked={searchRedirect}
                    onChange={() => {
                      localStorage.setItem(
                        SEARCH_REDIRECT_KEY,
                        !searchRedirect
                      );
                      setSearchRedirect(!searchRedirect);
                    }}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </Column>
        <Column>
          <h2>Stash Tab Settings</h2>
          <StashTabManager refresh={() => {}} autoSave showChaos />
        </Column>
        <Column>
          <h2>Path of Exile Racing Settings</h2>
          <table>
            <tbody>
              <tr>
                <td>Character</td>
                <td>
                  <input
                    value={characterName}
                    onChange={(event) => {
                      localStorage.setItem(
                        CHARACTER_NAME_KEY,
                        event.target.value
                      );
                      setCharacterName(event.target.value);
                    }}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <hr />
          <h2>Twitch Settings</h2>
          <table>
            <tbody>
              <tr>
                <td>Channel Name</td>
                <td>
                  <input
                    value={twitchChannel}
                    onChange={(event) => {
                      localStorage.setItem(
                        TWITCH_CHANNEL_KEY,
                        event.target.value
                      );
                      setTwitchChannel(event.target.value);
                    }}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </Column>
      </Columns>
    </Container>
  );
}
