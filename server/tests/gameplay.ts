import { deepEqual, strictEqual, throws } from "node:assert";
import { LoveLetterEngine } from "../Engine";

import { it, describe } from "node:test";

import { CardsTypes } from "../Engine/Cards";

export function cardsTests() {
  describe("Guard", () => {
    const stack: CardsTypes[] = [
      "guard",
      "handmaid",
      "priest",
      "guard",
      "guard",
      "guard",
      "guard",
    ].reverse() as CardsTypes[];
    let game = new LoveLetterEngine(["p1", "p2", "p3"], true, stack);

    it("p1 should have 2 guards", () => {
      const hand = game.PlayerGetCurrent().hand;
      strictEqual(hand[0], "guard");
      strictEqual(hand[1], "guard");
    });

    it("should throw error on other player play", () => {
      for (const player of game.PlayersGetAll().filter((p) => p.name !== "p1")) {
        throws(() => game.playTurn(player.name, 0, ["p2", "2"]));
      }
    });

    it("should throw error on wrong target", () => {
      throws(() => game.playTurn("p1", 0, ["p4", "4"]));
    });

    it("should throw error on wrong level", () => {
      throws(() => game.playTurn("p1", 0, ["p3", "-1"]));
      throws(() => game.playTurn("p1", 0, ["p3", "10"]));
    });

    it("Should be able to play and not eliminate", () => {
      game.playTurn("p1", 0, ["p2", "2"]);
      strictEqual(game.PlayerGet("p2").alive, true);
    });

    it("should not be able to kill handmaid", () => {
      game.playTurn("p2", 0, []); // using handmaid
      strictEqual(game.PlayerGet("p2").effect, "handmaid");
      strictEqual(game.PlayerGet("p2").protected, true);
      game.playTurn("p3", 0, ["p1"]);

      throws(() => game.playTurn("p1", 0, ["p2", "2"]));
    });

    it("should not be able to guess another guard", () => {
      throws(() => game.playTurn("p1", 0, ["p3"]));
    });
  });

  describe("Priest", () => {
    let game = new LoveLetterEngine(
      ["p1", "p2", "p3"],
      true,
      ["priest", "guard", "guard", "guard", "guard"].reverse() as CardsTypes[]
    );

    it("p1 should has priest in hand", () => {
      strictEqual(game.PlayerGet("p1").hand[0], "priest");
    });

    it("should requires target param", () => {
      throws(() => game.playTurn("p1", 0, []));
      throws(() => game.playTurn("p1", 0, ["2"]));
      throws(() => game.playTurn("p1", 0, ["p4"]));

      // here comes error because cards was swapped because of playTurn
      // and priest is in the other hand
      strictEqual(game.PlayerGet("p1").hand[0], "priest");
    });

    it("should not be able to target themself", () => {
      // strictEqual(game.PlayerGet("p1").hand[0], "priest");
      throws(() => game.playTurn("p1", 0, ["p1"]));
    });
  });
}
