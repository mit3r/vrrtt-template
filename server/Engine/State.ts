import { LoveLetterEngine } from ".";
import { TOtherPlayer, TPersonalState, TPlayer, TState } from "./types";

export namespace State {
  export function get(this: LoveLetterEngine): TState {
    const players = this.PlayersGetAll();

    return this.PlayersGetAll().reduce((acc, player) => {
      acc[player.name] = getPersonal.bind(this)(
        player,
        players.filter((p) => p.name !== player.name)
      );

      return acc;
    }, {} as Record<string, TPersonalState>);
  }

  function getPersonal(this: LoveLetterEngine, me: TPlayer, others: TPlayer[]): TPersonalState {
    const player = me;
    const otherPlayers: TOtherPlayer[] = others.map((p) => ({
      name: p.name,
      alive: p.alive,
      level: p.level,
      online: p.online,
      effect: p.effect,
      protected: p.protected,
      rejected: p.rejected,
      points: p.points,
      flattery_pointer: p.flattery_pointer,
      joke_pointer: p.joke_pointer,
      known: me.known[p.name] || null,
    }));

    return {
      you: player,
      others: otherPlayers,
      round: 0,
      winner: this.winner,
    };
  }
}
