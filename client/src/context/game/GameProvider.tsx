import { ReactNode, useReducer } from "react";
import { TRound } from "../../hooks/useRound";
import { GameContext, GameDispatchContext } from "./GameContext";
import { gameReducer } from "./GameReducer";
import { GameState } from "./types";

export function GameProvider({
  round,
  children,
}: {
  round: TRound;
  children: ReactNode;
}) {
  const initialState: GameState = {
    playerHand: round.hands[0].hand,
    deck: round.deck,
    discardPile: round.discardPile,
    opponentHand: round.hands[1].hand,
  };

  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={state}>
      <GameDispatchContext.Provider value={dispatch}>
        {children}
      </GameDispatchContext.Provider>
    </GameContext.Provider>
  );
}
