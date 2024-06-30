import { initStack, CardsTypes, Cards } from "./Cards";
import { TOptions, TPlayer } from "./types";
import { Errors } from "./utils/Errors";

export class LoveLetterBase {
  players: TPlayer[] = [];
  currentPointer = 0;

  stack: CardsTypes[] = [];

  options = {
    maxPlayers: 4,
    minPlayers: 2,
    queuing: "random",
    autoPlay: false,
    round: 0,
    winner: "",
  } as TOptions;

  constructor(names: string[]) {
    if (names.length > this.options.maxPlayers || names.length < this.options.minPlayers)
      throw new Error(Errors.INVALID_PLAYERS_AMOUNT);

    if (names.length !== new Set(names).size) throw new Error(Errors.PLAYERS_MUST_BE_UNIQUE);

    this.players = names.map((name) => {
      return {
        name,
        online: true,
        alive: true,
        hand: [],
        rejected: [],
        effect: null,
        points: 0,
        known: {},
        flattery_pointer: null,
        joke_pointer: null,
        protected: false,
        level: 0,
      } as TPlayer;
    });

    this.StackNew();
  }

  OptionsSet(options: Partial<TOptions>) {
    this.options = { ...this.options, ...options };
  }

  PlayerGet = (name: string) => {
    const player = this.players.find((player) => player.name === name);

    if (!player) throw new Error(Errors.PLAYER_NOT_FOUND);
    return player;
  };

  PlayerGetCurrent = () => {
    if (this.currentPointer >= this.players.length || this.currentPointer < 0)
      throw new Error(Errors.CURRENT_PLAYER_FAULT);

    const player = this.players[this.currentPointer];
    return player;
  };

  PlayersGetAll = () => this.players;

  PLayersGetOnline = () => this.players.filter((player) => player.online);

  PlayersGetAlive = () => this.players.filter((player) => player.alive);

  PlayerChooseNext = () => {
    if (this.players.length === 0) throw new Error(Errors.NO_PLAYERS);
    while (true) {
      this.currentPointer = (this.currentPointer + 1) % this.players.length;
      let player = this.PlayerGetCurrent();
      if (player.online && player.alive) break;
      // if (!player.online && this.options.autoPlay) break;
    }
  };

  PlayerAuthorize = (name: string) => {
    if (this.PlayerGetCurrent().name !== name) throw new Error(Errors.NOT_PLAYER_TURN);
    return true;
  };

  StackPop = () => this.stack.pop();
  StackNew = () => {
    this.stack = [...initStack].sort(() => Math.random() - 0.5);
  };
}
