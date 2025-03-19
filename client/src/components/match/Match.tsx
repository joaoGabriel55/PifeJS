import { useState } from "react";
import { useRound } from "../../hooks/useRound";
import { Card } from "../card/Card";
import "./Match.css";
import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";

export function Match() {
  const { round } = useRound();
  const [playerHand, setPlayerHand] = useState(round.hands[0].hand);
  const [opponentHand] = useState(round.hands[1].hand);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = playerHand.findIndex((card) => card.id === active.id);
    const newIndex = playerHand.findIndex((card) => card.id === over.id);

    const updatedHand = [...playerHand];
    const [movedCard] = updatedHand.splice(oldIndex, 1);
    updatedHand.splice(newIndex, 0, movedCard);

    setPlayerHand(updatedHand);
  }

  return (
    <div className="board">
      <section className="opponent-hand">
        {opponentHand.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </section>
      <section></section>
      <section className="player-hand">
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          {playerHand.map((card) => (
            <Card key={card.id} card={card} />
          ))}
        </DndContext>
      </section>
    </div>
  );
}
