import React from "react";
import styled from "styled-components";

export const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

export const Information = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

export const Card = styled.div`
  padding: 0 0.5rem;

  table {
    border-collapse: collapse;
    border: 1px solid grey;

    td,
    th {
      padding: 0.5rem;
      border: 1px solid grey;
    }
  }

  button {
    padding: 0.5rem;
    margin: 0.5rem 0;
  }
`;

export const LeftCard = styled(Card)`
  flex-grow 1;
`;

export const DesktopOnlyCard = styled(Card)`
  @media (max-device-width: 1439px) {
    display: none;
  }
`;

export const AnchorList = styled.div`
  a {
    display: block;
  }

  a + a {
    margin-top: 0.5em;
  }
`;

export const LabelList = styled.div`
  label {
    display: block;
  }

  label + label {
    margin-top: 0.5em;
  }
`;

export const LoadingBar = styled.div`
  height: 0.3rem;
  position: relative;
  border: 1px solid grey;
  margin: 0 0 0.5rem;

  &::after {
    position: absolute;
    content: " ";
    background-color: grey;
    height: 100%;
    width: ${(props) => (props.grow ? "0%" : "100%")};
    transition: width;
    transition-duration: ${(props) => (props.grow ? "120s" : "0s")};
    transition-timing-function: linear;
    left: 0;
    bottom: 0;
  }
`;

export const Thl = styled.th`
  text-align: left;
`;
export const Thc = styled.th`
  text-align: center;
`;
export const Thr = styled.th`
  text-align: right;
`;
export const Tdl = styled.td`
  text-align: left;
`;
export const Tdc = styled.td`
  text-align: center;
`;
export const Tdr = styled.td`
  text-align: right;
`;

export const getStyle = (slot, size) => {
  const baseStyle = {
    textTransform: "capitalize",
    padding: "0.2rem",
    textAlign: "right",
    border: "1px solid grey",
    marginBottom: "-1px",
    fontSize: `${Math.max(size, 0.25)}em`,
    opacity: `${Math.max(size, 0.3)}`,
    backgroundColor: "#000000",
  };

  switch (slot) {
    case "body":
      return {
        ...baseStyle,
        backgroundColor: "#ffffff",
        color: "#000000",
      };
    case "boot":
      return { ...baseStyle, backgroundColor: "#0000cc" };
    case "helm":
      return { ...baseStyle, backgroundColor: "#009900" };
    case "glove":
      return { ...baseStyle, backgroundColor: "#cc0000" };
    case "weapon":
      return { ...baseStyle };
    case "amulet":
      return { ...baseStyle, backgroundColor: "#ffff00", color: "#000000" };
    case "ring":
      return { ...baseStyle, backgroundColor: "#ff00ff", color: "#000000" };
    case "belt":
      return { ...baseStyle, backgroundColor: "#00ffff", color: "#000000" };
    default:
      return baseStyle;
  }
};
