
    import { useCallback } from 'react';
    import { produce } from 'immer';
    import { arrayMove } from '@dnd-kit/sortable';
    import {
        updateColumnsOnAddCard,
        updateColumnsOnEditCard,
        updateColumnsOnDeleteCard,
        updateColumnsOnAssignUser,
        updateColumnsOnChangeColor,
        updateColumnsOnLinkNode,
        updateColumnsOnArchiveCard,
        updateColumnsOnSetReminder
    } from '@/lib/kanbanActionHelpers';

    const findColumnIndex = (columns, columnId) => columns.findIndex(col => col.id === columnId);
    const findCardIndices = (columns, cardId) => {
        for (let i = 0; i < columns.length; i++) {
            const cardIndex = columns[i].cards.findIndex(c => c.id === cardId);
            if (cardIndex !== -1) {
                return { columnIndex: i, cardIndex };
            }
        }
        return { columnIndex: -1, cardIndex: -1 };
    };

    const useKanbanActions = (setColumns, users, tags, setTags, archivedCards, setArchivedCards, toast) => {

        const handleAddColumn = useCallback((title) => {
            const newColumn = { id: `col-${Date.now()}`, title: title || 'New Column', cards: [] };
            setColumns(prev => [...prev, newColumn]);
            toast({ title: "Column Added", description: `Column "${newColumn.title}" created.` });
        }, [setColumns, toast]);

        const handleDeleteColumn = useCallback((columnId) => {
            let deletedTitle = "";
            setColumns(prev => {
                const col = prev.find(c => c.id === columnId);
                deletedTitle = col ? col.title : "";
                if (col && col.cards.length > 0) {
                    toast({ title: "Delete Failed", description: "Cannot delete a column with cards.", variant: "destructive" });
                    return prev;
                }
                return prev.filter(c => c.id !== columnId);
            });
            if (deletedTitle) {
                 toast({ title: "Column Deleted", description: `Column "${deletedTitle}" removed.`, variant: "destructive" });
            }
        }, [setColumns, toast]);

        const handleUpdateColumnTitle = useCallback((columnId, newTitle) => {
            setColumns(prev => prev.map(col => col.id === columnId ? { ...col, title: newTitle } : col));
            toast({ title: "Column Updated", description: `Column title changed to "${newTitle}".` });
        }, [setColumns, toast]);

        const handleAddCard = useCallback((columnId, cardData) => {
            setColumns(prevColumns => {
                const { updatedColumns, addedCardTitle } = updateColumnsOnAddCard(columnId, cardData)(prevColumns);
                toast({ title: "Card Added", description: `Card "${addedCardTitle}" created.` });
                return updatedColumns;
            });
        }, [setColumns, toast]);

        const handleEditCard = useCallback((columnId, cardId, updatedData) => {
            setColumns(prevColumns => {
                const { updatedColumns, cardTitle } = updateColumnsOnEditCard(columnId, cardId, updatedData)(prevColumns);
                toast({ title: "Card Updated", description: `Card "${cardTitle}" details modified.` });
                return updatedColumns;
            });
        }, [setColumns, toast]);

        const handleDeleteCard = useCallback((columnId, cardId) => {
            setColumns(prevColumns => {
                const { updatedColumns, cardTitle } = updateColumnsOnDeleteCard(columnId, cardId)(prevColumns);
                toast({ title: "Card Deleted", description: `Card "${cardTitle}" removed.`, variant: "destructive" });
                return updatedColumns;
            });
        }, [setColumns, toast]);

        const handleAssignUser = useCallback((columnId, cardId, userId) => {
            setColumns(prevColumns => {
                const { updatedColumns, cardTitle } = updateColumnsOnAssignUser(columnId, cardId, userId)(prevColumns);
                const user = users.find(u => u.id === userId);
                const card = updatedColumns.flatMap(col => col.cards).find(c => c.id === cardId);
                const action = userId === null ? 'unassigned from' : (card?.assignedUserIds?.includes(userId) ? 'assigned to' : 'unassigned from');
                toast({ title: "User Assignment", description: `${user ? user.name : 'User'} ${action} card "${cardTitle}".` });
                return updatedColumns;
            });
        }, [setColumns, users, toast]);

        const handleChangeCardColor = useCallback((columnId, cardId, colorValue) => {
            setColumns(prevColumns => {
                const { updatedColumns, cardTitle } = updateColumnsOnChangeColor(columnId, cardId, colorValue)(prevColumns);
                toast({ title: "Card Color Changed", description: `Color updated for card "${cardTitle}".` });
                return updatedColumns;
            });
        }, [setColumns, toast]);

        const handleLinkNode = useCallback((cardId, nodeId) => {
            setColumns(prevColumns => {
                const { updatedColumns, cardTitle } = updateColumnsOnLinkNode(cardId, nodeId)(prevColumns);
                const action = nodeId ? 'linked to' : 'unlinked from';
                const nodeIdentifier = nodeId ? `Node ${nodeId.substring(0, 6)}...` : 'NodeBase';
                toast({ title: "Node Link Updated", description: `Card "${cardTitle}" ${action} ${nodeIdentifier}.` });
                return updatedColumns;
            });
        }, [setColumns, toast]);

        const handleAddTag = useCallback((columnId, cardId, newTag) => {
            if (!newTag || !newTag.trim()) return;
            const trimmedTag = newTag.trim();

            setColumns(prevColumns => produce(prevColumns, draft => {
                const { columnIndex, cardIndex } = findCardIndices(draft, cardId);
                if (cardIndex !== -1 && draft[columnIndex].id === columnId) {
                    const card = draft[columnIndex].cards[cardIndex];
                    if (!card.tags) card.tags = [];
                    if (!card.tags.includes(trimmedTag)) {
                        card.tags.push(trimmedTag);
                        if (!tags.includes(trimmedTag)) {
                            setTags(prevTags => [...prevTags, trimmedTag]);
                        }
                        toast({ title: "Tag Added", description: `Tag "${trimmedTag}" added to card "${card.title}".` });
                    }
                }
            }));
        }, [setColumns, tags, setTags, toast]);

        const handleRemoveTag = useCallback((columnId, cardId, tagToRemove) => {
            setColumns(prevColumns => produce(prevColumns, draft => {
                const { columnIndex, cardIndex } = findCardIndices(draft, cardId);
                if (cardIndex !== -1 && draft[columnIndex].id === columnId) {
                    const card = draft[columnIndex].cards[cardIndex];
                    if (card.tags) {
                        const initialLength = card.tags.length;
                        card.tags = card.tags.filter(tag => tag !== tagToRemove);
                        if (card.tags.length < initialLength) {
                           toast({ title: "Tag Removed", description: `Tag "${tagToRemove}" removed from card "${card.title}".` });
                        }
                    }
                }
            }));
        }, [setColumns, toast]);

        const handleArchiveCard = useCallback((columnId, cardId) => {
            setColumns(prevColumns => {
                const { updatedColumns, cardTitle, archivedCard } = updateColumnsOnArchiveCard(columnId, cardId)(prevColumns);
                if (archivedCard) {
                    setArchivedCards(prev => [...prev, archivedCard]);
                    toast({ title: "Card Archived", description: `Card "${cardTitle}" moved to archive.` });
                }
                return updatedColumns;
            });
        }, [setColumns, setArchivedCards, toast]);

        const handleUnarchiveCard = useCallback((cardId) => {
            const cardToUnarchive = archivedCards.find(c => c.id === cardId);
            if (!cardToUnarchive) return;

            setColumns(prevColumns => {
                const targetColumnId = prevColumns[0]?.id; 
                if (!targetColumnId) return prevColumns; 

                const updatedCard = { ...cardToUnarchive, isArchived: false };
                const { updatedColumns, addedCardTitle } = updateColumnsOnAddCard(targetColumnId, updatedCard)(prevColumns);

                setArchivedCards(prev => prev.filter(c => c.id !== cardId));
                toast({ title: "Card Unarchived", description: `Card "${addedCardTitle}" restored to "${prevColumns.find(c=>c.id === targetColumnId)?.title || 'board'}".` });
                return updatedColumns;
            });
        }, [archivedCards, setArchivedCards, setColumns, toast]);

        const handleSetReminder = useCallback((columnId, cardId, settings) => {
             setColumns(prevColumns => {
                 const { updatedColumns, cardTitle } = updateColumnsOnSetReminder(columnId, cardId, settings)(prevColumns);
                 const frequencyText = settings.frequency === 'none' ? 'removed' : `set to ${settings.frequency.replace('_', ' ')}`;
                 toast({ title: "Reminder Updated", description: `Reminder for card "${cardTitle}" ${frequencyText}.` });
                 return updatedColumns;
             });
        }, [setColumns, toast]);

        const handleDragEnd = useCallback((event) => {
            const { active, over } = event;
            if (!over) return;

            const activeId = active.id;
            const overId = over.id;

            if (activeId === overId) return;

            const isActiveAColumn = active.data?.current?.type === 'COLUMN';
            const isOverAColumn = over.data?.current?.type === 'COLUMN';
            const isActiveACard = active.data?.current?.type === 'CARD';
            const isOverACard = over.data?.current?.type === 'CARD';

            setColumns(prevColumns => {
                let newColumns = [...prevColumns];

                if (isActiveAColumn && isOverAColumn) {
                    const oldIndex = findColumnIndex(newColumns, activeId);
                    const newIndex = findColumnIndex(newColumns, overId);
                    if (oldIndex !== -1 && newIndex !== -1) {
                        newColumns = arrayMove(newColumns, oldIndex, newIndex);
                        toast({ title: "Column Moved", description: `Column "${newColumns[newIndex].title}" reordered.` });
                    }
                }

                if (isActiveACard) {
                    const { columnIndex: activeColumnIndex, cardIndex: activeCardIndex } = findCardIndices(newColumns, activeId);
                    if (activeCardIndex === -1 || activeColumnIndex === -1) return prevColumns;

                    let overColumnId = null;
                    let overCardId = null;

                    if (isOverAColumn) {
                        overColumnId = overId;
                    } else if (isOverACard) {
                        const { columnIndex: overColumnIndex } = findCardIndices(newColumns, overId);
                        if (overColumnIndex !== -1) {
                            overColumnId = newColumns[overColumnIndex].id;
                            overCardId = overId;
                        }
                    }

                    if (!overColumnId) return prevColumns;

                    const sourceColumnId = newColumns[activeColumnIndex].id;
                    const destinationColumnId = overColumnId;

                    if (sourceColumnId === destinationColumnId) { // Moving card within the same column
                        const sourceColumn = newColumns[activeColumnIndex];
                        const oldIndex = activeCardIndex;
                        const newIndex = overCardId ? sourceColumn.cards.findIndex(c => c.id === overCardId) : sourceColumn.cards.length;

                        if (oldIndex !== -1 && newIndex !== -1) {
                            const movedCard = sourceColumn.cards[oldIndex];
                            const updatedCards = arrayMove(sourceColumn.cards, oldIndex, newIndex);
                            newColumns[activeColumnIndex] = { ...sourceColumn, cards: updatedCards };
                            toast({ title: "Card Moved", description: `Card "${movedCard.title}" reordered within "${sourceColumn.title}".` });
                        }
                    }
                    else { // Moving card to a different column
                        const sourceColumn = newColumns[activeColumnIndex];
                        const destinationColumnIndex = findColumnIndex(newColumns, destinationColumnId);
                        if (destinationColumnIndex === -1) return prevColumns;

                        const destinationColumn = newColumns[destinationColumnIndex];
                        const sourceCards = [...sourceColumn.cards];
                        const destinationCards = [...destinationColumn.cards];

                        const [movedCard] = sourceCards.splice(activeCardIndex, 1);
                        
                        let destinationCardIndex = -1;
                        if (overCardId) { // Dropped onto another card
                            destinationCardIndex = destinationCards.findIndex(c => c.id === overCardId);
                        }
                        // If not dropped onto a card, or card not found, append to end
                        destinationCards.splice(destinationCardIndex >= 0 ? destinationCardIndex : destinationCards.length, 0, movedCard);

                        newColumns[activeColumnIndex] = { ...sourceColumn, cards: sourceCards };
                        newColumns[destinationColumnIndex] = { ...destinationColumn, cards: destinationCards };
                        toast({ title: "Card Moved", description: `Card "${movedCard.title}" moved to "${destinationColumn.title}".` });
                    }
                }
                return newColumns;
            });
        }, [setColumns, toast]);


        return {
            handleAddColumn,
            handleDeleteColumn,
            handleUpdateColumnTitle,
            handleAddCard,
            handleEditCard,
            handleDeleteCard,
            handleAssignUser,
            handleChangeCardColor,
            handleLinkNode,
            handleAddTag,
            handleRemoveTag,
            handleArchiveCard,
            handleUnarchiveCard,
            handleSetReminder,
            handleDragEnd,
        };
    };

    export default useKanbanActions;
  