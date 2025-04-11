import { useGameDispatch } from "../context/game/GameContext";

export const useBoard = () => {
  const dispatch = useGameDispatch();

  const swapPlayerCards = ({
    fromId,
    toId,
  }: {
    fromId: string;
    toId: string;
  }) => {
    dispatch({
      type: "SWAP_PLAYER_CARDS",
      payload: {
        fromId,
        toId,
      },
    });
  };

  return {
    swapPlayerCards,
  };
};
