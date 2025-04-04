import React from "react";
import "./Card.css";

export type Suit = "HEARTS" | "DIAMONDS" | "CLUBS" | "SPADES";
export type Source = "DECK" | "PLAYER" | "DISCARD" | "OPPONENT";

export type TCard = {
  id: string;
  suit?: Suit;
  value?: string;
  isFaceDown?: boolean;
  source: Source;
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

export function CardDisplay({
  suit,
  value,
  isFaceDown = false,
  onClick,
}: TCard & { onClick?: (event: React.MouseEvent<HTMLDivElement>) => void }) {
  const isRed = suit === "HEARTS" || suit === "DIAMONDS";
  const suitSymbol = suit ? getSuitSymbol(suit) : null;

  if (isFaceDown) {
    return <div className="card face-down" onClick={onClick}></div>;
  }

  return (
    <div className="card face-up" onClick={onClick}>
      <span className={`suit ${isRed ? "red" : ""}`}>{suitSymbol}</span>
      <span className={`value ${isRed ? "red" : ""}`}>{value}</span>
      <span className={`suit ${isRed ? "red" : ""}`}>{suitSymbol}</span>
    </div>
  );
}
