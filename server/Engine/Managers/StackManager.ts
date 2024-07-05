import { TRole } from "../Classes/Card";

export class StackManager {
  stack: TRole[] = [];

  constructor(stack: TRole[] = initStack, shuffle: boolean = true) {
    this.stack = stack;

    if (shuffle) this.stack.sort(() => Math.random() - 0.5);
  }

  pop = (): TRole | undefined => this.stack.shift();
  empty = (): boolean => this.stack.length === 0;
}

export const initStack: TRole[] = [
  "guard",
  "guard",
  "guard",
  "guard",
  "guard",
  "priest",
  "priest",
  "baron",
  "baron",
  "handmaid",
  "handmaid",
  "prince",
  "prince",
  "king",
  "countess",
  "princess",
];
