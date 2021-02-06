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
} from "../../constants";
import { getSettings } from "../../utils";

const Container = styled.div`
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

  const resetSettings = () => {
    const settings = getSettings();
    setAccount(settings.account || "");
    setCharacterName(settings.characterName || "");
    setFetchUrl(settings.fetchUrl || "");
    setLeague(settings.league || "");
    setPoesessid(settings.poesessid || "");
    setSearchRedirect(settings.searchRedirect);
    setTwitchChannel(settings.twitchChannel);
  };

  useEffect(() => {
    resetSettings();
  }, []);

  useEffect(() => {
    localStorage.setItem(CHARACTER_NAME_KEY, characterName);
  }, [characterName]);

  useEffect(() => {
    localStorage.setItem(SEARCH_REDIRECT_KEY, searchRedirect);
  }, [searchRedirect]);

  useEffect(() => {
    localStorage.setItem(TWITCH_CHANNEL_KEY, twitchChannel);
  }, [twitchChannel]);

  return (
    <Container>
      <h1>Path of Exile Tools</h1>
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
      <h2>poe-racing Settings</h2>
      <table>
        <tbody>
          <tr>
            <td>Character</td>
            <td>
              <input
                value={characterName}
                onChange={(event) => {
                  setCharacterName(event.target.value);
                }}
              />
            </td>
          </tr>
        </tbody>
      </table>
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
                  setSearchRedirect(!searchRedirect);
                }}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <h2>Twitch Settings</h2>
      <table>
        <tbody>
          <tr>
            <td>Channel Name</td>
            <td>
              <input
                value={twitchChannel}
                onChange={(event) => {
                  setTwitchChannel(event.target.value);
                }}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </Container>
  );
}
