import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useGameDispatch, useGameState } from "../../context/game/GameContext";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { Deck } from "../card/Deck";
import { DiscardPile } from "../card/DicardPile";
import { PlayerHand } from "../card/PlayerHand";
import { Card } from "../card/Card";
import { useBoard } from "../../hooks/useBoard";

export function Board() {
  const state = useGameState();
  const dispatch = useGameDispatch();

  const { swapPlayerCards } = useBoard();

  const handleDragEnd = (event: DragEndEvent) => {
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
      dispatch({
        type: "DRAW_FROM_DECK",
        payload: {
          deckCardId: active.id.toString(),
          playerCardId: over.id.toString(),
        },
      });
    } else if (activeSource === "DISCARD" && overSource === "PLAYER") {
      dispatch({
        type: "DRAW_FROM_DISCARD",
        payload: {
          discardCardId: active.id.toString(),
          playerCardId: over.id.toString(),
        },
      });
    } else if (activeSource === "DECK" && overSource === "DISCARD") {
      dispatch({
        type: "DISCARD_FROM_DECK",
        payload: {
          deckCardId: active.id.toString(),
        },
      });
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
          <Deck cards={state.deck} />
          <DiscardPile cards={state.discardPile} />
        </section>
        <section className="player-hand">
          <PlayerHand cards={state.playerHand} />
        </section>
      </DndContext>
    </div>
  );
}
