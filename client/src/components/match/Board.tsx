import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useGameState } from "../../context/game/GameContext";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { Deck } from "../card/Deck";
import { DiscardPile } from "../card/DicardPile";
import { PlayerHand } from "../card/PlayerHand";
import { Card } from "../card/Card";
import { useBoard } from "../../hooks/useBoard";

export function Board() {
  const state = useGameState();

  const { swapPlayerCards } = useBoard();

  const handleDragEnd = (event: DragEndEvent) => {
    if (state.userData.userName !== state.userData.currentPlayer) {
      alert("espera");

      return;
    }

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeSource = active.data.current?.source;
    const overSource = over.data.current?.source;
    if (!activeSource || !overSource) return;

    if (activeSource === "PLAYER" && overSource === "PLAYER") {
      swapPlayerCards({
        fromId: active.id.toString(),
        toId: over.id.toString(),
      });
    } else if (activeSource === "DECK" && overSource === "PLAYER") {
      // emit
      // atualiza o estado
    } else if (activeSource === "DISCARD" && overSource === "PLAYER") {
      //
    } else if (activeSource === "DECK" && overSource === "DISCARD") {
      //
    }
  };

  return (
    <div className="board">
      <section className="opponent-hand">
        {state.opponentHand.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </section>
      <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToWindowEdges]}>
        <section className="mid-section">
          <Deck deckSize={state.deckSize} />
          <DiscardPile cards={state.discardPile} />
        </section>
        <section className="player-hand">
          <PlayerHand cards={state.playerHand} />
        </section>
        <p>{state.userData.userName}</p>
      </DndContext>
    </div>
  );
}
