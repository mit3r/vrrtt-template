import { Player } from "../Managers/PlayerManager";
import { TSignal } from "./Signals";

export type TRole =
  | "guard"
  | "priest"
  | "baron"
  | "handmaid"
  | "prince"
  | "king"
  | "countess"
  | "princess";

type TRequireToParams<T extends string> = T extends ""
  ? []
  : T extends "p"
  ? [Player]
  : T extends "pp"
  ? [Player, Player]
  : T extends "pl"
  ? [Player, number]
  : never;

export type TRoleToRequire<R extends TRole> = R extends "guard"
  ? "pl"
  : R extends "priest"
  ? "p"
  : R extends "baron"
  ? "p"
  : R extends "handmaid"
  ? ""
  : R extends "prince"
  ? "p"
  : R extends "king"
  ? ""
  : R extends "countess"
  ? ""
  : R extends "princess"
  ? ""
  : never;

export type TRoleToParams<R extends TRole> = TRequireToParams<TRoleToRequire<R>>;

export type TUseCallback<R extends TRole> = (
  performer: Player,
  params: TRoleToParams<R>
) => TSignal[];

export type TOtherCallback = (performer: Player) => TSignal[];

export interface TCard<R extends TRole> {
  level: number;
  requires: TRoleToRequire<R>;
  handlers: Partial<{
    onUse: TUseCallback<R>;
    onEffect: TOtherCallback;
    onRejected: TOtherCallback;
    onEnd: TOtherCallback;
  }>;
}
