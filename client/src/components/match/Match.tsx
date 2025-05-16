import { useRound } from "../../hooks/useRound";
import "./Match.css";
import { GameProvider } from "../../context/game/GameProvider";
import { Board } from "./Board";
import { useEffect, useState } from "react";
import Websocket from "../../lib/websocket";
import { MatchMeta } from "../../context/game/types";

export function Match() {
  const { round } = useRound();
  const [gameStarted, setGameStarted] = useState(false);
  const [userData, setUserData] = useState<MatchMeta>({
    userName: "",
    currentPlayer: "",
  });

  useEffect(() => {
    const socket = new Websocket();

    socket.on<MatchMeta>("gameStart", (data) => {
      setGameStarted(true);
      setUserData(data);
    });

    return () => {
      socket.off("gameStart");
      socket.disconnect();
    };
  }, []);

  if (!gameStarted) {
    return <p>Waiting for another player</p>;
  }

  return (
    <GameProvider value={{ round, userData }}>
      <Board />
    </GameProvider>
  );
}
