import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useGameDispatch, useGameState } from "../../context/game/GameContext";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { Deck } from "../card/Deck";
import { DiscardPile } from "../card/DicardPile";
import { PlayerHand } from "../card/PlayerHand";
import { useBoard } from "../../hooks/useBoard";
import { getSocket } from "../../lib/websocket";
import { useEffect } from "react";
import { GameState } from "../../context/game/types";
import eventBus from "../../lib/eventBus";

type BoardProps = {
  socket: ReturnType<typeof getSocket>;
};

export function Board({ socket }: BoardProps) {
  const state = useGameState();
  const dispach = useGameDispatch();

  useEffect(() => {
    socket.on<GameState>("updateBoard", (data) => {
      dispach({ type: "UPDATE_GAME_STATE", payload: data });
    });

    return () => {
      socket.off("updateBoard");
    };
  }, []);

  const { swapPlayerCards } = useBoard();

  const handleDragEnd = (event: DragEndEvent) => {
    // if (state.currentPlayer !== state.currentPlayer) {
    //   alert("espera");

    //   return;
    // }

    const { active, over } = event;
    if (!over || active.id === over.id) return;
    console.log("active", active.data.current?.source);
    console.log("over", over.data.current?.source);

    const activeSource = active.data.current?.source;
    const overSource = over.data.current?.source;
    if (!activeSource || !overSource) return;


    if (activeSource === "PLAYER" && overSource === "PLAYER") {
      swapPlayerCards({
        fromId: active.id.toString(),
        toId: over.id.toString(),
      });
    } else if (activeSource === "DECK" && overSource === "PLAYER") {
      socket.emit<{ cardId: string }>({
        key: "drawCard",
        value: { cardId: over.id.toString() },
      });

      eventBus.emit("removeTopCard");
    } else if (activeSource === "DISCARD" && overSource === "PLAYER") {
      socket.emit<{ cardId: string }>({
        key: "drawDiscard",
        value: { cardId: over.id.toString() },
      });
    } else if (activeSource === "DECK" && overSource === "DISCARD") {
      socket.emit<{ cardId: string }>({
        key: "deckDiscard",
        value: { cardId: over.id.toString() },
      });

      eventBus.emit("removeTopCard");
    }
  };

  return (
    <div className="board">
      <section className="opponent-hand">
        {Array.from({ length: 9 }).map((_, index) => (
          <div key={index} className="card face-down"></div>
        ))}
      </section>
      <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToWindowEdges]}>
        <section className="mid-section">
          <Deck deckSize={state.deckSize} />
          <DiscardPile cards={state.discardPile} />
        </section>
        <section className="player-hand">
          <PlayerHand cards={state.hand} />
        </section>
        {/* <p>{state.currentPlayer}</p> */}
      </DndContext>
    </div>
  );
}
