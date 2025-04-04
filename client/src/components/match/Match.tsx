import { useState } from "react";
import { useRound } from "../../hooks/useRound";
import { Card } from "../card/Card";
import "./Match.css";
import { Deck } from "../card/Deck";
import { PlayerHand } from "../card/PlayerHand";
import { DiscardPile } from "../card/DicardPile";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { TCard } from "../card/CardDisplay";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";

export function Match() {
  const { round } = useRound();
  const [playerHand, setPlayerHand] = useState(round.hands[0].hand);
  const [deck, setDeck] = useState(round.deck);
  const [discardPile, setDiscardPile] = useState(round.discardPile);

  const opponentHand = round.hands[1].hand;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const { data: activeData } = active;
    const { data: overData } = over;

    const activeSource = activeData.current?.source;
    const overSource = overData.current?.source;

    if (!activeSource || !overSource) return;

    if (activeSource === "PLAYER" && overSource === "PLAYER") {
      // swap player cards action
      const oldIndex = playerHand.findIndex((card) => card.id === active.id);
      const newIndex = playerHand.findIndex((card) => card.id === over.id);

      const updatedHand = [...playerHand];
      const [moveCard] = updatedHand.splice(oldIndex, 1);

      updatedHand.splice(newIndex, 0, moveCard);

      setPlayerHand(updatedHand);
    } else if (activeSource === "DECK" && overSource === "PLAYER") {
      // draw card from deck action
      const deckCardIndex = deck.findIndex((card) => card.id === active.id);
      const playerCardIndex = playerHand.findIndex(
        (card) => card.id === over.id
      );

      const updatedHand: TCard[] = [...playerHand];
      const updatedDeck = [...deck];
      const updatedDiscardPile = [...discardPile];

      const [drawnCard] = updatedDeck.splice(deckCardIndex, 1);
      const [discardedCard] = updatedHand.splice(playerCardIndex, 1, {
        ...drawnCard,
        isFaceDown: false,
        source: "PLAYER",
      });

      updatedDiscardPile.push({ ...discardedCard, source: "DISCARD" });

      setDeck(updatedDeck);
      setDiscardPile(updatedDiscardPile);
      setPlayerHand(updatedHand);
    } else if (activeSource === "DISCARD" && overSource === "PLAYER") {
      // draw card from discard pile action
      const discardCardIndex = discardPile.findIndex(
        (card) => card.id === active.id
      );
      const playerCardIndex = playerHand.findIndex(
        (card) => card.id === over.id
      );

      const updatedHand = [...playerHand];
      const updatedDiscardPile = [...discardPile];

      const [drawnCard] = updatedDiscardPile.splice(discardCardIndex, 1);
      const [discardedCard] = updatedHand.splice(playerCardIndex, 1, {
        ...drawnCard,
        source: "PLAYER",
      });

      updatedDiscardPile.push({ ...discardedCard, source: "DISCARD" });

      setPlayerHand(updatedHand);
      setDiscardPile(updatedDiscardPile);
    } else if (activeSource === "DECK" && overSource === "DISCARD") {
      // discard from deck action
      const deckCardIndex = deck.findIndex((card) => card.id === active.id);

      const updatedDiscardPile = [...discardPile];

      const [discardCard] = deck.splice(deckCardIndex, 1);
      updatedDiscardPile.push({
        ...discardCard,
        source: "DISCARD",
        isFaceDown: false,
      });

      setDiscardPile(updatedDiscardPile);
    }
  };

  return (
    <div className="board">
      <section className="opponent-hand">
        {opponentHand.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </section>
      <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToWindowEdges]}>
        <section className="mid-section">
          <Deck cards={deck} />
          <DiscardPile cards={discardPile} />
        </section>
        <section className="player-hand">
          <PlayerHand cards={playerHand} />
        </section>
      </DndContext>
    </div>
  );
}
