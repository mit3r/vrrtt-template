import { LoveLetterEngine } from ".";
import { CardsTypes } from "./Cards";
// PLAYERS ENGINE
export interface TPlayer {
  name: string;

  alive: boolean;
  online: boolean;

  hand: CardsTypes[];
  known: { [name: string]: CardsTypes | null };
  effect: CardsTypes | null;
  rejected: CardsTypes[];

  flattery_pointer: string | null;
  joke_pointer: string | null;
  protected: boolean;

  level: number;

  points: number;
}

export interface TOptions {
  maxPlayers: number;
  minPlayers: number;
  queuing: "abc" | "cba" | "random" | "fifo" | "lifo";
  autoPlay: boolean;
  round: number;
  winner: string;
}

// STATE ENGINE
export interface TStateOptions {
  maxPoints: number;
}

export type TOtherPlayer = Omit<TPlayer, "hand" | "known"> & {
  known: string | null;
};

export interface TPersonalState {
  you: TPlayer;
  others: TOtherPlayer[];

  round: number;
  winner: string | null;
}

export type TState = Record<string, TPersonalState>;

// Cards

export interface TCard {
  level: number;
  requires: string;
  handlers: Partial<{
    onUse: TCardHandlerUse;
    onEffect: TCardHandler;
    inRejected: TCardHandler;
  }>;
}
export type TCardHandler = (this: LoveLetterEngine, performer: string) => Signal[];
export type TCardHandlerUse = (
  this: LoveLetterEngine,
  performer: string,
  params: string[]
) => Signal[];

// Signals
export enum SignalType {
  PROTECT = "PROTECT",
  SHOW = "SHOW",
  REJECT = "REJECT",
  KILL = "KILL",
  SWAP = "SWAP",
  POINT = "POINT",
  LEVEL = "LEVEL",
  FLATTERY = "FLATTERY",
  JOKE = "JOKE",
}

export interface Signal {
  type: SignalType;
  performer: string;
  target1?: string;
  target2?: string;
}
