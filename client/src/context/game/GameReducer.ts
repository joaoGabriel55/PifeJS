import { GameAction, GameState } from "./types";

export const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case "SWAP_PLAYER_CARDS": {
      const { fromId, toId } = action.payload;
      const oldIndex = state.playerHand.findIndex((c) => c.id === fromId);
      const newIndex = state.playerHand.findIndex((c) => c.id === toId);
      const newHand = [...state.playerHand];
      const [movedCard] = newHand.splice(oldIndex, 1);
      newHand.splice(newIndex, 0, movedCard);
      return { ...state, playerHand: newHand };
    }

    default:
      return state;
  }
};
