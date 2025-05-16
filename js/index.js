import { makeActions } from "./state/actions.js";
import { ACTIONS, DRAW_TYPES, initialState } from "./state/reducer.js";
import { makeSelectors } from "./state/selectors.js";
import {
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleDragEnd,
  handleDeckDragStart,
} from "./drag-and-drop.js";
import {
  cleanUpPiles,
  createCard,
  flipCard,
  renderDeck,
  renderDiscardPile,
  renderOpponentCards,
  renderPlayersCards,
} from "./game.js";

let state = { ...initialState };

const socket = io();
const {
  showDeckTopCardAction,
  resetGameAction,
  checkWinConditionAction,
  drawCardAction,
  discardFromDeckAction,
} = makeActions(socket);

let selectors = makeSelectors(state);
let currentPlayerId;

socket.on("state_changed", ({ state: newState, action }) => {
  state = newState;
  selectors = makeSelectors(state);

  if (action?.type === "DRAW_CARD") {
    updatePlayerCards(action.payload.targetIndex);
  }

  const renderingActions = [ACTIONS.DISCARD_FROM_DECK, ACTIONS.DRAW_CARD];
  if (renderingActions.includes(action?.type)) {
    updatePiles(state);
  }
  if (action?.type === ACTIONS.SHOW_DECK_TOP_CARD) {
    const playerDiv = document.getElementById("player");
    addDragAndDropEvents(Array.from(playerDiv.children));
  }
});

function updatePiles(state) {
  cleanUpPiles();
  renderDeck(state.deck);
  addDeckDragAndDropEvent();
  renderDiscardPile({
    cards: state.discardPile,
    handleDeckDragStart,
    handleDragEnd,
    handleDragOver,
  });
}

function addDeckDragAndDropEvent() {
  const deckCards = document.querySelectorAll(".deck .content .card");
  const topCard = deckCards.item(deckCards.length - 1);
  const topCardData = selectors.topDeckCard;

  topCard.addEventListener("dragstart", handleDeckDragStart);
  topCard.addEventListener("dragover", handleDragOver);
  topCard.addEventListener("dragend", handleDragEnd);

  topCard.addEventListener("click", () => {
    showDeckTopCardAction();
    flipCard(topCard, topCardData.suit, topCardData.value);
  });
}

function updatePlayerCards(targetIndex) {
  const playerDiv = document.getElementById("player");

  playerDiv.children[targetIndex].innerHTML = createCard(
    state.playersCards[currentPlayerId][targetIndex]
  ).innerHTML;
}

function addDragAndDropEvents(cardElements) {
  cardElements.forEach((card) => {
    card.addEventListener("dragstart", handleDragStart);
    card.addEventListener("dragover", handleDragOver);
    card.addEventListener(
      "drop",
      handleDrop(currentPlayerId, selectors.topDeckCard.isFaceUp)
    );
    card.addEventListener("dragend", handleDragEnd);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  socket.on("player_in", (playerId) => {
    if (!currentPlayerId) currentPlayerId = playerId;

    let playerIdElement = document.getElementById("player-id");
    if (!playerIdElement) {
      playerIdElement = document.createElement("div");
      playerIdElement.id = "player-id";
      playerIdElement.textContent = `Your Player ID: ${playerId}`;
      document.body.appendChild(playerIdElement);
    }
  });

  socket.on("start_game", () => {
    const board = document.getElementById("board-content");
    board.classList.toggle("hidden");

    initGame();
  });

  socket.on("player_out", (playerId) => {
    const board = document.getElementById("board-content");
    board.classList.toggle("hidden");

    const opponentLeftElement = document.createElement("div");
    opponentLeftElement.textContent = `Player ${playerId} left the game`;
    document.body.appendChild(opponentLeftElement);

    resetGameAction();
    destroyGame();
  });
});

export function handleDiscardedCardDrop(targetElement, playerId) {
  if (targetElement.dataset.player === "player") {
    const targetIndex = Number(targetElement.dataset.index);
    const discardedCards = document.querySelectorAll(
      ".discarded-cards .content .card"
    );
    const topCard = discardedCards.item(discardedCards.length - 1);
    topCard.remove();

    drawCardAction({ targetIndex, isFrom: DRAW_TYPES.DISCARD_PILE, playerId });

    updatePlayerCards(targetIndex);
    addDeckDragAndDropEvent();

    checkWinConditionAction({ playerId });
  }
}

export function handleDeckCardDrop(sourceElement, targetElement, playerId) {
  if (targetElement.dataset.player === "player") {
    const targetIndex = Number(targetElement.dataset.index);

    drawCardAction({ targetIndex, playerId });

    addDeckDragAndDropEvent();

    checkWinConditionAction({ playerId });
  } else {
    discardFromDeckAction();
  }

  sourceElement.remove();
}

function initGame() {
  const opponentDiv = document.getElementById("opponent");
  const playerDiv = document.getElementById("player");
  const discardPileDiv = document.getElementById("discard-pile");

  renderOpponentCards(opponentDiv);

  const playerCardElements = renderPlayersCards(
    playerDiv,
    state.playersCards[currentPlayerId]
  );

  addDragAndDropEvents(playerCardElements);

  renderDeck(state.deck);

  addDeckDragAndDropEvent();

  discardPileDiv.addEventListener("drop", handleDrop(currentPlayerId, true));
  discardPileDiv.addEventListener("dragover", handleDragOver);
}

function destroyGame() {
  const opponentDiv = document.getElementById("opponent");
  const playerDiv = document.getElementById("player");
  const deckDiv = document.getElementById("deck-pile");
  const discardPileContentDiv = document.getElementById("discard-pile-content");

  opponentDiv.innerHTML = "";
  playerDiv.innerHTML = "";
  deckDiv.innerHTML = "";
  discardPileContentDiv.innerHTML = "";
}
