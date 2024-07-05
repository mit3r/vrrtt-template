import { deepEqual, strictEqual, throws, ok } from "node:assert";
import { GameEngine } from "../Engine/GameEngine";

import { it, describe, after, before } from "node:test";
import { TRole } from "../Engine/Classes/Card";

export function cardsTests() {
  describe("Guard", () => {
    const stack: TRole[] = ["guard", "handmaid", "priest", "guard", "guard", "guard", "guard"];
    let game = new GameEngine(["p1", "p2", "p3"], true, stack);

    it("p1 should have 2 guards", () => {
      const hand = game.players.current().hand;
      strictEqual(hand[0], "guard");
      strictEqual(hand[1], "guard");
    });

    it("should throw error on other player play", () => {
      for (const player of game.players.getAll().filter((p) => p.name !== "p1")) {
        throws(() => game.playTurn(player.name, "guard", ["p2", "2"]));
      }
    });

    it("should throw error on wrong target", () => {
      throws(() => game.playTurn("p1", "guard", ["p4", "4"]));
    });

    it("should throw error on wrong level", () => {
      throws(() => game.playTurn("p1", "guard", ["p3", "-1"]));
      throws(() => game.playTurn("p1", "guard", ["p3", "10"]));
    });

    it("Should be able to play and not eliminate", () => {
      game.playTurn("p1", "guard", ["p2", "2"]);
      strictEqual(game.players.get("p2").alive, true);
    });

    it("should not be able to kill handmaid", () => {
      game.playTurn("p2", "handmaid", []); // using handmaid
      strictEqual(game.players.get("p2").effect, "handmaid");
      strictEqual(game.players.get("p2").protected, true);
      game.playTurn("p3", "priest", ["p1"]);

      throws(() => game.playTurn("p1", "guard", ["p2", "2"]));
    });

    it("should not be able to guess another guard", () => {
      throws(() => game.playTurn("p1", "guard", ["p3"]));
    });
  });

  describe("Priest", () => {
    let game = new GameEngine(["p1", "p2", "p3"], true, [
      "priest",
      "guard",
      "guard",
      "guard",
      "guard",
    ]);

    // 1 because cards are sorted in hand

    it("p1 should has priest in hand", () => {
      ok(game.players.get("p1").has("priest"));
    });

    it("should requires target param", () => {
      throws(() => game.playTurn("p1", "priest", []));
      throws(() => game.playTurn("p1", "priest", ["2"]));
      throws(() => game.playTurn("p1", "priest", ["p4"]));

      // here comes error because cards was swapped because of playTurn
      // and priest is in the other hand
      strictEqual(game.players.get("p1").hand[1], "priest");
    });

    it("should not be able to target themself", () => {
      strictEqual(game.players.get("p1").hand[1], "priest");
      throws(() => game.playTurn("p1", "priest", ["p1"]));
    });

    it("should not be able to target dead player", () => {
      game.players.get("p3").kill();
      throws(() => game.playTurn("p1", "priest", ["p3"]));
    });

    it("should be able to target other player", () => {
      strictEqual(game.players.get("p1").hand[1], "priest");
      game.playTurn("p1", "priest", ["p2"]);
      strictEqual(game.players.get("p1").known["p2"], "guard");
    });

    it("should not be able to target protected player", () => {
      before(() => {
        game = new GameEngine(["p1", "p2", "p3"], true, [
          "handmaid",
          "priest",
          "guard",
          "guard",
          "guard",
        ]);
      });

      game.playTurn("p1", "handmaid", []);
      throws(() => game.playTurn("p2", "priest", ["p1"]));
    });

    it("should be able to draw if all players are protected", () => {
      before(() => {
        game = new GameEngine(["p1", "p2", "p3"], true, [
          "handmaid",
          "handmaid",
          "priest",
          "guard",
          "guard",
          "guard",
        ]);
      });

      game.playTurn("p1", "handmaid", []);
      game.playTurn("p2", "handmaid", []);
      ok(game.players.get("p1").protected);
      ok(game.players.get("p2").protected);

      game.playTurn("p3", "priest", ["p3"]); // it won't throw because p3 is the only not protected player
    });
  });

  describe("Baron", () => {
    let game: GameEngine;

    it("should requires target param", () => {
      before(() => {
        game = new GameEngine(["p1", "p2", "p3"], true, [
          "baron",
          "guard",
          "guard",
          "guard",
          "guard",
        ]);
      });

      throws(() => game.playTurn("p1", "baron", []));
      throws(() => game.playTurn("p1", "baron", ["2"]));
      throws(() => game.playTurn("p1", "baron", ["p4"]));
    });

    it("should not be able to target themself", () => {
      ok(game.players.get("p1").has("baron"));
      throws(() => game.playTurn("p1", "baron", ["p1"]));
    });

    it("should not be able to target dead player", () => {
      before(() => {
        game = new GameEngine(["p1", "p2", "p3"], true, [
          "baron",
          "guard",
          "guard",
          "guard",
          "guard",
        ]);
      });
      game.players.get("p3").kill();
      throws(() => game.playTurn("p1", "baron", ["p3"]));
    });

    it("should be able to kill player with lower card", () => {
      before(() => {
        game = new GameEngine(["p1", "p2", "p3"], true, [
          "baron",
          "guard",
          "guard",
          "priest",
          "guard",
        ]);

        ok(game.players.current().has("baron"));
        ok(game.players.current().has("priest"));
        ok(game.players.get("p2").has("guard"));
      });

      game.playTurn("p1", "baron", ["p2"]);
      ok(game.players.get("p1").alive);
      ok(!game.players.get("p2").alive);
    });

    it("player should be killed when its level is lower", () => {
      before(() => {
        game = new GameEngine(["p1", "p2", "p3"], true, [
          "baron",
          "princess",
          "guard",
          "priest",
          "guard",
          "guard",
        ]);

        ok(game.players.current().has("baron"));
        ok(game.players.current().has("priest"));
        ok(game.players.get("p2").has("princess"));
      });

      game.playTurn("p1", "baron", ["p2"]);
      ok(!game.players.get("p1").alive);
      ok(game.players.get("p2").alive);
    });

    it("nothing should happend when players has same level", () => {
      before(() => {
        game = new GameEngine(["p1", "p2", "p3"], true, [
          "baron",
          "handmaid",
          "guard",
          "handmaid",
          "guard",
          "guard",
        ]);

        ok(game.players.current().has("baron"));
        ok(game.players.get("p1").has("handmaid"));
        ok(game.players.get("p2").has("handmaid"));
      });

      game.playTurn("p1", "baron", ["p2"]);
      ok(game.players.get("p1").alive);
      ok(game.players.get("p2").alive);
    });

    it("should not be able to target protected player", () => {
      before(() => {
        game = new GameEngine(["p1", "p2", "p3"], true, [
          "handmaid",
          "baron",
          "guard",
          "guard",
          "guard",
        ]);
      });

      game.playTurn("p1", "handmaid", []);
      throws(() => game.playTurn("p2", "baron", ["p1"]));
    });
  });

  describe("Handmaid", () => {
    let game: GameEngine;
    it("should require no params", () => {
      before(() => {
        game = new GameEngine(["p1", "p2", "p3"], true, [
          "handmaid",
          "guard",
          "guard",
          "guard",
          "guard",
        ]);
      });

      throws(() => game.playTurn("p1", "handmaid", ["p2"]));
      throws(() => game.playTurn("p1", "handmaid", ["p2", "2"]));
      throws(() => game.playTurn("p1", "handmaid", ["p2", "p3", "3"]));

      game.playTurn("p1", "handmaid", []);
    });

    it("should protect player against guard", () => {
      before(() => {
        game = new GameEngine(["p1", "p2", "p3"], true, [
          "handmaid",
          "guard",
          "guard",
          "guard",
          "guard",
        ]);
      });

      game.playTurn("p1", "handmaid", []);
      throws(() => game.playTurn("p2", "guard", ["p1", "2"]));
    });

    it("should protect player against baron", () => {
      before(() => {
        game = new GameEngine(["p1", "p2", "p3"], true, [
          "handmaid",
          "baron",
          "guard",
          "guard",
          "guard",
        ]);
      });

      game.playTurn("p1", "handmaid", []);
      throws(() => game.playTurn("p2", "baron", ["p1"]));
    });

    it("should protect player against priest", () => {
      before(() => {
        game = new GameEngine(["p1", "p2", "p3"], true, [
          "handmaid",
          "priest",
          "guard",
          "guard",
          "guard",
        ]);
      });

      game.playTurn("p1", "handmaid", []);
      throws(() => game.playTurn("p2", "priest", ["p1"]));
    });

    it("should protect player against prince", () => {
      before(() => {
        game = new GameEngine(["p1", "p2", "p3"], true, [
          "handmaid",
          "prince",
          "guard",
          "guard",
          "guard",
        ]);
      });

      game.playTurn("p1", "handmaid", []);
      throws(() => game.playTurn("p2", "prince", []));
    });

    it("protect should be removed after turn", () => {
      before(() => {
        game = new GameEngine(["p1", "p2", "p3"], true, [
          "handmaid",
          "guard",
          "guard",
          "guard",
          "guard",
          "guard",
          "guard",
          "guard",
        ]);
      });

      game.playTurn("p1", "handmaid", []);
      ok(game.players.get("p1").protected);
      game.playTurn("p2", "guard", ["p3", "2"]);
      game.playTurn("p3", "guard", ["p2", "2"]);
      game.playTurn("p1", "guard", ["p2", "2"]);

      ok(!game.players.get("p1").protected);
      strictEqual(game.players.getUnprotected().length, 3);
    });
  });

  describe("Prince", () => {
    it("should requires target param", () => {
      const game = new GameEngine(["p1", "p2", "p3"], true, [
        "prince",
        "guard",
        "guard",
        "guard",
        "guard",
      ]);

      throws(() => game.playTurn("p1", "prince", []));
      throws(() => game.playTurn("p1", "prince", ["2"]));
      throws(() => game.playTurn("p1", "prince", ["p4"]));
    });

    it("should not be able to target dead player", () => {
      const game = new GameEngine(["p1", "p2", "p3"], true, [
        "prince",
        "guard",
        "guard",
        "guard",
        "guard",
      ]);

      game.players.get("p3").kill();
      throws(() => game.playTurn("p1", "prince", ["p3"]));
    });

    it("should be able to target themself", () => {
      const game = new GameEngine(["p1", "p2", "p3"], true, [
        "prince",
        "guard",
        "guard",
        "baron",
        "guard",
      ]);
      ok(game.players.get("p1").has("baron"));

      game.playTurn("p1", "prince", ["p1"]);

      ok(game.players.get("p1").has("guard"));
      strictEqual(game.players.current().name, "p2");
    });
  });

  describe("King", () => {
    let game: GameEngine;
    it("should not be able to target dead player", () => {
      game = new GameEngine(["p1", "p2", "p3"], true, ["king", "guard", "guard", "guard", "guard"]);

      game.players.get("p3").kill();
      throws(() => game.playTurn("p1", "king", ["p3"]));
    });

    it("should not be able to target themself", () => {
      before(() => {
        game = new GameEngine(["p1", "p2", "p3"], true, [
          "king",
          "guard",
          "guard",
          "guard",
          "guard",
        ]);
      });

      throws(() => game.playTurn("p1", "king", ["p1"]));
    });

    it("should swap cards with other player", () => {
      before(() => {
        game = new GameEngine(["p1", "p2", "p3"], true, [
          "king",
          "guard",
          "guard",
          "baron",
          "guard",
        ]);
      });

      ok(game.players.get("p1").has("king"));
      ok(game.players.get("p1").has("baron"));

      ok(game.players.get("p2").has("guard"));
      game.playTurn("p1", "king", ["p2"]);

      ok(game.players.get("p1").has("guard"));

      ok(game.players.get("p2").has("baron"));
    });

    it("should not be able to target protected player", () => {
      before(() => {
        game = new GameEngine(["p1", "p2", "p3"], true, [
          "handmaid",
          "king",
          "guard",
          "guard",
          "guard",
        ]);
      });

      game.playTurn("p1", "handmaid", []);
      throws(() => game.playTurn("p2", "king", ["p1"]));
    });

    it("should be able to draw if all players are protected", () => {
      before(() => {
        game = new GameEngine(["p1", "p2", "p3"], true, [
          "handmaid",
          "handmaid",
          "king",
          "guard",
          "guard",
          "guard",
        ]);
      });

      game.playTurn("p1", "handmaid", []);
      game.playTurn("p2", "handmaid", []);
      ok(game.players.get("p1").protected);
      ok(game.players.get("p2").protected);

      game.playTurn("p3", "king", ["p3"]); // it won't throw because p3 is the only not protected player
    });

    describe("Countess", () => {
      it("should require no params", () => {
        const game = new GameEngine(["p1", "p2", "p3"], true, [
          "countess",
          "guard",
          "guard",
          "guard",
          "guard",
        ]);

        throws(() => game.playTurn("p1", "countess", ["p2"]));
        throws(() => game.playTurn("p1", "countess", ["p2", "2"]));
        throws(() => game.playTurn("p1", "countess", ["p2", "p3", "3"]));
      });

      it("should be played if player has prince or king", () => {
        const game = new GameEngine(["p1", "p2", "p3"], true, [
          "countess",
          "guard",
          "guard",
          "guard",
          "guard",
        ]);

        game.playTurn("p1", "countess", []);
        strictEqual(game.players.current().name, "p2");
      });

      it("should be played if player has prince or king", () => {
        const game = new GameEngine(["p1", "p2", "p3"], true, [
          "countess",
          "guard",
          "guard",
          "guard",
          "guard",
        ]);

        game.playTurn("p1", "countess", []);
        strictEqual(game.players.current().name, "p2");
      });

      it("should kill player if they have prince", () => {
        const game = new GameEngine(["p1", "p2", "p3"], true, [
          "prince",
          "guard",
          "guard",
          "countess",
          "guard",
        ]);

        game.playTurn("p1", "prince", ["p2"]);
        ok(!game.players.get("p1").alive);
        strictEqual(game.players.get("p1").rejected.length, 2);
      });

      it("should kill player if they have king", () => {
        const game = new GameEngine(["p1", "p2", "p3"], true, [
          "king",
          "guard",
          "guard",
          "countess",
          "guard",
        ]);

        game.playTurn("p1", "king", ["p2"]);
        ok(!game.players.get("p1").alive);
        strictEqual(game.players.get("p1").rejected.length, 2);
      });
    });
  });

  describe("Princess", () => {
    it("should kill player they draw princess", () => {
      const game = new GameEngine(["p1", "p2", "p3"], true, [
        "guard",
        "guard",
        "guard",
        "princess",
        "guard",
      ]);

      game.playTurn("p1", "princess", []);

      ok(!game.players.get("p1").alive);
    });

    it("should kill other player if they draw princess", () => {
      const game = new GameEngine(["p1", "p2", "p3"], true, [
        "prince",
        "princess",
        "guard",
        "guard",
        "guard",
      ]);

      game.playTurn("p1", "prince", ["p2"]);

      ok(!game.players.get("p2").alive);
    });
  });
}
