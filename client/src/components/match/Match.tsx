import "./Match.css";
import { GameProvider } from "../../context/game/GameProvider";
import { Board } from "./Board";
import { useEffect, useState } from "react";
import { socket } from "../../lib/websocket";
import { GameState } from "../../context/game/types";

export function Match() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameState, setgameState] = useState<GameState>();

  useEffect(() => {
    socket.connect();

    socket.on<GameState>("gameStart", (data) => {
      console.log("data", data);
      setGameStarted(true);
      setgameState(data);
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
      <Board />
    </GameProvider>
  );
}
