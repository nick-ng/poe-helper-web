import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  img {
    height: 24px;
  }
`;

export default function GemDisplay({ gem, imageURL }) {
  console.log(JSON.stringify({ gem, imageURL }, null, "  "));
  const display = gem.replace(/_/g, " ");
  return (
    <Container>
      <img src={imageURL} />
      <a href={`https://www.poewiki.net/wiki/${gem}`} target="_blank">
        {display}
      </a>
    </Container>
  );
}
