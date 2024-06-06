import { PlayerState } from "playroomkit";

export type { PlayerState } from "playroomkit"

export interface Question {
    text: string,
    answers: string[],
    correct: number[],
}

export const initMultiplayerState = {
    queue: [] as Question[],
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