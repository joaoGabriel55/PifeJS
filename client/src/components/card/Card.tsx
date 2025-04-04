import { TCard, CardDisplay } from "./CardDisplay";
import { DraggableCard } from "./DraggableCard";
import React from "react";

type CardProps = {
  card: TCard;
  isDraggable?: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
};

export function Card({ card, isDraggable = false, onClick }: CardProps) {
  if (!isDraggable) {
    return <CardDisplay {...card} onClick={onClick} />;
  }

  return (
    <DraggableCard id={card.id} source={card.source}>
      <CardDisplay {...card} onClick={onClick} />
    </DraggableCard>
  );
}
