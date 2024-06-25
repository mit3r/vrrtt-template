import { TCardHandlerUse } from "./types";
import CardsEngine from "./CardsEngine";
import PlayersEngine from "./PlayersEngine";

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
export interface TStateOptions {
  maxPoints: number;
}

export type TOtherPlayer = Omit<TPlayer, "hand" | "known">;

export interface TPersonalState {
  you: TPlayer;
  others: TOtherPlayer[];

  round: number;
  winner: string | null;
}

export type TState = Record<string, TPersonalState>;

// CARDS ENGINE

export type TCardHandler = (players: PlayersEngine, cards: CardsEngine) => Signal[];

export type TCardHandlerUse = (
  players: PlayersEngine,
  cards: CardsEngine,
  params: string[]
) => Signal[];

export interface TCard {
  level: number;
  requires: string;
  handlers: Partial<{
    onUse: TCardHandlerUse;
    onEffect: TCardHandler;
    inRejected: TCardHandler;
  }>;
}

export enum SignalType {
  PROTECT = "PROTECT",
  SHOW = "SHOW",
  REJECT = "REJECT",
  KILL = "KILL",
  SWAP = "SWAP",
  CHANGE = "CHANGE",
  POINT = "POINT",
  LEVEL = "LEVEL",
  FLATTERY = "FLATTERY",
}

export interface Signal {
  type: SignalType;
  performer: string;
  target1?: string;
  target2?: string;
}
