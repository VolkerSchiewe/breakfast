import { createRoot } from "react-dom/client";

import "./style.scss";
import { AppWithRouter } from "./components/App";
import { BrowserRouter } from "react-router-dom";
import React = require("react");

const root = createRoot(document.getElementById("container"));
root.render(
  <BrowserRouter>
    <AppWithRouter />
  </BrowserRouter>
);
