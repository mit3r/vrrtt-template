import { createContext, PropsWithChildren, useEffect, useState } from "react";

import { RPC } from "playroomkit";

import { initMultiplayerState, TMultiplayerState } from "./States.ts";

type TSetMultiplayerState = <K extends keyof TMultiplayerState>(
  key: K,
  value:
    | TMultiplayerState[K]
    | ((prev: TMultiplayerState[K]) => TMultiplayerState[K])
) => void;

type TMultiplayerContext = TMultiplayerState & {
  set: TSetMultiplayerState;
};

export const MultiplayerContext = createContext({} as TMultiplayerContext);

export default function MultiplayerContextProvider({
  children,
}: PropsWithChildren) {
  const [indirectState, setIndirect] = useState(initMultiplayerState);

  // Type-safe setState - playroomkit
  const setState: TSetMultiplayerState = (key, setValue) => {
    const value =
      typeof setValue === "function" ? setValue(indirectState[key]) : setValue;

    RPC.call("setMultiplayerState", { key, value }, 0, () =>
      setIndirect((prev) => ({ ...prev, [key]: value }))
    );
  };

  useEffect(() => {
    RPC.register("setMultiplayerState", async ({ key, value }) => {
      setIndirect((prev) => ({ ...prev, [key]: value }));
    });
  }, []);

  return (
    <MultiplayerContext.Provider value={{ ...indirectState, set: setState }}>
      {children}
    </MultiplayerContext.Provider>
  );
}
