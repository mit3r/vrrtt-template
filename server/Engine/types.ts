import { LoveLetterEngine } from ".";
// PLAYERS ENGINE

export interface TPlayer {
  name: string;

  alive: boolean;
  online: boolean;

  hand: string[];
  known: { [name: string]: string[] };
  rejected: (string | null)[];

  points: number;
}

export interface TPlayersOptions {
  maxPlayers: number;
  minPlayers: number;
  queuing: "abc" | "cba" | "random" | "fifo" | "lifo";
  autoPlay: boolean;
}

// STATE ENGINE
export type TStatus = "WAITING" | "PLAYING" | "FINISHED";

export interface TStateOptions {
  maxPoints: number;
}

// CARDS ENGINE
type TCardAction =
  | "onAction" // player play card
  | "onEffect" // player just played card
  | "inRejected" // player played card
  | "onGuessed" // player is under attack
  | "onEnd"; // card has effect on end of round

type TCardActions = Record<TCardAction, (game: LoveLetterEngine) => void>;

export interface TCard {
  level: number;
  actions: Partial<TCardActions>;
}
