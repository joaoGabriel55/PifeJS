import {
  handlePlayerCardSwap,
} from "./game.js";
import { handleDiscardedCardDrop, handleDeckCardDrop } from "./index.js";

let dragSrcEl = null;

function handleDragStart(e) {
  this.style.opacity = "0.4";

  dragSrcEl = this;

  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/html", this.innerHTML);
  e.dataTransfer.setData("text/plain", this.dataset.index);
}

function handleDragOver(e) {
  if (e.preventDefault) e.preventDefault();

  e.dataTransfer.dropEffect = "move";

  return false;
}

function handleDrop(playerId, isTopDeckCardFaceUp) {
  const deckDiv = document.getElementById("deck-pile");
  const discardPileContentDiv = document.getElementById("discard-pile-content");

  return function (e) {
    if (e.stopPropagation) e.stopPropagation();
    if (!dragSrcEl) return;
    if (!isTopDeckCardFaceUp && dragSrcEl.parentNode === deckDiv)
      return;

    if (dragSrcEl.parentNode === deckDiv) {
      handleDeckCardDrop(dragSrcEl, this, playerId);
    } else if (dragSrcEl.parentNode === discardPileContentDiv) {
      handleDiscardedCardDrop(this, playerId);
    } else if (dragSrcEl != this) {
      const content = e.dataTransfer.getData("text/html");
      handlePlayerCardSwap(dragSrcEl, this, content);
    }

    return false;
  };
}

function handleDragEnd(e) {
  this.style.opacity = "1";
  dragSrcEl = null;
}

function handleDeckDragStart(e) {
  this.style.opacity = "0.4";

  dragSrcEl = this;

  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/html", this.innerHTML);
}

export {
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleDragEnd,
  handleDeckDragStart,
};
