import express from "express";
import { LoveLetterEngine } from "./Engine";

import { Server } from "socket.io";
import { TState } from "./Engine/types";
import { State } from "./Engine/Managers/State";
import { Roles } from "./Engine/Managers/CardsUtils";

// // const app = express();
// // const port = 3000;

// // app.get("/", (req, res) => {
// //   res.redirect("http://localhost:3001");
// // });

// // app.listen(port, () => {
// //   console.log(`Server is running on port ${port}`);
// // });

// let state = {} as TState;

// const game = new LoveLetterEngine(["p1", "p2", "p3"], (newState) => {
//   state = newState;
// });

// import readline from "node:readline";
// import { TState } from "./Engine/types";
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// function terminal() {
//   console.log(state[game.PlayerGetCurrent().name].you.hand);
//   rl.question("hand, ...params:", (input) => {
//     const [hand, ...params] = input.split(" ");

//     game.playTurn(game.PlayerGetCurrent().name, Number(hand) as 0 | 1, params);

//     terminal();
//   });
// }

// terminal();

const logState = (s: TState) => {
  console.log("----- state -----");

  if (Object.values(s)[0].winner) {
    console.log("winner", Object.values(s)[0].winner);
    return;
  }

  Object.entries(s).forEach(([name, state]) => {
    console.log(
      name,
      state.you.alive ? state.you.hand : "dead",
      state.you.rejected,
      state.you.known
    );
  });
};

const game = new LoveLetterEngine(
  ["p1", "p2", "p3"],
  logState,
  true,
  ["guard", "handmaid", "princess", "king"].reverse() as Roles[]
);

logState(State.get.bind(game)());

console.log(game.stack);

game.playTurn("p1", 0, ["p2", "7"]);
