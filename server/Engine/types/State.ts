import { Player } from "../Managers/PlayerManager";
import { NonFunctionsProps } from "../types";

export type TOtherPlayer = Omit<Pick<Player, NonFunctionsProps<Player>>, "hand" | "known"> & {
  known: string | null;
};

export interface TPersonalState {
  you: Player;
  others: TOtherPlayer[];

  round: number;
  winner: string | null;
}

export type TState = Record<string, TPersonalState>;
