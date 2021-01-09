import React from "react";

export default function Icon({ className, icon }) {
  const classNames = [className, "fa", icon];
  return <i className={classNames.join(" ")}></i>;
}
