import { createRoot } from "react-dom/client";

import "./style.scss";
import { App } from "./components/App";
import { BrowserRouter } from "react-router-dom";
import * as React from "react";

const root = createRoot(document.getElementById("container"));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
