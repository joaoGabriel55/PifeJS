import "./Card.css";

type Suit = "HEARTS" | "DIAMONDS" | "CLUBS" | "SPADES";

export type TCard = {
  id: string;
  suit?: Suit;
  value?: string;
  isFaceDown?: boolean;
};

const getSuitSymbol = (suit: Suit) => {
  const symbols = {
    HEARTS: "♥",
    DIAMONDS: "♦",
    CLUBS: "♣",
    SPADES: "♠",
  };

  return symbols[suit];
};

export function CardDisplay({ suit, value, isFaceDown = false }: TCard) {
  const isRed = suit === "HEARTS" || suit === "DIAMONDS";
  const suitSymbol = suit ? getSuitSymbol(suit) : null;

  if (isFaceDown) {
    return <div className="card face-down"></div>;
  }

  return (
    <div className="card face-up">
      <span className={`suit ${isRed ? "red" : ""}`}>{suitSymbol}</span>
      <span className={`value ${isRed ? "red" : ""}`}>{value}</span>
      <span className={`suit ${isRed ? "red" : ""}`}>{suitSymbol}</span>
    </div>
  );
}
