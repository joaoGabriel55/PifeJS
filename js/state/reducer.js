import isWinner from "../calculate-winner.js";
import { DECK } from "../constants.js";
import { distributeCards, shuffleDeck } from "../game.js";

export const ACTIONS = {
  SHUFFLE_DECK: "SHUFFLE_DECK",
  DISTRIBUTE_CARDS: "DISTRIBUTE_CARDS",
  DRAW_CARD: "DRAW_CARD",
  DISCARD_FROM_DECK: "DISCARD_FROM_DECK",
  CHECK_WIN_CONDITION: "CHECK_WIN_CONDITION",
  SHOW_DECK_TOP_CARD: "SHOW_DECK_TOP_CARD",
  RESET_GAME: "RESET_GAME"
};

export const DRAW_TYPES = {
  DECK: "deck",
  DISCARD_PILE: "discardPile"
};

export const initialState = {
  deck: DECK,
  playersCards: {},
  discardPile: [],
  hasWon: false,
};

function reducer({ state: originalState, action }) {
  console.log("reducer", action);
  const state = structuredClone(originalState);

  switch (action.type) {
    case ACTIONS.SHUFFLE_DECK:
      return { ...state, deck: shuffleDeck(state.deck) };
    case ACTIONS.DISTRIBUTE_CARDS: {
      const [player1, player2] = action.payload;
      const { deck, playerHand, opponentHand } = distributeCards(state.deck);

      return { ...state, deck, playersCards: { [player1]: playerHand, [player2]: opponentHand } };
    }
    case ACTIONS.DRAW_CARD: {
      const { targetIndex, isFrom = DRAW_TYPES.DECK, playerId } = action.payload;
      const discardedCard = state.playersCards[playerId][targetIndex];

      
      if (isFrom === DRAW_TYPES.DECK) {
        state.playersCards[playerId][targetIndex] = state.deck.pop();
      } else if (isFrom === DRAW_TYPES.DISCARD_PILE) {
        state.playersCards[playerId][targetIndex] = state.discardPile.pop();
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
      const { playerId } = action.payload;
      return { ...state, hasWon: isWinner(state.playersCards[playerId]) };
    }
    case ACTIONS.SHOW_DECK_TOP_CARD: {
      const topCard = state.deck[state.deck.length - 1];
      state.deck[state.deck.length - 1] = { ...topCard, isFaceUp: true };

      return state;
    }
    case ACTIONS.RESET_GAME: {
      return initialState;
    }
    default:
      return state;
  }
}

export default reducer;
