import { useNavigate } from "react-router";
import { useGameState } from "../context/game/GameContext";
import { Player } from "../context/game/types";
import { useEffect, useRef } from "react";

type GameOverModalProps = {
  winner: Player;
  open: boolean;
};

export function GameOverModal({ winner, open }: GameOverModalProps) {
  const state = useGameState();
  const navigate = useNavigate();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (ref.current && open) {
      ref.current.showModal();
    } else if (ref.current) {
      ref.current.close();
    }
  }, [open]);

  const isCurrentPlayerWinner = state.connectedPlayer.id === winner.id;

  const handleClose = () => {
    navigate("/rooms");
  };

  return (
    <dialog ref={ref}>
      <h2>Game Over</h2>
      {isCurrentPlayerWinner ? (
        <p>Congratulations {state.connectedPlayer.name}, you are the winner!</p>
      ) : (
        <p>Sorry {state.connectedPlayer.name}, you lost. The winner is {winner.name}.</p>
      )}

      <button onClick={handleClose}>OK</button>
    </dialog>
  );
}