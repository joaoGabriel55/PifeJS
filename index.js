document.addEventListener("DOMContentLoaded", function () {
  const opponentDiv = document.getElementById("opponent");
  const playerDiv = document.getElementById("player");
  const deckDiv = document.getElementById("deck-pile");
  const discardPileDiv = document.getElementById("discard-pile");

  const shuffledDeck = shuffleDeck(DECK);
  const { deck, playerCards, opponentCards } = distributeCards(shuffledDeck);

  populatePlayerCards(opponentDiv, opponentCards, false);
  const playerCardElements = populatePlayerCards(playerDiv, playerCards, true);

  let dragSrcEl = null;

  function handleDragStart(srcElement) {
    return function(e) {
      this.style.opacity = "0.4";

      srcElement = this;

      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/html", this.innerHTML);
      e.dataTransfer.setData("text/plain", this.dataset.index);
    }
  }

  function handleDragOver(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }

    e.dataTransfer.dropEffect = "move";

    return false;
  }

  function handleDrop(e) {
    if (e.stopPropagation) {
      e.stopPropagation();
    }

    if (!dragSrcEl) {
      return;
    }

    const srcIndex = dragSrcEl.dataset.index;

    if (dragSrcEl.parentNode === deckDiv) {
      const drawnCard = deck.pop();
      if (this.dataset.player === "player") {
        const targetIndex = Number(this.dataset.index);

        const { cardContent, discardedCard } = drawCard({ targetIndex, cards: playerCards, drawnCard });

        playerDiv.children[targetIndex].innerHTML = cardContent;
        discardPileDiv.appendChild(createCard(discardedCard));
      } else if (this.classList.contains("discarded-cards")) {
        // discardPileDiv.appendChild(createCard(drawnCard));
      }
      dragSrcEl.remove();
    } else if (dragSrcEl != this) {
      swapPlayerCards({ cards: playerCards, sourceIndex: srcIndex, targetIndex: this.dataset.index });

      dragSrcEl.innerHTML = this.innerHTML;
      this.innerHTML = e.dataTransfer.getData("text/html");
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

  function handleDeckDragEnd(e) {
    this.style.opacity = "1";
    dragSrcEl = null;
  }

  playerCardElements.forEach((card) => {
    card.addEventListener("dragstart", handleDragStart);
    card.addEventListener("dragover", handleDragOver);
    card.addEventListener("drop", handleDrop);
    card.addEventListener("dragend", handleDragEnd);
  });

  renderRestOfCards(deck);
});
