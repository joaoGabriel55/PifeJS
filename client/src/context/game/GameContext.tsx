import { createContext, Dispatch, useContext } from "react";
import { GameAction, GameState } from "./types";

export const GameContext = createContext<GameState | null>(null);
export const GameDispatchContext = createContext<Dispatch<GameAction> | null>(
  null
);

export const useGameState = () => {
  const context = useContext(GameContext);
  if (!context)
    throw new Error("useGameState must be used within GameProvider");
  return context;
};

export const useGameDispatch = () => {
  const context = useContext(GameDispatchContext);
  if (!context)
    throw new Error("useGameDispatch must be used within GameProvider");
  return context;
};
