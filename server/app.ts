import express from "express";
import { LoveLetterEngine } from "./Engine";

import { Server } from "socket.io";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.redirect("http://localhost:3001");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
