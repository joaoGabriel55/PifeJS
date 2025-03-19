import { useDraggable } from "@dnd-kit/core";
import { TCard, CardDisplay } from "./CardDisplay";
import { DroppableSlot } from "./DroppableSlot";
import "./Card.css";

type CardProps = {
  card: TCard;
};

export function Card({ card }: CardProps) {
  const { listeners, setNodeRef, transform } = useDraggable({
    id: card.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      style={style}
      className="draggable-card"
    >
      <DroppableSlot id={card.id}>
        <CardDisplay {...card} />
      </DroppableSlot>
    </div>
  );
}
