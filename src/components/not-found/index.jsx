import React from "react";
import styled from "styled-components";

import { Link } from "react-router-dom";

const Container = styled.div``;

export default function NotFound() {
  return (
    <Container>
      <p>
        There's nothing here. <Link to="/">Back to the Dashboard</Link>
      </p>
    </Container>
  );
}
