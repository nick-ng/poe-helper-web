import React, { useState, useEffect } from "react";
import styled from "styled-components";

import { SPEED_NAMES_STORE } from "../../constants";

const BAD_WORDS = JSON.parse(
  window.atob(
    "WyJhbmFsIiwiYW51cyIsImFyc2UiLCJhc3MiLCJhenoiLCJiYWJlIiwiYmFuZyIsImJhcmYiLCJiYnciLCJiZHNtIiwiYmVlciIsImJpbnQiLCJibG93IiwiYm9kIiwiYm9tZCIsImJvbmUiLCJib25nIiwiYm9vYiIsImJyYSIsImJ1bSIsImJ1bmciLCJidXR0IiwiY2FjYSIsImNhd2siLCJjaGluIiwiY2lwYSIsImNsaXQiLCJjbnV0IiwiY29jayIsImNvayIsImNvb24iLCJjb3giLCJjcmFwIiwiY3VtIiwiY3VtcyIsImN1bm4iLCJjdW50IiwiZGFnbyIsImRhbW4iLCJkYXJuIiwiZGljayIsImRpa2UiLCJkaW5rIiwiZGxjayIsImRvbmciLCJkdmRhIiwiZHlrZSIsImZhY2siLCJmYWciLCJmYWdnIiwiZmFncyIsImZhaWciLCJmYXJ0IiwiZmF0IiwiZmN1ayIsImZlY2siLCJmb2FkIiwiZm9haCIsImZvb2siLCJmdWMiLCJmdWNrIiwiZnVrIiwiZnVrcyIsImZ1cSIsImZ1eCIsImZ2Y2siLCJmeGNrIiwiZ2FlIiwiZ2FpIiwiZ2FzaCIsImdheXMiLCJnZXkiLCJnZnkiLCJnaGF5IiwiZ2hleSIsImdpdCIsImdvb2siLCJndGZvIiwiZ3VybyIsImhlYmUiLCJoZWViIiwiaGVsbCIsImhlbXAiLCJoZXJwIiwiaGl2IiwiaG8iLCJob2FyIiwiaG9lIiwiaG9lciIsImhvbW8iLCJob29yIiwiaG9yZSIsImh1bXAiLCJodW4iLCJpYXAiLCJqYXAiLCJqYXBzIiwiamVyayIsImppc20iLCJqaXoiLCJqaXptIiwiaml6eiIsImpvY2siLCJrYXdrIiwia2lrZSIsImtpbGwiLCJra2siLCJrbGFuIiwia25vYiIsImtvY2siLCJrdW0iLCJrdW1zIiwia3VudCIsImt3aWYiLCJreWtlIiwibGVjaCIsImxleiIsImxtYW8iLCJsb2luIiwibHViZSIsImx1c3QiLCJtYW1zIiwibWF4aSIsIm1ldGgiLCJtaWNrIiwibWlsZiIsIm1vZm8iLCJtb25nIiwibXVmZiIsIm5hZCIsIm5hZHMiLCJuYXppIiwibm9iIiwibnVkZSIsIm9tZyIsIm9yYWwiLCJvcmd5Iiwib3Z1bSIsInBha2kiLCJwYXduIiwicGNwIiwicGVkbyIsInBlZSIsInBodWsiLCJwaHVxIiwicGltcCIsInBpc3MiLCJwbXMiLCJwb29mIiwicG9vbiIsInBvb3AiLCJwb3JuIiwicG90IiwicHJpZyIsInByb2QiLCJwcm9uIiwicHRoYyIsInB1YmUiLCJwdXNzIiwicHVzdCIsInB1dG8iLCJxdWltIiwicmFjeSIsInJhcGUiLCJydW0iLCJydW1wIiwic2NhZyIsInNjYXQiLCJzY3VtIiwic2VrcyIsInNleCIsInNleG8iLCJzZXh5Iiwic2hhZyIsInNoaXQiLCJzaGl6Iiwic2thZyIsInNsYWciLCJzbHV0Iiwic21lZyIsInNtdXQiLCJzcGFjIiwic3BpYyIsInNwaWsiLCJzdGZ1Iiwic3VjayIsInRhZmYiLCJ0YWlnIiwidGFyZCIsInRhcnQiLCJ0ZWF0IiwidGVleiIsInRlcmQiLCJ0aHVnIiwidGl0IiwidGl0aSIsInRpdHMiLCJ0aXR0IiwidG9rZSIsInR1cmQiLCJ0dXNoIiwidHdhdCIsInVnbHkiLCJ1emkiLCJ2YWciLCJ3YWQiLCJ3YW5nIiwid2FuayIsIndlZWQiLCJ3aGl6Iiwid29nIiwid29tYiIsIndvcCIsInd0ZiIsInh4eCIsInlhb2kiLCJ5aWQiLCJ6dWJiIiwiY3VuIl0="
  )
);

function randomLetter() {
  const n = Math.floor(Math.random() * 26) + 11;

  if (n === 36) {
    return "z";
  }

  return n.toString(36);
}

function getRandomPart(maxN = 4) {
  let randomPart = "";

  do {
    const letters = [];
    for (let n = 0; n < maxN; n++) {
      letters.push(randomLetter());
    }

    randomPart = letters.join("").toLowerCase();
  } while (BAD_WORDS.filter((a) => randomPart.includes(a)).length > 0);

  return randomPart;
}

const Container = styled.div`
  label {
    textarea {
      display: block;
    }
  }
`;

const MiniHeading = styled.div`
  margin-top: 0.5em;
  margin-bottom: 0.2em;
`;

const ButtonDisplay = styled.div`
  button {
    display: block;
  }

  button + button {
    margin-top: 0.3em;
  }
`;

export default function NameGenerator() {
  const [namesString, setNamesString] = useState("");
  const [randomPart, setRandomPart] = useState("");

  const names = namesString.split("\n").filter((a) => a);

  useEffect(() => {
    const speedNamesString = localStorage.getItem(SPEED_NAMES_STORE) || "";
    setNamesString(speedNamesString);
    setRandomPart(getRandomPart());
  }, []);

  return (
    <Container>
      <h3>Name Generator</h3>
      <MiniHeading>Base Part</MiniHeading>
      <textarea
        onChange={(e) => {
          const s = e.target.value;
          setNamesString(s);
          localStorage.setItem(SPEED_NAMES_STORE, s);
        }}
        value={namesString}
      />
      <MiniHeading>Random Part</MiniHeading>
      <div>{randomPart}</div>
      <button
        onClick={() => {
          setRandomPart(getRandomPart());
        }}
      >
        Reroll
      </button>
      <MiniHeading>Copy to Clipboard</MiniHeading>
      <ButtonDisplay>
        {names.map((name) => {
          const fullName = `${name}_${randomPart}`;
          return (
            <button
              key={fullName}
              onClick={() => {
                navigator.clipboard.writeText(fullName);
              }}
            >
              {fullName}
            </button>
          );
        })}
      </ButtonDisplay>
    </Container>
  );
}
