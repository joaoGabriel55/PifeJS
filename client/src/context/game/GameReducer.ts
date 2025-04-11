import { GameAction, GameState } from "./types";

export const gameReducer = (state: GameState, action: GameAction) => {
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

    case "DRAW_FROM_DECK": {
      const { deckCardId, playerCardId } = action.payload;
      const deck = [...state.deck];
      const playerHand = [...state.playerHand];
      const discardPile = [...state.discardPile];

      const deckIndex = deck.findIndex((c) => c.id === deckCardId);
      const playerIndex = playerHand.findIndex((c) => c.id === playerCardId);

      const [drawnCard] = deck.splice(deckIndex, 1);
      const [discardedCard] = playerHand.splice(playerIndex, 1, {
        ...drawnCard,
        isFaceDown: false,
        source: "PLAYER",
      });

      discardPile.push({ ...discardedCard, source: "DISCARD" });

      return { ...state, deck, playerHand, discardPile };
    }

    case "DRAW_FROM_DISCARD": {
      const { discardCardId, playerCardId } = action.payload;
      const discardPile = [...state.discardPile];
      const playerHand = [...state.playerHand];

      const discardIndex = discardPile.findIndex((c) => c.id === discardCardId);
      const playerIndex = playerHand.findIndex((c) => c.id === playerCardId);

      const [drawnCard] = discardPile.splice(discardIndex, 1);
      const [discardedCard] = playerHand.splice(playerIndex, 1, {
        ...drawnCard,
        source: "PLAYER",
      });

      discardPile.push({ ...discardedCard, source: "DISCARD" });

      return { ...state, playerHand, discardPile };
    }

    case "DISCARD_FROM_DECK": {
      const { deckCardId } = action.payload;
      const deck = [...state.deck];
      const discardPile = [...state.discardPile];

      const deckIndex = deck.findIndex((c) => c.id === deckCardId);
      const [discardedCard] = deck.splice(deckIndex, 1);

      discardPile.push({
        ...discardedCard,
        source: "DISCARD",
        isFaceDown: false,
      });

      return { ...state, deck, discardPile };
    }

    default:
      return state;
  }
};
