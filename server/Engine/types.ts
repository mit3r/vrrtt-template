export interface TOptions {
  maxPlayers: number;
  minPlayers: number;
  queuing: "abc" | "cba" | "random" | "fifo" | "lifo";
  autoPlay: boolean;
  round: number;
  winner: string;
}

export type NonFunctionsProps<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];
