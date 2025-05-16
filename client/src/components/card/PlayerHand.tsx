import { TCard } from "./CardDisplay";
import { Card } from "./Card";

type PlayerHandProps = {
  cards: TCard[];
};

export function PlayerHand({ cards }: PlayerHandProps) {
  return cards.map((card) => <Card key={card.id} card={card} isDraggable />);
}
