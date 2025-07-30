import { addSource } from "./GameProvider";
import { GameAction, GameState } from "./types";

export const gameReducer = (
  state: GameState,
  action: GameAction
): GameState => {
  switch (action.type) {
    case "SWAP_PLAYER_CARDS": {
      const { fromId, toId } = action.payload;
      const oldIndex = state.hand.findIndex((c) => c.id === fromId);
      const newIndex = state.hand.findIndex((c) => c.id === toId);
      const newHand = [...state.hand];
      const [movedCard] = newHand.splice(oldIndex, 1);
      newHand.splice(newIndex, 0, movedCard);
      return { ...state, hand: newHand };
    }

    case "UPDATE_GAME_STATE":
      return {
        ...state,
        ...action.payload,
        hand: action.payload.hand.map(addSource("PLAYER")),
        discardPile: action.payload.discardPile.map(addSource("DISCARD")),
      };

    default:
      return state;
  }
};
