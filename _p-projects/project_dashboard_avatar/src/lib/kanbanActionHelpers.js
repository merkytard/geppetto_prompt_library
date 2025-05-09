
    import { produce } from 'immer';

    let cardIdCounter = 100;

    const findCardAndColumn = (columns, cardId) => {
      for (let i = 0; i < columns.length; i++) {
        const cardIndex = columns[i].cards.findIndex(c => c.id === cardId);
        if (cardIndex !== -1) {
          return { columnIndex: i, cardIndex };
        }
      }
      return { columnIndex: -1, cardIndex: -1 };
    };

    export const updateColumnsOnAddCard = (columnId, cardData) => (prevColumns) => {
      const newCard = {
        id: `card-${Date.now()}-${cardIdCounter++}`,
        title: cardData.title || 'New Card',
        description: cardData.description || '',
        type: cardData.type || 'TASK',
        assignedUserIds: cardData.assignedUserIds || [],
        tags: cardData.tags || [],
        color: cardData.color || 'bg-card',
        dueDate: cardData.dueDate || null,
        estimatedTime: cardData.estimatedTime || null,
        actualTime: cardData.actualTime || 0,
        linkedNodeId: cardData.linkedNodeId || null,
        isArchived: false,
        reminderSettings: { frequency: 'none' },
        projectId: cardData.projectId || null,
        createdAt: new Date().toISOString(),
      };

      const updatedColumns = produce(prevColumns, draft => {
        const targetColumn = draft.find(col => col.id === columnId);
        if (targetColumn) {
          targetColumn.cards.push(newCard);
        }
      });

      return { updatedColumns, addedCardTitle: newCard.title };
    };

    export const updateColumnsOnEditCard = (columnId, cardId, updatedData) => (prevColumns) => {
      let cardTitle = "";
      const updatedColumns = produce(prevColumns, draft => {
        const targetColumn = draft.find(col => col.id === columnId);
        if (targetColumn) {
          const cardIndex = targetColumn.cards.findIndex(card => card.id === cardId);
          if (cardIndex !== -1) {
            const currentCard = targetColumn.cards[cardIndex];
            const mergedData = {
              ...currentCard,
              ...updatedData,
              estimatedTime: updatedData.estimatedTime !== undefined ? updatedData.estimatedTime : currentCard.estimatedTime,
              actualTime: updatedData.actualTime !== undefined ? updatedData.actualTime : currentCard.actualTime,
              reminderSettings: updatedData.reminderSettings ?? currentCard.reminderSettings,
              isArchived: updatedData.isArchived ?? currentCard.isArchived,
            };
            targetColumn.cards[cardIndex] = mergedData;
            cardTitle = mergedData.title;
          }
        }
      });
      return { updatedColumns, cardTitle };
    };

    export const updateColumnsOnDeleteCard = (columnId, cardId) => (prevColumns) => {
      let cardTitle = "";
      const updatedColumns = produce(prevColumns, draft => {
        const targetColumn = draft.find(col => col.id === columnId);
        if (targetColumn) {
           const cardIndex = targetColumn.cards.findIndex(c => c.id === cardId);
           if (cardIndex !== -1) {
               cardTitle = targetColumn.cards[cardIndex].title;
               targetColumn.cards.splice(cardIndex, 1);
           }
        }
      });
      return { updatedColumns, cardTitle };
    };

    export const updateColumnsOnAssignUser = (columnId, cardId, userId) => (prevColumns) => {
        let cardTitle = "";
        const updatedColumns = produce(prevColumns, draft => {
            const targetColumn = draft.find(col => col.id === columnId);
            if (targetColumn) {
                const cardIndex = targetColumn.cards.findIndex(card => card.id === cardId);
                if (cardIndex !== -1) {
                    cardTitle = targetColumn.cards[cardIndex].title;
                    let currentAssigned = targetColumn.cards[cardIndex].assignedUserIds || [];
                    if (userId === null) { // Unassign all
                        targetColumn.cards[cardIndex].assignedUserIds = [];
                    } else if (!currentAssigned.includes(userId)) { // Assign if not already
                        targetColumn.cards[cardIndex].assignedUserIds = [...currentAssigned, userId];
                    } else { // Unassign if already assigned (toggle behavior)
                        targetColumn.cards[cardIndex].assignedUserIds = currentAssigned.filter(id => id !== userId);
                    }
                }
            }
        });
        return { updatedColumns, cardTitle };
    };

    export const updateColumnsOnChangeColor = (columnId, cardId, colorValue) => (prevColumns) => {
        let cardTitle = "";
        const updatedColumns = produce(prevColumns, draft => {
            const targetColumn = draft.find(col => col.id === columnId);
            if (targetColumn) {
                const cardIndex = targetColumn.cards.findIndex(card => card.id === cardId);
                if (cardIndex !== -1) {
                    cardTitle = targetColumn.cards[cardIndex].title;
                    targetColumn.cards[cardIndex].color = colorValue;
                }
            }
        });
        return { updatedColumns, cardTitle };
    };

    export const updateColumnsOnLinkNode = (cardId, nodeId) => (prevColumns) => {
        let cardTitle = "";
        const updatedColumns = produce(prevColumns, draft => {
            const { columnIndex, cardIndex } = findCardAndColumn(draft, cardId);
            if (cardIndex !== -1 && columnIndex !== -1) {
                cardTitle = draft[columnIndex].cards[cardIndex].title;
                draft[columnIndex].cards[cardIndex].linkedNodeId = nodeId;
            }
        });
        return { updatedColumns, cardTitle };
    };
    
    export const updateColumnsOnArchiveCard = (columnId, cardId) => (prevColumns) => {
        let cardTitle = "";
        let archivedCard = null;
    
        const columnsAfterArchive = produce(prevColumns, draft => {
            const targetColumn = draft.find(col => col.id === columnId);
            if (targetColumn) {
                const cardIndex = targetColumn.cards.findIndex(card => card.id === cardId);
                if (cardIndex !== -1) {
                    cardTitle = targetColumn.cards[cardIndex].title;
                    archivedCard = { ...targetColumn.cards[cardIndex], isArchived: true }; 
                    targetColumn.cards.splice(cardIndex, 1);
                }
            }
        });
        return { updatedColumns: columnsAfterArchive, cardTitle, archivedCard };
    };

    export const updateColumnsOnSetReminder = (columnId, cardId, settings) => (prevColumns) => {
        let cardTitle = "";
        const updatedColumns = produce(prevColumns, draft => {
             const targetColumn = draft.find(col => col.id === columnId);
             if (targetColumn) {
                 const cardIndex = targetColumn.cards.findIndex(card => card.id === cardId);
                 if (cardIndex !== -1) {
                     cardTitle = targetColumn.cards[cardIndex].title;
                     targetColumn.cards[cardIndex].reminderSettings = settings;
                 }
             }
        });
        return { updatedColumns, cardTitle };
    };
  