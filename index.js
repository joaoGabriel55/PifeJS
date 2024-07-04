document.addEventListener("DOMContentLoaded", initGame);

function initGame() {
  const opponentDiv = document.getElementById("opponent");
  const playerDiv = document.getElementById("player");
  const deckDiv = document.getElementById("deck-pile");
  const discardPileDiv = document.getElementById("discard-pile");
  const discardedPileContentDiv = document.getElementById("discarded-pile");
  const discardedCards = [];

  const shuffledDeck = shuffleDeck(DECK);
  const { deck, playerCards, opponentCards } = distributeCards(shuffledDeck);

  populatePlayerCards(opponentDiv, opponentCards, false);
  const playerCardElements = populatePlayerCards(playerDiv, playerCards, true);

  addDragAndDropEvents(playerCardElements);

  renderRestOfCards(deck);

  addDeckDragAndDropEvent();

  discardPileDiv.addEventListener("drop", handleDrop);
  discardPileDiv.addEventListener("dragover", handleDragOver);

  eventBus.addEventListener("update-player-cards-event", () => {
    addDeckDragAndDropEvent();
  });

  eventBus.addEventListener("player-move-event", () => {
    if (isValidSet(playerCards)) {
      alert("you won");
    }
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
    if (!deck[deck.length - 1].isFaceUp && dragSrcEl.parentNode === deckDiv) return;

    if (dragSrcEl.parentNode === deckDiv) {
      handleDeckCardDrop(dragSrcEl, this);
    } else if (dragSrcEl.parentNode === discardedPileContentDiv) { // last card
      console.log('comprar do descarte');
      handleDiscardedCardDrop(dragSrcEl, this);
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
      const drawnCard = deck.pop();

      const targetIndex = Number(targetElement.dataset.index);
      const { cardContent, discardedCard } = drawCard({
        targetIndex,
        cards: playerCards,
        drawnCard,
      });

      updatePlayerAndDiscardPiles(targetIndex, cardContent, discardedCard);
      eventBus.dispatchEvent(new CustomEvent("player-move-event"));
    } else {
      discardCard();
    }

    sourceElement.remove();
  }

  function updatePlayerAndDiscardPiles(
    targetIndex,
    cardContent,
    discardedCard
  ) {
    const playerDiv = document.getElementById("player");
    const deckCards = document.querySelectorAll(".deck .content .card");
    const topCard = deckCards.item(deckCards.length - 1);
    const discardedPileContent = document.querySelector(
      ".discarded-cards .content"
    );

    const lastDiscardedCard = createCard({ ...discardedCard, isFaceUp: true })

    playerDiv.children[targetIndex].innerHTML = cardContent;
    discardedPileContent.appendChild(
      lastDiscardedCard
    );

    lastDiscardedCard.addEventListener("dragstart", handleDeckDragStart);
    lastDiscardedCard.addEventListener("dragover", handleDragOver);
    lastDiscardedCard.addEventListener("dragend", handleDragEnd);

    const cards = document.querySelectorAll(".discarded-cards .content .card");

    cards.forEach((card, index) => {
      card.style.transform = `translate(${index * -5}px, 0)`;
    });

    topCard.remove();

    setDiscardedCards(discardedCard);

    eventBus.dispatchEvent(new CustomEvent("update-player-cards-event"));
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

    topCard.addEventListener("click", () => {
      deck[deck.length - 1].isFaceUp = true;
      flipCard(topCard, topCardData.suit, topCardData.value);
    });
  }

  function discardCard() {
    const discardedPileContent = document.querySelector(
      ".discarded-cards .content"
    );
    const deckCards = document.querySelectorAll(".deck .content .card");
    const topCard = deckCards.item(deckCards.length - 1);
    const topCardData = deck.pop();
    setDiscardedCards(topCardData);

    const lastDiscardedCard = createCard({ ...topCardData, isFaceUp: true });

    // TODO refactor (repeated in addDeckDragAndDropEvent)
    lastDiscardedCard.addEventListener("dragstart", handleDeckDragStart);
    lastDiscardedCard.addEventListener("dragover", handleDragOver);
    lastDiscardedCard.addEventListener("dragend", handleDragEnd);

    discardedPileContent.appendChild(
      lastDiscardedCard
    );
    topCard.remove();


    eventBus.dispatchEvent(new CustomEvent("update-player-cards-event"));

    const cards = document.querySelectorAll(".discarded-cards .content .card");

    cards.forEach((card, index) => {
      card.style.transform = `translate(${index * -5}px, 0)`;
    });
  }

  function setDiscardedCards(card) {
    discardedCards.push(card);
    console.log(discardedCards);
  }

  function handleDiscardedCardDrop(srcElement, targetElement) {
    if (targetElement.dataset.player === "player") {
      const drawnCard = discardedCards.pop();

      const targetIndex = Number(targetElement.dataset.index);
      const { cardContent, discardedCard } = drawCard({
        targetIndex,
        cards: playerCards,
        drawnCard,
      });

      updatePlayerAndDiscardPiles(targetIndex, cardContent, discardedCard);
    }
  }
}
