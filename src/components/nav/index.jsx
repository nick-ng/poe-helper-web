import React from "react";
import styled from "styled-components";

import NavLink, { StyledIcon } from "./nav-link";

const NavContainer = styled.div`
  padding: 5px;
  height: 100%;
  display: grid;
  grid-template-columns: auto;
  align-content: start;
  gap: 12px;
`;

const GithubLink = styled.a`
  position: fixed;
  bottom: 14px;
  left: 14px;
  text-decoration: none;
  color: #cccccc;
`;

const Nav = () => (
  <NavContainer>
    <NavLink icon="fa-table" to="/" exact>
      Dashboard
    </NavLink>
    <NavLink icon="fa-list-ul" to="/stash-details">
      Stash Details
    </NavLink>
    <NavLink icon="fa-cog" to="/settings">
      Settings
    </NavLink>
    <GithubLink
      target="_blank"
      href="https://github.com/nick-ng/poe-helper-web"
    >
      <StyledIcon icon="fa-github" />
    </GithubLink>
  </NavContainer>
);

export default Nav;
