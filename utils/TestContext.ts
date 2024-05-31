import createPlayroomKitContext from "../PlayroomAdapter/index";

const multiplayerState = {
  count: 0,
  test: "0",
};

const playerState = {
  name: "Player",
};

const { 
  useMultiState,
  usePlayerState,
  MultiplayerContextProvider,
  PlayerContextProvider,
} = createPlayroomKitContext(playerState, multiplayerState,);

export { useMultiState, usePlayerState, MultiplayerContextProvider, PlayerContextProvider};

