import { initialState } from "./reducer.js";

export const makeSelectors = (state = initialState) => {
  return {
    topDeckCard: state.deck[state.deck.length - 1],
    topDiscardPileCard: state.discardPile[state.discardPile.length - 1],
  };
};
