import { pl } from "./utils/Translation";
import PlayersEngine from "./PlayersEngine";
import { EngineEvents, Signal, TOtherPlayer, TPersonalState, TState, TStateOptions } from "./types";
import CardsEngine from "./CardsEngine";

const initOptions = {
  maxPoints: 3,
} as TStateOptions;

export default class StateEngine {
  private options: TStateOptions = initOptions;

  setOptions = (options: Partial<TStateOptions>) => {
    this.options = { ...initOptions, ...options };
  };

  round: number = 0;
  winner: string = "";

  get = (players: PlayersEngine) => {
    const state: TState = {};

    const allPlayers = players.getAll();
    for (const { name } of allPlayers) {
      const you = players.get(name);
      const others = allPlayers
        .filter((p) => p.name !== name)
        .map(
          (p) =>
            ({
              name: p.name,
              alive: p.alive,
              online: p.online,
              rejected: p.rejected,
              points: p.points,
            } as TOtherPlayer)
        );

      // assign state to player
      state[name] = {
        you: you,
        others: others,
        round: this.round,
        winner: this.winner,
      } as TPersonalState;
    }

    return state;
  };

  collectSignals = (players: PlayersEngine, cards: CardsEngine) => {
    const signals: Signal[] = [];

    for (const player of players.getAll()) {
    }

    return signals;
  };

  update = (players: PlayersEngine, cards: CardsEngine) => {
    // i play a card
    // card i
  };
}
