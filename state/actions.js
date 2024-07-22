import { ACTIONS } from "./reducer.js";

export const makeActions = (eventNotifier) => {
  return {
    shuffleDeckAction: () =>
      eventNotifier.publish({ type: ACTIONS.SHUFFLE_DECK }),
    distributeCardsAction: () =>
      eventNotifier.publish({ type: ACTIONS.DISTRIBUTE_CARDS }),
    drawCardAction: ({ targetIndex, isFrom }) => {
      eventNotifier.publish({
        type: ACTIONS.DRAW_CARD,
        payload: {
          targetIndex,
          isFrom,
        },
      });
    },
    showDeckTopCardAction: () =>
      eventNotifier.publish({ type: ACTIONS.SHOW_DECK_TOP_CARD }),
    discardFromDeckAction: () =>
      eventNotifier.publish({ type: ACTIONS.DISCARD_FROM_DECK }),
    checkWinConditionAction: () =>
      eventNotifier.publish({ type: ACTIONS.CHECK_WIN_CONDITION }),
  };
};
