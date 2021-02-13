import React from "react";

import { DASHBOARD_LAYOUTS } from "../../constants";
import { getSettings } from "../../utils";

import DefaultDashboard from "./layouts/default";
import StreamlabsDashboard from "./layouts/streamlabs";

export default function Dashboard() {
  switch (getSettings()?.dashboardLayout) {
    case DASHBOARD_LAYOUTS.streamlabs:
      return <StreamlabsDashboard />;
    default:
      return <DefaultDashboard />;
  }
}
