import { useState } from "react";
import { Card } from "./Card";
import { TCard } from "./CardDisplay";
import "./Deck.css";

type DeckProps = {
  cards: TCard[];
};

export function Deck({ cards }: DeckProps) {
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);
  return (
    <div className="deck-wrapper">
      {cards.map((card, index) => {
        const isTopCard = index === cards.length - 1;
        const isFlipped = flippedCardId === card.id;
        const isDraggable = isTopCard && isFlipped;

        return (
          <div
            key={card.id}
            className={`deck-card-wrapper ${isTopCard ? "top-card" : ""}`}
            style={{ transform: `translate(${index * -5}px, 0)` }}
          >
            <Card
              card={{ ...card, isFaceDown: !isFlipped }}
              onClick={() => {
                if (isTopCard && !isFlipped) {
                  setFlippedCardId(card.id);
                }
              }}
              isDraggable={isDraggable}
            />
          </div>
        );
      })}
    </div>
  );
}
