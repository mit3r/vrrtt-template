import express from "express";
import { LoveLetterEngine } from "./Engine";

const app = express();
const port = 3000;

let posts = [{ text: "Hello World", author: "John" }];

app.get("/", (req, res) => {
  res.redirect("http://localhost:3001");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const g = new LoveLetterEngine();
