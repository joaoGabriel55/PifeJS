import { useDroppable } from "@dnd-kit/core";
import { Source } from "./CardDisplay";
import "./DroppableSlot.css";

export function DroppableSlot({
  id,
  children,
  source,
}: {
  id: string;
  source: Source;
  children: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({ id, data: { source } });

  return (
    <div ref={setNodeRef} className="droppable-slot">
      {children}
    </div>
  );
}
