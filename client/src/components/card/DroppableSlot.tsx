import { useDroppable } from "@dnd-kit/core";
import './Card.css';

export function DroppableSlot({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className="droppable-slot">
      {children}
    </div>
  );
}
