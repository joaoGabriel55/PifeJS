import {
  createCard,
  flipCard,
  renderDeck,
  renderPlayersCards,
} from "./game.js";
import PubSub from "./pubsub.js";
import { makeActions } from "../state/actions.js";
import reducer, { DRAW_TYPES, initialState } from "../state/reducer.js";
import { makeSelectors } from "../state/selectors.js";

document.addEventListener("DOMContentLoaded", initGame);

function initGame() {
  const eventNotifier = new PubSub();

  let state = { ...initialState };

  const {
    shuffleDeckAction,
    distributeCardsAction,
    drawCardAction,
    showDeckTopCardAction,
    discardFromDeckAction,
    checkWinConditionAction
  } = makeActions(eventNotifier);

  let selectors = makeSelectors(state);

  eventNotifier.subscribe((payload) => {
    console.log(payload);
    state = reducer({ state, action: { ...payload } });
    selectors = makeSelectors(state);
  });

  shuffleDeckAction();
  distributeCardsAction();

  const opponentDiv = document.getElementById("opponent");
  const playerDiv = document.getElementById("player");
  const deckDiv = document.getElementById("deck-pile");
  const discardPileDiv = document.getElementById("discard-pile");
  const discardPileContentDiv = document.getElementById("discard-pile-content");

  renderPlayersCards(opponentDiv, state.opponentHand, false);
  const playerCardElements = renderPlayersCards(
    playerDiv,
    state.playerHand,
    true
  );

  addDragAndDropEvents(playerCardElements);

  renderDeck(state.deck, eventNotifier);

  addDeckDragAndDropEvent();

  discardPileDiv.addEventListener("drop", handleDrop);
  discardPileDiv.addEventListener("dragover", handleDragOver);

  let dragSrcEl = null;

  function addDragAndDropEvents(cardElements) {
    cardElements.forEach((card) => {
      card.addEventListener("dragstart", handleDragStart);
      card.addEventListener("dragover", handleDragOver);
      card.addEventListener("drop", handleDrop);
      card.addEventListener("dragend", handleDragEnd);
    });
  }

  function handleDragStart(e) {
    this.style.opacity = "0.4";

    dragSrcEl = this;

    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", this.innerHTML);
    e.dataTransfer.setData("text/plain", this.dataset.index);
  }

  function handleDragOver(e) {
    if (e.preventDefault) e.preventDefault();

    e.dataTransfer.dropEffect = "move";

    return false;
  }

  function handleDrop(e) {
    if (e.stopPropagation) e.stopPropagation();
    if (!dragSrcEl) return;
    if (
      !selectors.topDeckCard.isFaceUp &&
      dragSrcEl.parentNode === deckDiv
    )
      return;

    if (dragSrcEl.parentNode === deckDiv) {
      handleDeckCardDrop(dragSrcEl, this);
    } else if (dragSrcEl.parentNode === discardPileContentDiv) {
      handleDiscardedCardDrop(this);
    } else if (dragSrcEl != this) {
      const content = e.dataTransfer.getData("text/html");
      handlePlayerCardSwap(dragSrcEl, this, content);
    }

    return false;
  }

  function handleDragEnd(e) {
    this.style.opacity = "1";
    dragSrcEl = null;
  }

  function handleDeckDragStart(e) {
    this.style.opacity = "0.4";

    dragSrcEl = this;

    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", this.innerHTML);
  }

  function handleDeckCardDrop(sourceElement, targetElement) {
    if (targetElement.dataset.player === "player") {
      const targetIndex = Number(targetElement.dataset.index);

      drawCardAction({ targetIndex });

      updatePlayerAndDiscardPiles(targetIndex);

      addDeckDragAndDropEvent();

      checkWinConditionAction();
    } else {
      discardCard();
    }

    sourceElement.remove();
  }

  function updatePlayerAndDiscardPiles(targetIndex) {
    const playerDiv = document.getElementById("player");
    const deckCards = document.querySelectorAll(".deck .content .card");
    const topCard = deckCards.item(deckCards.length - 1);
    const discardedPileContent = document.querySelector(
      ".discarded-cards .content"
    );
    const discardedCard = selectors.topDiscardPileCard;

    const lastDiscardedCard = createCard({ ...discardedCard, isFaceUp: true });

    playerDiv.children[targetIndex].innerHTML = createCard(
      state.playerHand[targetIndex]
    ).innerHTML;
    discardedPileContent.appendChild(lastDiscardedCard);

    lastDiscardedCard.addEventListener("dragstart", handleDeckDragStart);
    lastDiscardedCard.addEventListener("dragover", handleDragOver);
    lastDiscardedCard.addEventListener("dragend", handleDragEnd);

    const cards = document.querySelectorAll(".discarded-cards .content .card");

    cards.forEach((card, index) => {
      card.style.transform = `translate(${index * -5}px, 0)`;
    });

    topCard.remove();
  }

  function handlePlayerCardSwap(sourceElement, targetElement, content) {
    sourceElement.innerHTML = targetElement.innerHTML;
    targetElement.innerHTML = content;
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

  function discardCard() {
    const discardedPileContent = document.querySelector(
      ".discarded-cards .content"
    );
    const deckCards = document.querySelectorAll(".deck .content .card");
    const topCard = deckCards.item(deckCards.length - 1);
    const topCardData = selectors.topDeckCard;
    discardFromDeckAction();

    const lastDiscardedCard = createCard({ ...topCardData, isFaceUp: true });

    // TODO refactor (repeated in addDeckDragAndDropEvent)
    lastDiscardedCard.addEventListener("dragstart", handleDeckDragStart);
    lastDiscardedCard.addEventListener("dragover", handleDragOver);
    lastDiscardedCard.addEventListener("dragend", handleDragEnd);

    discardedPileContent.appendChild(lastDiscardedCard);

    topCard.remove();

    const cards = document.querySelectorAll(".discarded-cards .content .card");

    cards.forEach((card, index) => {
      card.style.transform = `translate(${index * -5}px, 0)`;
    });

    addDeckDragAndDropEvent();
  }

  function handleDiscardedCardDrop(targetElement) {
    if (targetElement.dataset.player === "player") {
      const targetIndex = Number(targetElement.dataset.index);
      const discardedCards = document.querySelectorAll(
        ".discarded-cards .content .card"
      );
      const topCard = discardedCards.item(discardedCards.length - 1);
      topCard.remove();

      drawCardAction({ targetIndex, isFrom: DRAW_TYPES.DISCARD_PILE });

      updatePlayerAndDiscardPiles(targetIndex);
      addDeckDragAndDropEvent();

      checkWinConditionAction();
    }
  }
}
