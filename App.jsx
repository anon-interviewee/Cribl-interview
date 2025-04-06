import * as React from "react";
import { createRoot } from "react-dom/client";

import { LogViewer } from "./LogViewer.jsx";

createRoot(document.getElementById("root")).render(
  <>
    <LogViewer />
  </>
);