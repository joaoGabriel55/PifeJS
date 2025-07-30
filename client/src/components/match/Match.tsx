import "./Match.css";
import { GameProvider } from "../../context/game/GameProvider";
import { Board } from "./Board";
import { useEffect, useState } from "react";
import { getSocket } from "../../lib/websocket";
import { GameState, Player } from "../../context/game/types";
import { GameOverModal } from "../GameOverModal";

type MatchProps = {
  socket: ReturnType<typeof getSocket>;
};

export function Match({ socket }: MatchProps) {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameState, setgameState] = useState<GameState>();
  const [gameOverModal, setGameOverModal] = useState<{
    open: boolean;
    winner: Player | null;
  }>({
    open: false,
    winner: null,
  });

  useEffect(() => {
    socket.connect();

    socket.on<GameState>("gameStart", (data) => {
      console.log("data", data);
      setGameStarted(true);
      setgameState(data);
    });

    socket.on("gameOver", (data: { winner: Player }) => {
      console.log("gameOver", data);
      setGameOverModal({
        open: true,
        winner: data.winner,
      });
    });

    return () => {
      socket.off("gameStart");

      // socket.disconnect();
    };
  }, []);

  if (!gameStarted || !gameState) {
    return <p>Waiting for another player</p>;
  }

  return (
    <GameProvider value={{ gameState }}>
      <Board socket={socket} />
      {(gameOverModal.open && gameOverModal.winner) && <GameOverModal winner={gameOverModal.winner} open={gameOverModal.open} />}
    </GameProvider>
  );
}
