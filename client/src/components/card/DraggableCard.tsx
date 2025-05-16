import { useDraggable } from "@dnd-kit/core";
import { DroppableSlot } from "./DroppableSlot";
import { Source } from "./CardDisplay";

type DraggableCardProps = {
  children: React.ReactNode;
  id: string;
  source: Source;
};

export function DraggableCard({ children, id, source }: DraggableCardProps) {
  const { listeners, setNodeRef, transform } = useDraggable({
    id,
    data: { source },
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
      <DroppableSlot id={id} source={source}>
        {children}
      </DroppableSlot>
    </div>
  );
}
