import { NUMBER_OF_CARDS_PER_PLAYER } from "./constants.js";

function createIcon(suit) {
  const icon = document.createElement("img");
  icon.src = `${suit}.svg`;
  icon.width = 32;
  icon.height = 32;

  return icon;
}

export function createCard({ suit, value, isDraggable = true }) {
  const card = document.createElement("div");
  card.className = "card face-up";

  const cardValue = document.createElement("h1");
  cardValue.innerText = value;

  if (["heart", "diamond"].includes(suit)) {
    cardValue.style.color = "var(--red-color)";
  }

  card.append(createIcon(suit), cardValue, createIcon(suit));

  if (isDraggable) card.setAttribute("draggable", true);

  return card;
}

export function shuffleDeck(deck) {
  let currentIndex = deck.length;

  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [deck[currentIndex], deck[randomIndex]] = [
      deck[randomIndex],
      deck[currentIndex],
    ];
  }

  return deck;
}

export function distributeCards(deck) {
  const playerHand = deck.splice(0, NUMBER_OF_CARDS_PER_PLAYER);
  const opponentHand = deck.splice(0, NUMBER_OF_CARDS_PER_PLAYER);

  return {
    deck,
    playerHand,
    opponentHand,
  };
}

export function renderPlayersCards(playerDiv, cards) {
  return cards.map((card, index) => {
    const newCard = createCard(card);
    newCard.dataset.index = index;
    newCard.dataset.player = "player";
    playerDiv.appendChild(newCard);
    return newCard;
  });
}

export function renderOpponentCards(opponentDiv) {
  Array.from({ length: 9 }).forEach(() => {
    const card = document.createElement("div");
    card.className = "card face-down";

    opponentDiv.appendChild(card);
  });
}

export function cleanUpPiles() {
  document.getElementById("deck-pile").innerHTML = null;
  const discardPile = document.getElementById("discard-pile-content");
  if (discardPile) {
    // discardPile.innerHTML = null;
    discardPile.replaceChildren([]);
  }
}

export function renderDeck(cards) {
  const deckDiv = document.querySelector(".deck .content");

  cards.forEach((card) => {
    card.isFaceUp = false;
    const newCard = document.createElement("div");
    newCard.className = "card face-down";
    deckDiv.appendChild(newCard);
  });

  const deckCards = document.querySelectorAll(".deck .content .card");

  deckCards.forEach((card, index) => {
    card.style.transform = `translate(${index * -5}px, 0)`;
  });

  if (deckCards.length > 0) {
    const topCard = deckCards[deckCards.length - 1];
    const topCardData = cards[cards.length - 1];
    topCard.draggable = true;
    topCard.addEventListener("click", () => {
      flipCard(topCard, topCardData.suit, topCardData.value);
    });
  }
}

export function renderDiscardPile({
  cards,
  handleDeckDragStart,
  handleDragOver,
  handleDragEnd,
}) {
  const discardPileDiv = document.getElementById("discard-pile-content");

  const createdCards = cards.map((card) => {
    const newCard = createCard({
      value: card.value,
      suit: card.suit,
      isDraggable: false,
    });
    discardPileDiv.appendChild(newCard);
    return newCard;
  });

  const lastDiscardedCard = createdCards[createdCards.length - 1];

  lastDiscardedCard.draggable = true;
  lastDiscardedCard.addEventListener("dragstart", handleDeckDragStart);
  lastDiscardedCard.addEventListener("dragover", handleDragOver);
  lastDiscardedCard.addEventListener("dragend", handleDragEnd);

  const discardedCards = document.querySelectorAll(
    ".discarded-cards .content .card"
  );

  discardedCards.forEach((card, index) => {
    card.style.transform = `translate(${index * -5}px, 0)`;
  });
}

export function flipCard(card, suit, value) {
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
  }
}

export function handlePlayerCardSwap(sourceElement, targetElement, content) {
  sourceElement.innerHTML = targetElement.innerHTML;
  targetElement.innerHTML = content;
}
