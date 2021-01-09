import React from "react";
import styled from "styled-components";

import NavLink from "./nav-link";

const NavContainer = styled.div`
  padding: 5px;
  height: 100%;
  display: grid;
  grid-template-columns: auto;
  align-content: start;
  gap: 12px;
`;

const Nav = () => (
  <NavContainer>
    <NavLink icon="fa-table" to="/" exact>
      Dashboard
    </NavLink>
    <NavLink icon="fa-line-chart" to="/charts">
      Charts
    </NavLink>
    <NavLink icon="fa-cog" to="/settings">
      Settings
    </NavLink>
  </NavContainer>
);

export default Nav;
