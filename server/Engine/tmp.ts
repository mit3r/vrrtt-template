import { CardsTypes } from "./Cards";
import { TPlayer } from "./types";

class Player implements TPlayer {
  name: string;
  points: number = 0;

  hand: CardsTypes[] = [];
  level: number = 0;
  protected: boolean = false;
  alive: boolean = true;

  rejected: CardsTypes[] = [];
  effect: CardsTypes | null = null;

  known: { [name: string]: CardsTypes | null } = {};

  flattery_pointer: string | null = null;
  joke_pointer: string | null = null;

  // to deletion
  online: boolean = true;

  constructor(name: string) {
    this.name = name;
  }
}
