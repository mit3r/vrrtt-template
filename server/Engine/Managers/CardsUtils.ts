import { GameEngine } from "../GameEngine";
import { TCard, TRole, TRoleToParams, TRoleToRequire } from "../types/Cards";
import { Errors } from "../utils/Errors";
import { cardsList } from "./CardsActions";
import { Player } from "./PlayerManager";

export namespace Cards {
  export function parseUseParams<R extends TRole>(
    this: GameEngine,
    card_id: R,
    params: string[]
  ): TRoleToParams<R> {
    const card = Cards.get(card_id);
    if (card.requires.length !== params.length) throw new Error(Errors.CARD_REQUIRES_MORE_PARAMS);

    const parsed = params.map((param, i) => {
      switch (card.requires[i]) {
        case "p":
          return this.players.get(param);
        case "l":
          return parseInt(param);
      }
    });

    // Verify levels
    const levels = parsed.filter((p, i) => card.requires[i] === "l") as number[];
    for (const level of levels) {
      if (isNaN(level)) throw new Error(Errors.INVALID_LEVEL);
      if (level <= 0 || level > 8) throw new Error(Errors.INVALID_LEVEL);
    }

    const targets = parsed.filter((p, i) => card.requires[i] === "p") as Player[];
    for (const target of targets) {
      if (!target.alive) throw new Error(Errors.PLAYER_MUST_BE_ALIVE);

      // handmaid protection
      if (target.protected) throw new Error(Errors.PLAYER_IS_PROTECTED);
    }

    // flatery targeting
    const performer = this.players.current();
    if (performer.flattery_pointer !== null)
      if (!targets.some((t) => t.name === performer.flattery_pointer))
        throw new Error(Errors.FLLATTERY_NOT_TARGETED);

    return parsed as TRoleToParams<R>;
  }

  export function get<R extends TRole>(card_id: R): TCard<R> {
    const card = cardsList[card_id];
    if (!card) throw new Error(Errors.CARD_NOT_FOUND);

    const [level, requires, handlers] = card as [
      TCard<TRole>["level"],
      TRoleToRequire<R>,
      TCard<TRole>["handlers"]
    ];
    return { level, requires, handlers };
  }
}
