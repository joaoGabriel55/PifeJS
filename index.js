document.addEventListener("DOMContentLoaded", initGame);

function initGame() {
  const opponentDiv = document.getElementById("opponent");
  const playerDiv = document.getElementById("player");
  const deckDiv = document.getElementById("deck-pile");
  const discardPileDiv = document.getElementById("discard-pile");

  const shuffledDeck = shuffleDeck(DECK);
  const { deck, playerCards, opponentCards } = distributeCards(shuffledDeck);

  populatePlayerCards(opponentDiv, opponentCards, false);
  const playerCardElements = populatePlayerCards(playerDiv, playerCards, true);

  addDragAndDropEvents(playerCardElements);

  renderRestOfCards(deck);

  addDeckDragAndDropEvent();

  eventBus.addEventListener('test-event', ({ detail}) => {
    addDeckDragAndDropEvent();
  });

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

    if (dragSrcEl.parentNode === deckDiv) {
      handleDeckCardDrop(dragSrcEl, this);
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
    const drawnCard = deck.pop();

    if (targetElement.dataset.player === "player") {
      const targetIndex = Number(targetElement.dataset.index);
      const { cardContent, discardedCard } = drawCard({ targetIndex, cards: playerCards, drawnCard });

      drawCard(targetIndex, cardContent, discardedCard);
    }

    sourceElement.remove();
  }

  function drawCard(targetIndex, cardContent, discardedCard) {
    const playerDiv = document.getElementById("player");
    const discardPileDiv = document.getElementById("discard-pile");
    const deckCards = document.querySelectorAll(".deck .content .card");
    const topCard = deckCards.item(deckCards.length - 1);

    playerDiv.children[targetIndex].innerHTML = cardContent;
    discardPileDiv.appendChild(createCard(discardedCard));

    topCard.remove();

    eventBus.dispatchEvent(new CustomEvent('test-event', { detail: 'data' }));
  }

  function handlePlayerCardSwap(sourceElement, targetElement, content) {
    const sourceIndex = sourceElement.dataset.index;
    const targetIndex = targetElement.dataset.index;

    swapPlayerCards({ cards: playerCards, sourceIndex, targetIndex });

    sourceElement.innerHTML = targetElement.innerHTML;
    targetElement.innerHTML = content;
  }

  function addDeckDragAndDropEvent() {
    const deckCards = document.querySelectorAll(".deck .content .card");
    const topCard = deckCards.item(deckCards.length - 1);
    const topCardData = deck[deck.length - 1];

    topCard.addEventListener("dragstart", handleDeckDragStart);
    topCard.addEventListener("dragover", handleDragOver);
    topCard.addEventListener("dragend", handleDragEnd);

    topCard.addEventListener("click", () => flipCard(topCard, topCardData.suit, topCardData.value));
  }
}
