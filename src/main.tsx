import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import App from "../pages/App";

import { insertCoin, InitOptions } from "playroomkit";

import {
  MultiplayerContextProvider,
  PlayerContextProvider,
} from "../utils/TestContext";

const settings: InitOptions = {
  skipLobby: true,
};

await insertCoin(settings, () => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <PlayerContextProvider>
        <MultiplayerContextProvider>
          <App />
        </MultiplayerContextProvider>
      </PlayerContextProvider>
    </React.StrictMode>
  );
});
