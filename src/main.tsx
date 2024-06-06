import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import Host from "../pages/Host";
import Player from "../pages/Game";

import { isHost } from "playroomkit";

import { insertCoin, InitOptions } from "playroomkit";

import {
  MultiplayerContextProvider,
  PlayerContextProvider,
} from "../utils/TestContext";

const settings: InitOptions = {
  // skipLobby: true,
};

await insertCoin(settings, () => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <PlayerContextProvider>
        <MultiplayerContextProvider>
          {isHost() ? <Host /> : <Player />}
        </MultiplayerContextProvider>
      </PlayerContextProvider>
    </React.StrictMode>
  );
});
