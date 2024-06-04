function createIcon(suit) {
  const icon = document.createElement("img");
  icon.src = `assets/${suit}.svg`;
  icon.width = 32;
  icon.height = 32;

  return icon;
}

function createCard({ suit, value, isFaceUp }) {
  const card = document.createElement("div");
  card.className = `card ${isFaceUp ? 'face-up' : 'face-down'}`;

  if (isFaceUp) {
    const cardValue = document.createElement("h1");
    cardValue.innerText = value;

    if (["heart", "diamond"].includes(suit)) {
      cardValue.style.color = "var(--red-color)";
    }

    card.append(createIcon(suit), cardValue, createIcon(suit));
  }

  card.setAttribute("draggable", true);

  return card;
}

function shuffleDeck(deck) {
  const deckCopy = [...deck];
  let currentIndex = deckCopy.length;

  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [deckCopy[currentIndex], deckCopy[randomIndex]] = [
      deckCopy[randomIndex], deckCopy[currentIndex]];
  }

  return deckCopy;
}

function distributeCards(deck) {
  const deckCopy = [...deck];
  const playerCards = deckCopy.splice(0, NUMBER_OF_CARDS_PER_PLAYER);
  const opponentCards = deckCopy.splice(0, NUMBER_OF_CARDS_PER_PLAYER);

  return {
    deck: deckCopy,
    playerCards,
    opponentCards
  };
}

function drawCard({ targetIndex, cards, drawnCard }) {
  const discardedCard = cards[targetIndex];

  cards[targetIndex] = drawnCard;
  const { value, suit } = drawnCard;

  return {
    cardContent: createCard({ value, suit, isFaceUp: true }).innerHTML,
    discardedCard 
  };
}

function discardCard() {}

function populatePlayerCards(playerHand, cards, isFaceUp) {
  return cards.map((card, index) => {
    card.isFaceUp = isFaceUp;
    const newCard = createCard(card);
    newCard.dataset.index = index;
    newCard.dataset.player = 'player';
    playerHand.appendChild(newCard);
    return newCard;
  });
}

function renderRestOfCards(cards) {
  const deckDiv = document.querySelector(".deck .content");

  cards.forEach(card => {
    card.isFaceUp = false;
    const newCard = createCard(card);
    deckDiv.appendChild(newCard);
  });

  const deckCards = document.querySelectorAll(".deck .content .card");

  deckCards.forEach((card, index) => {
    card.style.transform = `translate(${index * -5}px, 0)`;
  });

  if (deckCards.length > 0) {
    const topCard = deckCards[deckCards.length - 1];
    const topCardData = cards[cards.length - 1];
    topCard.addEventListener("click", () => flipCard(topCard, topCardData.suit, topCardData.value));
  }
}

function flipCard(card, suit, value) {
  if (card.classList.contains("face-down")) {
    card.classList.remove("face-down");
    card.classList.add("face-up");

    const cardValue = document.createElement("h1");
    cardValue.innerText = value;
    cardValue.style.color = "black";

    if (["heart", "diamond"].includes(suit)) {
      cardValue.style.color = "var(--red-color)";
    }

    card.innerHTML = "";
    card.append(createIcon(suit), cardValue, createIcon(suit));

    card.addEventListener("dragstart", handleDeckDragStart);
    card.addEventListener("dragover", handleDragOver);
    card.addEventListener("dragend", handleDeckDragEnd);  
  }
}

function swapPlayerCards({ cards, sourceIndex, targetIndex }) {
  const sourceCard = cards[sourceIndex];
  const targetCard = cards[targetIndex];

  cards[sourceIndex] = targetCard;
  cards[targetIndex] = sourceCard;
}

function updateRestOfCardsTop(cards) {
  const deckCards = document.querySelectorAll(".deck .content .card");

  if (deckCards.length > 0) {
    const topCard = deckCards[deckCards.length - 1];
    const topCardData = cards[cards.length - 1];
    topCard.addEventListener("click", () => flipCard(topCard, topCardData.suit, topCardData.value));
  }
}
