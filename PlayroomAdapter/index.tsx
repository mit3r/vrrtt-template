import { RPC } from "playroomkit";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

type TSetState<S> = <K extends keyof S>(
  key: K,
  value: S[K] | ((prev: S[K]) => S[K])
) => void;

interface TPlayroomKitReturn<TPlayState, TMultiState> {
  PlayerContextProvider: (props: PropsWithChildren) => JSX.Element;
  MultiplayerContextProvider: (props: PropsWithChildren) => JSX.Element;
  usePlayerState: () => TPlayState & { setPlayerState: TSetState<TPlayState> };
  useMultiState: () => TMultiState & { setMultiState: TSetState<TMultiState> };
}

export default function createPlayroomKitContexts<TPlayState, TMultiState>(
  playerState: TPlayState,
  multiplayerState: TMultiState
): TPlayroomKitReturn<TPlayState, TMultiState> {
  type TSetPlayerState = TSetState<TPlayState>;
  const PlayerContext = createContext(
    {} as TPlayState & { setPlayerState: TSetPlayerState }
  );

  function PRKPlayerContextProvider(props: PropsWithChildren): JSX.Element {
    const [indirectPlayerState, setIndirectPlayer] = useState(playerState);

    const setPlayerState: TSetPlayerState = (key, setValue) => {
      const value =
        typeof setValue === "function"
          ? (
              setValue as <K extends keyof TPlayState>(
                prev: TPlayState[K]
              ) => TPlayState[K]
            )(indirectPlayerState[key])
          : setValue;

      RPC.call("setPlayerState", { key, value }, 0, () =>
        setIndirectPlayer((prev) => ({ ...prev, [key]: value }))
      );
    };

    useEffect(() => {
      RPC.register("setPlayerState", async ({ key, value }) => {
        setIndirectPlayer((prev) => ({ ...prev, [key]: value }));
      });
    }, []);

    return (
      <PlayerContext.Provider
        value={{
          ...indirectPlayerState,
          setPlayerState,
        }}
      >
        {props.children}
      </PlayerContext.Provider>
    );
  }

  type TSetMultiState = TSetState<TMultiState>;
  const MultiplayerContext = createContext(
    {} as TMultiState & { setMultiState: TSetMultiState }
  );

  function PRKMultiplayerContextProvider(
    props: PropsWithChildren
  ): JSX.Element {
    const [indirectMultiState, setIndirectMulti] = useState(multiplayerState);

    const setMultiState: TSetMultiState = (key, setValue) => {
      const value =
        typeof setValue === "function"
          ? (
              setValue as <K extends keyof TMultiState>(
                prev: TMultiState[K]
              ) => TMultiState[K]
            )(indirectMultiState[key])
          : setValue;

      RPC.call("setMultiState", { key, value }, 0, () =>
        setIndirectMulti((prev) => ({ ...prev, [key]: value }))
      );
    };

    useEffect(() => {
      RPC.register("setMultiState", async ({ key, value }) => {
        setIndirectMulti((prev) => ({ ...prev, [key]: value }));
      });
    }, []);

    return (
      <MultiplayerContext.Provider
        value={{
          ...indirectMultiState,
          setMultiState,
        }}
      >
        {props.children}
      </MultiplayerContext.Provider>
    );
  }

  return {
    PlayerContextProvider: PRKPlayerContextProvider,
    MultiplayerContextProvider: PRKMultiplayerContextProvider,
    usePlayerState: () => useContext(PlayerContext),
    useMultiState: () => useContext(MultiplayerContext),
  };
}
