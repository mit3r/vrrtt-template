import { usePlayersList, usePlayersState } from "playroomkit";

export default function Results() {
  const players = usePlayersList(true);
  const scores = usePlayersState("score");

  return (
    <>
      <div className="flex justify-center mt-5">
        <div className="w-3/5">
          {scores
            .filter((v) => v.state !== undefined)
            .sort((a, b) => a.state - b.state)
            .map(({ player, state }, i) => (
              <div className="my-2 flex justify-between border-2 rounded-md border-black">
                <div className="px-2 bg-black text-white">{i + 1}</div>
                <div className=" px-2 text-white bg-black w-full">
                  {player.getProfile().name}
                </div>
                <div className="px-2">{state}</div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
