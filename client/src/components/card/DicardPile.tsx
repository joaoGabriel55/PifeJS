import { Card } from "./Card";
import { TCard } from "./CardDisplay";
import { DroppableSlot } from "./DroppableSlot";
import "./DiscardPile.css";

type DiscardPileProps = {
  cards: TCard[];
};

export function DiscardPile({ cards }: DiscardPileProps) {
  return (
    <DroppableSlot id="discard-pile" source="DISCARD">
      <div className="discard-pile">
        {cards.length === 0 ? (
          <div className="discard-placeholder"></div>
        ) : (
          cards.map((card, index) => {
            const isTopCard = index === cards.length - 1;

            return (
              <div
                key={card.id}
                className="deck-card-wrapper"
                style={{ transform: `translate(${index * 5}px, 0)` }}
              >
                <Card card={card} isDraggable={isTopCard} />
              </div>
            );
          })
        )}
      </div>
    </DroppableSlot>
  );
}
