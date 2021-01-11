import React from "react";
import styled from "styled-components";
import { NavLink as NavLinkRRD } from "react-router-dom";

import Icon from "../icon";

const StyledNavLink = styled(NavLinkRRD)`
  position: relative;
  text-decoration: none;
  color: #cccccc;
  display: flex;
  align-items: center;
  justify-content: center;

  &.active {
    color: white;
  }
`;

export const StyledIcon = styled(Icon)`
  font-size: 28px;
`;

const ToolTip = styled.div`
  pointer-events: none;
  position: absolute;
  left: 40px;
  top: 0;
  bottom: 0;
  margin: auto;
  height: 20px;
  background-color: none;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  opacity: 0;
  transition: opacity 0.2s linear 0s;

  ${StyledNavLink}:hover & {
    opacity: 1;
    transition: opacity 0.2s ease-in 0.3s;
  }

  span {
    pointer-events: none;
    padding: 10px;
    border: 1px solid grey;
    background-color: black;
    white-space: nowrap;
  }
`;

export default function NavLink({
  icon = "fa-question",
  children,
  ...otherProps
}) {
  return (
    <StyledNavLink {...otherProps}>
      <StyledIcon icon={icon} />
      <ToolTip>
        <span>{children}</span>
      </ToolTip>
    </StyledNavLink>
  );
}
