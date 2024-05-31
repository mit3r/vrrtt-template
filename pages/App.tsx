import { useContext } from "react";

import { MultiplayerContext } from "../utils/MultiplayerContext";

export default function App() {
  const { count, set } = useContext(MultiplayerContext);

  // const [count, setCount] = useMultiplayerState("count", 0);

  const increment = () => {
    set("count", count + 1);
    // set("test", (parseInt(test) + 1).toString());
  };

  const decrement = () => {
    // console.log(count - 1);
    // set("count", 0);
    set("count", count - 1);
    // set("test", (parseInt(test) - 1).toString());
  };

  return (
    <div className="flex items-center flex-col w-full">
      <div className="text-center">Counter {count}</div>

      <button
        className="max-w-fit px-2 border-2 border-black"
        onClick={increment}
      >
        Increment
      </button>

      <button
        className="max-w-fit px-2 border-2 border-black"
        onClick={decrement}
      >
        Decrement
      </button>

      {/* {test} */}
    </div>
  );
}
