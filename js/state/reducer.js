import isWinner from "../calculate-winner.js";
import { DECK } from "../constants.js";
import { distributeCards, shuffleDeck } from "../game.js";

export const ACTIONS = {
  SHUFFLE_DECK: "SHUFFLE_DECK",
  DISTRIBUTE_CARDS: "DISTRIBUTE_CARDS",
  DRAW_CARD: "DRAW_CARD",
  DISCARD_FROM_DECK: "DISCARD_FROM_DECK",
  CHECK_WIN_CONDITION: "CHECK_WIN_CONDITION",
  SHOW_DECK_TOP_CARD: "SHOW_DECK_TOP_CARD"
};

export const DRAW_TYPES = {
  DECK: "deck",
  DISCARD_PILE: "discardPile"
};

export const initialState = {
  deck: DECK,
  playerHand: [],
  opponentHand: [],
  discardPile: [],
  hasWon: false,
};

function reducer({ state: initialState, action }) {
  const state = structuredClone(initialState);

  switch (action.type) {
    case ACTIONS.SHUFFLE_DECK:
      return { ...state, deck: shuffleDeck(state.deck) };
    case ACTIONS.DISTRIBUTE_CARDS: {
      const { deck, playerHand, opponentHand } = distributeCards(state.deck);

      return { ...state, deck, playerHand, opponentHand };
    }
    case ACTIONS.DRAW_CARD: {
      const { targetIndex, isFrom = DRAW_TYPES.DECK } = action.payload;
      const discardedCard = state.playerHand[targetIndex];

      
      if (isFrom === DRAW_TYPES.DECK) {
        state.playerHand[targetIndex] = state.deck.pop();
      } else if (isFrom === DRAW_TYPES.DISCARD_PILE) {
        state.playerHand[targetIndex] = state.discardPile.pop();
      }

      state.discardPile.push(discardedCard);

      return state;
    }
    case ACTIONS.DISCARD_FROM_DECK: {
      const discardedCard = state.deck.pop();

      state.discardPile.push(discardedCard);

      return state;
    }
    case ACTIONS.CHECK_WIN_CONDITION: {
      return { ...state, hasWon: isWinner(state.playerHand) };
    }
    case ACTIONS.SHOW_DECK_TOP_CARD: {
      const topCard = state.deck[state.deck.length - 1];
      state.deck[state.deck.length - 1] = { ...topCard, isFaceUp: true };

      return state;
    }
    default:
      return state;
  }
}

export default reducer;
