function createCard({ suit, value }) {
  function createIcon(suit) {
    const icon = document.createElement("img");
    icon.src = `assets/${suit}.svg`;
    icon.width = 32;
    icon.height = 32;

    return icon;
  }

  const card = document.createElement("div");
  card.className = "card";

  const cardValue = document.createElement("h1");
  cardValue.innerText = value;

  if (["heart", "diamond"].includes(suit)) {
    cardValue.style.color = "var(--red-color)";
  }

  card.append(createIcon(suit), cardValue, createIcon(suit));

  return card;
}

document.addEventListener("DOMContentLoaded", () => {
  const board = document.querySelector(".board");

  board.appendChild(createCard({ suit: 'spade', value: '1' }));
  board.appendChild(createCard({ suit: 'diamond', value: 'K' }));
});
