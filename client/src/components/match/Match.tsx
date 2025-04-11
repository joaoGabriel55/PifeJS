import { useRound } from "../../hooks/useRound";
import "./Match.css";
import { GameProvider } from "../../context/game/GameProvider";
import { Board } from "./Board";

export function Match() {
  const { round } = useRound();

  return (
    <GameProvider round={round}>
      <Board />
    </GameProvider>
  );
}
