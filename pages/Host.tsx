import { useState } from "react";
import { useMultiState } from "../utils/TestContext";
import Results from "./Results";

export default function App() {
  const { question, ingame, setMultiState } = useMultiState();

  const [text, setText] = useState("");
  const [answers, setAnswers] = useState<string[]>(["", "", "", ""]);
  const [correct, setCorrect] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ]);

  const [sended, setSended] = useState<boolean>(false);

  const queueQuestion = () => {
    if (sended) {
      return;
    }

    setMultiState("question", {
      text: text,
      answers: answers,
      correct: correct.reduce((p, c, i) => {
        if (c) p.push(i);
        return p;
      }, [] as number[]),
    });

    setSended(true);

    setTimeout(() => {
      console.log(question);
      setMultiState("question", null);
      setSended(false);
    }, 10 * 1000);
  };

  if (!ingame) return <Results />;

  return (
    <div className="flex justify-start  items-center flex-col w-full h-svh gap-y-2">
      <div className="mt-2 text-center text-xs h-3/5 w-2/3 flex flex-col items-center gap-y-2">
        <h1 className="text-xl">Questions</h1>

        <label>Question</label>
        <input
          type="text"
          className="w-full p-1 border-2 border-black rounded-md"
          onChange={({ target }) => setText(target.value)}
        />

        {answers.map((v, i) => (
          <div className="flex w-full" key={i}>
            <input
              className="w-full border-b-2 p-1 outline-0 focus:border-black"
              type="text"
              placeholder={`Answer ${i + 1}`}
              value={v}
              onChange={({ target }) =>
                setAnswers((s) => {
                  let b = [...s];
                  b[i] = target.value;
                  return b;
                })
              }
            />
            <input
              checked={correct[i]}
              onChange={() =>
                setCorrect((s) => {
                  let b = [...s];
                  b[i] = !b[i];
                  return b;
                })
              }
              className=""
              type="checkbox"
            />
          </div>
        ))}

        <button
          onClick={queueQuestion}
          className="m-auto rounded-md p-3 text-white bg-black w-2/3 hover:scale-105 transition-transform"
          disabled={sended}
        >
          {sended ? "Wait" : "Ask question"}
        </button>

        <button
          className="m-auto rounded-md p-1 text-white bg-red-700 hover:scale-105 transition-transform"
          onClick={() => setMultiState("ingame", false)}
        >
          End game
        </button>
      </div>
    </div>
  );
}
