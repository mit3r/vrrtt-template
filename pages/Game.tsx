import { me, usePlayerState } from "playroomkit";
import { useEffect, useState } from "react";
import { useMultiState } from "../utils/TestContext";
import Results from "../pages/Results";

export default function Game() {
  const { question, ingame, setMultiState } = useMultiState();
  const [score, setScore] = usePlayerState(me(), "score", 0);

  const [a, setA] = useState<number | null>(null);

  useEffect(() => {
    if (a != null) setScore(score + 1);
  }, [a]);

  const correctness = question?.correct.includes(a!);

  if (!ingame) return <Results />;

  return question === null ? (
    <>
      <div className="w-screen h-screen flex flex-col justify-center items-center">
        Wait for the next question from host.
        <div>Your score: {score}</div>
      </div>
    </>
  ) : a != null ? (
    <>
      <div className="w-screen h-screen flex flex-col justify-center items-center">
        <h1>
          Your answer is{" "}
          <span className={correctness ? "text-green-500" : "text-red-500"}>
            {correctness ? "correct" : "incorrect"}
          </span>
        </h1>

        <h2>Wait for other players</h2>
      </div>
    </>
  ) : (
    <>
      <div className="w-screen h-screen flex flex-col justify-center items-center gap-y-4">
        <div className="text-wrap text-center px-4 ">{question.text}</div>

        <div className="grid grid-cols-2 gap-2">
          {question.answers.map((v, i) => (
            <button
              key={i}
              className="bg-black rounded-md text-white text-sm p-1 hover:scale-105 active:scale-95 transition-transform"
              onClick={() => {
                setA(i);
              }}
            >
              {v}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
