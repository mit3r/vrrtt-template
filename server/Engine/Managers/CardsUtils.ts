import { GameEngine } from "../GameEngine";
import { Card, TRole, TRoleToParams } from "../Classes/Card";
import { Errors } from "../utils/Errors";
import { cardsMap } from "./CardsActions";
import { Player } from "./PlayerManager";

export namespace Cards {
  export function canRequirementsBeMet<R extends TRole>(this: GameEngine, card: Card<R>): boolean {
    const requireTargets = card.requires.split("").filter((r) => r === "p").length;
    const targetablePlayers = this.players.getTargetable().length - (card.allowYourself ? 0 : 1);
    return requireTargets <= targetablePlayers;
  }

  export function parseParams<R extends TRole>(
    this: GameEngine,
    card: Card<R>,
    params: string[]
  ): TRoleToParams<R> {
    // parse params
    if (card.requires.length !== params.length) throw new Error(Errors.CARD_REQUIRES_MORE_PARAMS);

    const parsed = params.map((param, i) => {
      switch (card.requires[i]) {
        case "p":
          return this.players.get(param);
        case "l":
          return parseInt(param);
      }
    });

    verifyParsed.bind(this)(card, parsed as TRoleToParams<R>);

    return parsed as TRoleToParams<R>;
  }

  export function verifyParsed<R extends TRole>(
    this: GameEngine,
    card: Card<R>,
    parsed: TRoleToParams<R>
  ): boolean {
    // Verify levels
    const levels = parsed.filter((p, i) => card.requires[i] === "l") as number[];
    for (const level of levels) {
      if (isNaN(level)) throw new Error(Errors.INVALID_LEVEL);
      if (level <= 0 || level > 8) throw new Error(Errors.INVALID_LEVEL);
    }

    // Verify targets
    const targets = parsed.filter((p, i) => card.requires[i] === "p") as Player[];
    for (const target of targets) {
      if (!target.alive) throw new Error(Errors.PLAYER_MUST_BE_ALIVE);

      // handmaid protection
      if (target.protected) throw new Error(Errors.PLAYER_IS_PROTECTED);

      if (target.name === this.players.current().name && !card.allowYourself)
        throw new Error(Errors.PLAYER_CANT_USE_THEIR_SELF);
    }

    // flatery targeting
    const performer = this.players.current();
    if (performer.flattery_pointer !== null)
      if (!targets.some((t) => t.name === performer.flattery_pointer))
        throw new Error(Errors.FLLATTERY_NOT_TARGETED);

    return true;
  }

  export function get<R extends TRole>(card_id: R): Card<R> {
    const card = cardsMap.get(card_id);
    if (!card) throw new Error(Errors.CARD_NOT_FOUND);

    return card;
  }
}
