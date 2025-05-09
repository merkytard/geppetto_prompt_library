
import { arrayMove } from "@dnd-kit/sortable";

export const findColumn = (columns, columnId) => columns.find(col => col.id === columnId);
export const findCard = (columns, cardId) => {
    for (const column of columns) {
        const card = column.cards.find(c => c.id === cardId);
        if (card) return { card, columnId: column.id };
    }
    return { card: null, columnId: null };
};
export const getColumnIndex = (columns, columnId) => columns.findIndex(col => col.id === columnId);
export const getCardIndex = (cards, cardId) => cards.findIndex(card => card.id === cardId);

export const addColumn = (columns, title) => {
  const newColumn = {
    id: `column-${Date.now()}`,
    title: title,
    cards: [],
  };
  return { newColumns: [...columns, newColumn], addedColumn: newColumn };
};

export const deleteColumn = (columns, columnId) => {
  const deletedColumn = findColumn(columns, columnId);
  const newColumns = columns.filter(col => col.id !== columnId);
  return { newColumns, deletedColumn };
};

export const updateColumnTitle = (columns, columnId, newTitle) => {
  let updatedColumn = null;
  const newColumns = columns.map(col => {
    if (col.id === columnId) {
      updatedColumn = { ...col, title: newTitle };
      return updatedColumn;
    }
    return col;
  });
  return { newColumns, updatedColumn };
};

export const addCard = (columns, columnId, cardData) => {
  const newCard = {
    id: `card-${Date.now()}`,
    title: cardData.title || 'New Card',
    description: cardData.description || '',
    labels: cardData.labels || [],
    color: cardData.color || null,
    assignedUsers: cardData.assignedUsers || [],
  };
  let addedCard = null;
  const newColumns = columns.map(col => {
    if (col.id === columnId) {
       addedCard = newCard;
       return { ...col, cards: [...col.cards, newCard] };
    }
    return col;
  });
  return { newColumns, addedCard };
};

export const updateCardDetails = (columns, cardId, updatedData) => {
  let updatedCard = null;
  const newColumns = columns.map(column => {
    const cardIndex = getCardIndex(column.cards, cardId);
    if (cardIndex !== -1) {
      const updatedCards = [...column.cards];
      updatedCards[cardIndex] = { ...updatedCards[cardIndex], ...updatedData };
      updatedCard = updatedCards[cardIndex];
      return { ...column, cards: updatedCards };
    }
    return column;
  });
  return { newColumns, updatedCard };
};

export const deleteCard = (columns, cardId) => {
  let deletedCard = null;
  const newColumns = columns.map(column => {
    const cardIndex = getCardIndex(column.cards, cardId);
    if (cardIndex !== -1) {
      deletedCard = column.cards[cardIndex];
      const updatedCards = column.cards.filter(card => card.id !== cardId);
      return { ...column, cards: updatedCards };
    }
    return column;
  });
  return { newColumns, deletedCard };
};

export const moveColumn = (columns, activeId, overId) => {
   const oldIndex = getColumnIndex(columns, activeId);
   const newIndex = getColumnIndex(columns, overId);
   if (oldIndex === -1 || newIndex === -1) return { newColumns: columns, movedColumn: null };
   const movedColumn = columns[oldIndex];
   return { newColumns: arrayMove(columns, oldIndex, newIndex), movedColumn };
};

export const moveCardWithinColumn = (columns, columnId, activeId, overId) => {
  let movedCard = null;
  const newColumns = columns.map(column => {
    if (column.id === columnId) {
       const oldIndex = getCardIndex(column.cards, activeId);
       // Allow dropping at the end if overId is the column itself
       const newIndex = overId === columnId ? column.cards.length : getCardIndex(column.cards, overId);
       if (oldIndex === -1 || newIndex === -1) return column;
       movedCard = column.cards[oldIndex];
       const finalIndex = oldIndex < newIndex ? newIndex -1 : newIndex; // Adjust index correctly when moving down
       const updatedCards = arrayMove(column.cards, oldIndex, finalIndex);
       return { ...column, cards: updatedCards };
    }
    return column;
  });
  return { newColumns, movedCard };
};

export const moveCardBetweenColumns = (columns, sourceColumnId, destinationColumnId, activeId, overCardId) => {
  const sourceColumnIndex = getColumnIndex(columns, sourceColumnId);
  const destinationColumnIndex = getColumnIndex(columns, destinationColumnId);

  if (sourceColumnIndex === -1 || destinationColumnIndex === -1) return { newColumns: columns, movedCard: null, destinationColumnTitle: null };

  const sourceColumn = columns[sourceColumnIndex];
  const destinationColumn = columns[destinationColumnIndex];
  const sourceCards = [...sourceColumn.cards];
  const destinationCards = [...destinationColumn.cards];

  const activeCardIndex = getCardIndex(sourceCards, activeId);
  if (activeCardIndex === -1) return { newColumns: columns, movedCard: null, destinationColumnTitle: null };

  const [movedCard] = sourceCards.splice(activeCardIndex, 1);

  let destinationCardIndex = -1;
  if (overCardId) {
     destinationCardIndex = getCardIndex(destinationCards, overCardId);
  }

  destinationCards.splice(destinationCardIndex >= 0 ? destinationCardIndex : destinationCards.length, 0, movedCard);

  const newColumns = [...columns];
  newColumns[sourceColumnIndex] = { ...sourceColumn, cards: sourceCards };
  newColumns[destinationColumnIndex] = { ...destinationColumn, cards: destinationCards };

  return { newColumns, movedCard, destinationColumnTitle: destinationColumn.title };
};
