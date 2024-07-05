import { Player } from "../Managers/PlayerManager";
import { TSignal } from "./Signal";

export const roles = [
  "guard",
  "priest",
  "baron",
  "handmaid",
  "prince",
  "king",
  "countess",
  "princess",
] as const;

export type TRole = (typeof roles)[number];

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

export type TCardHandlers<R extends TRole> = Partial<{
  onUse: TUseCallback<R>;
  onEffect: TOtherCallback;
  onRejected: TOtherCallback;
  onEnd: TOtherCallback;
}>;

export class Card<R extends TRole> {
  constructor(
    public role: TRole,
    public level: number,
    public requires: string,
    public handlers: TCardHandlers<R>
  ) {
    this.role = role;
    this.level = level;
    this.requires = requires;
    this.handlers = handlers;
  }

  callUse(performer: Player, params: TRoleToParams<R>): TSignal[] {
    if (!this.handlers.onUse) return [];
    return this.handlers.onUse(performer, params);
  }

  callEffect(performer: Player): TSignal[] {
    if (!this.handlers.onEffect) return [];
    return this.handlers.onEffect(performer);
  }

  callRejected(performer: Player): TSignal[] {
    if (!this.handlers.onRejected) return [];
    return this.handlers.onRejected(performer);
  }

  callEnd(performer: Player): TSignal[] {
    if (!this.handlers.onEnd) return [];
    return this.handlers.onEnd(performer);
  }
}
