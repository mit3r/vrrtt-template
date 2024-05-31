import { PlayerState } from "playroomkit";

export type { PlayerState } from "playroomkit"

export const initMultiplayerState = {
    count: 0,
    // test: "0",
};

export type TMultiplayerState = typeof initMultiplayerState;

// id
// getProfile
// setState
// getState
// kick
// onQuit
export const initPlayerState = {

};

export type TPlayerState = PlayerState & typeof initPlayerState;