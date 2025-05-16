import { ACTIONS } from "./reducer.js";

export const makeActions = (socket) => {
  return {
    shuffleDeckAction: () => 
      socket.emit("state_change", { type: ACTIONS.SHUFFLE_DECK }),
    distributeCardsAction: () =>
      socket.emit("state_change", { type: ACTIONS.DISTRIBUTE_CARDS }),
    drawCardAction: ({ targetIndex, isFrom, playerId }) => {
      socket.emit("state_change", {
        type: ACTIONS.DRAW_CARD,
        payload: {
          targetIndex,
          isFrom,
          playerId,
        },
      });
    },
    showDeckTopCardAction: () =>
      socket.emit("state_change", { type: ACTIONS.SHOW_DECK_TOP_CARD }),
    discardFromDeckAction: () =>
      socket.emit("state_change", { type: ACTIONS.DISCARD_FROM_DECK }),
    checkWinConditionAction: ({ playerId }) =>
      socket.emit("state_change", { type: ACTIONS.CHECK_WIN_CONDITION, payload: { playerId } }),
    resetGameAction: () =>
      socket.emit("state_change", { type: ACTIONS.RESET_GAME }),
  };
};
