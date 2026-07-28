import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// HashRouter is used instead of BrowserRouter because the app is built as a
// static site (deployed under an arbitrary sub-path, e.g. GitHub Pages) with
// no server-side rewrites available for deep links like "/tours/:id".
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>
);
