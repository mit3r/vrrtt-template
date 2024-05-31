import { createContext, PropsWithChildren, useEffect, useState } from "react";

import {
  setState as setStatePR,
  waitForState as waitForStatePR,
} from "playroomkit";

import { initMultiplayerState, TMultiplayerState } from "./States.ts";

type TMultiplayerContext = TMultiplayerState & {
  set: <K extends keyof TMultiplayerState>(
    key: K,
    value: TMultiplayerState[K]
  ) => void;
};

export const MultiplayerContext = createContext({} as TMultiplayerContext);

export default function MultiplayerContextProvider({
  children,
}: PropsWithChildren) {
  const [indirectState, setIndirect] = useState(initMultiplayerState);

  // Type-safe setState - playroomkit
  function setState<K extends keyof TMultiplayerState>(
    key: K,
    value: TMultiplayerState[K]
  ) {
    // console.log("Setting", key, value);
    setStatePR(key, value, true);
  }

  // Listen for changes to the multiplayer state
  // It must be re-registered every time the indirectState changes
  // Cause it waits only for one update
  useEffect(() => {
    Object.entries(initMultiplayerState).forEach(([key, value]) => {
      setStatePR(key, value, true);
      // console.log("Waiting for", key, value);

      waitForStatePR(key, (value) => {
        console.log("Received", key, value);
        setIndirect((prev) => ({ ...prev, [key]: value }));
      });
    });
  }, [indirectState]);

  return (
    <MultiplayerContext.Provider value={{ ...indirectState, set: setState }}>
      {children}
    </MultiplayerContext.Provider>
  );
}
