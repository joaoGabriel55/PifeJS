import { NUMBER_OF_CARDS_PER_PLAYER } from "./constants.js";

function createIcon(suit) {
  const icon = document.createElement("img");
  icon.src = `${suit}.svg`;
  icon.width = 32;
  icon.height = 32;

  return icon;
}

export function createCard({ suit, value, isFaceUp }) {
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

export function shuffleDeck(deck) {
  let currentIndex = deck.length;

  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [deck[currentIndex], deck[randomIndex]] = [
      deck[randomIndex], deck[currentIndex]];
  }

  return deck;
}

export function distributeCards(deck) {
  const playerHand = deck.splice(0, NUMBER_OF_CARDS_PER_PLAYER);
  const opponentHand = deck.splice(0, NUMBER_OF_CARDS_PER_PLAYER);

  return {
    deck,
    playerHand,
    opponentHand
  };
}

export function renderPlayersCards(playerDiv, cards, isFaceUp) {
  return cards.map((card, index) => {
    card.isFaceUp = isFaceUp;
    const newCard = createCard(card);
    newCard.dataset.index = index;
    newCard.dataset.player = 'player';
    playerDiv.appendChild(newCard);
    return newCard;
  });
}

export function renderDeck(cards, eventNotifier) {
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
    topCard.addEventListener("click", () => {
      eventNotifier.publish({ type: "SHOW_DECK_TOP_CARD" });
      flipCard(topCard, topCardData.suit, topCardData.value);
    });
  }
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
