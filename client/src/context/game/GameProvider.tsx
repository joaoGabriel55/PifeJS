import { ReactNode, useReducer } from "react";
import { GameContext, GameDispatchContext } from "./GameContext";
import { gameReducer } from "./GameReducer";
import { GameState } from "./types";
import { Source, TCard } from "../../components/card/CardDisplay";

export const addSource = (source: Source) => (card: TCard) => {
  return {
    ...card,
    source,
  };
};

export function GameProvider({
  value,
  children,
}: {
  value: { gameState: GameState };
  children: ReactNode;
}) {
  const { gameState } = value;

  const initialState: GameState = {
    hand: gameState.hand.map(addSource("PLAYER")),
    deckSize: gameState.deckSize,
    discardPile: gameState.discardPile.map(addSource("DISCARD")),
    currentPlayer: gameState.currentPlayer,
    connectedPlayerId: gameState.connectedPlayerId,
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
