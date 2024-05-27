function createCard({ suit, value, isFaceUp }) {
  function createIcon(suit) {
    const icon = document.createElement("img");
    icon.src = `assets/${suit}.svg`;
    icon.width = 32;
    icon.height = 32;

    return icon;
  }

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

  return card;
}

document.addEventListener("DOMContentLoaded", function() {
  const player1Hand = document.getElementById("opponent");
  const player2Hand = document.getElementById("player");
  const deck = document.querySelector(".deck .content");

  const opponentCards = [
    { suit: "club", value: "A" },
    { suit: "diamond", value: "2" },
    { suit: "heart", value: "3" },
    { suit: "heart", value: "3" },
    { suit: "heart", value: "3" },
    { suit: "heart", value: "3" },
    { suit: "heart", value: "3" },
    { suit: "heart", value: "3" },
    { suit: "heart", value: "3" },
  ];

  const playerCards = [
    { suit: "spade", value: "K" },
    { suit: "club", value: "Q" },
    { suit: "diamond", value: "J" }
  ];

  function populatePlayerCards(playerHand, cards, isFaceUp) {
    cards.forEach(card => {
      card.isFaceUp = isFaceUp;
      const newCard = createCard(card);
      playerHand.appendChild(newCard);
    });
  }

  populatePlayerCards(deck, opponentCards, false);

  populatePlayerCards(player1Hand, opponentCards, false);

  populatePlayerCards(player2Hand, playerCards, true);

  const deckCards = document.querySelectorAll(".deck .content .card");
  
  deckCards.forEach((card, index) => {
    card.style.transform = `translate(${index * -20}px, 0)`;
  });
});

