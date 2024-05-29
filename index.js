document.addEventListener("DOMContentLoaded", function() {
  const opponentDiv = document.getElementById("opponent");
  const playerDiv = document.getElementById("player");
  
  const shuffledDeck = shuffleDeck(DECK);
  const { deck, playerCards, opponentCards } = distributeCards(shuffledDeck);

  populatePlayerCards(opponentDiv, opponentCards, false);
  const playerCardElements = populatePlayerCards(playerDiv, playerCards, true);

  let dragSrcEl = null;

  function handleDragStart(e) {
    this.style.opacity = '0.4';
    
    dragSrcEl = this;

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
  }

  function handleDragOver(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }

    e.dataTransfer.dropEffect = 'move';
    
    return false;
  }

  function handleDrop(e) {
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    
    if (dragSrcEl != this) {
      dragSrcEl.innerHTML = this.innerHTML;
      this.innerHTML = e.dataTransfer.getData('text/html');
    }
    
    return false;
  }

  function handleDragEnd(e) {
    this.style.opacity = '1';
  }

  playerCardElements.forEach((card) => {
    card.addEventListener("dragstart", handleDragStart);
    card.addEventListener("dragover", handleDragOver);
    card.addEventListener("drop", handleDrop);
    card.addEventListener("dragend", handleDragEnd);
  });

  renderRestOfCards(deck);
});
