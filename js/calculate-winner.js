function isWinner(cards) {
  const newCards = cards.map((card) => {
    if (isNaN(card.value)) {
      return card;
    } else {
      return { value: Number(card.value), suit: card.suit };
    }
  });

  function isSequence(cards) {
    const values = cards.map((card) => card.value).sort((a, b) => a - b);

    return (
      (values[0] + 1 === values[1] && values[1] + 1 === values[2]) ||
      (values.includes("A") && values.includes(2) && values.includes(3)) || // A, 2, 3
      (values.includes("Q") && values.includes("K") && values.includes("A")) // Q, K, A
    );
  }

  function isSameValue(cards) {
    return (
      cards[0].value === cards[1].value &&
      cards[1].value === cards[2].value &&
      new Set(cards.map((card) => card.suit)).size === 3
    );
  }

  function findSets(cards, setsFound) {
    if (setsFound === 3) return true;
    if (cards.length < 3) return false;

    for (let i = 0; i < cards.length - 2; i++) {
      for (let j = i + 1; j < cards.length - 1; j++) {
        for (let k = j + 1; k < cards.length; k++) {
          const selectedCards = [cards[i], cards[j], cards[k]];
          if (isSameValue(selectedCards) || isSequence(selectedCards)) {
            const remainingCards = cards.filter(
              (_, index) => index !== i && index !== j && index !== k
            );
            if (findSets(remainingCards, setsFound + 1)) return true;
          }
        }
      }
    }
    return false;
  }

  return findSets(newCards, 0);
}

export default isWinner;
