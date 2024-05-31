import React from "react";
import ReactDOM from "react-dom/client";

import GameContextProvider from "../utils/MultiplayerContext.tsx";

import { insertCoin, InitOptions } from "playroomkit";

import "./index.css";
import App from "../pages/App";

const settings: InitOptions = {
  skipLobby: true,
};

await insertCoin(settings, () => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <GameContextProvider>
        <App />
      </GameContextProvider>
    </React.StrictMode>
  );
});
