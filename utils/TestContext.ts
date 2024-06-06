import createPlayroomKitContext from "../PlayroomAdapter/index";

export interface Question {
  text: string,
  answers: string[],
  correct: number[],
}

// {
//   text: "Czy to ma sens?",
//   answers: ["Tak", "Nie", "Nie wiem", "Chuj mnie już strzela"],
//   correct: [1] as number[]
// }

const multiplayerState = {
  question: null as Question | null,

  ingame: true,
};

const playerState = {
  score: 0 as number,
  answered: false as boolean
};

const { 
  useMultiState,
  usePlayerState,
  MultiplayerContextProvider,
  PlayerContextProvider,
} = createPlayroomKitContext(playerState, multiplayerState,);

export { MultiplayerContextProvider, PlayerContextProvider, useMultiState, usePlayerState };

