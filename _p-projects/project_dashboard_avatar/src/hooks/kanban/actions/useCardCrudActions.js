
    import { useCallback } from 'react';
    import { useToast } from "@/components/ui/use-toast";
    import { findColumn, generateId } from '@/lib/kanbanUtils';

    const useCardCrudActions = (state, setState) => {
        const { toast } = useToast();
        const { columns, users } = state;

        const handleAddCard = useCallback((columnId, cardData) => {
            const targetColumn = findColumn(columns, columnId);
            if (!targetColumn) return null;

            const newCard = {
                id: generateId('card'),
                title: cardData.title || 'New Task',
                description: cardData.description || '',
                type: cardData.type || 'TASK',
                tags: cardData.tags || [],
                assignedUserId: cardData.assignedUserId || null,
                color: cardData.color || null,
                linkedNodeId: cardData.linkedNodeId || null,
                projectId: cardData.projectId || null, // Include projectId
                sourceFolder: cardData.sourceFolder || '', // Include sourceFolder
                exportFolder: cardData.exportFolder || '', // Include exportFolder
                reminder: cardData.reminder || null,
                isArchived: false,
                createdAt: new Date().toISOString(),
            };

            const newColumns = columns.map(col =>
                col.id === columnId ? { ...col, cards: [...col.cards, newCard] } : col
            );
            setState(prev => ({ ...prev, columns: newColumns }));
            toast({ title: "Card Added", description: `"${newCard.title}" added to ${targetColumn.title}.` });
            return newCard.id; // Return the new card's ID
        }, [columns, setState, toast]);

        const handleEditCard = useCallback((cardId, updatedData) => {
            let cardFound = false;
            const newColumns = columns.map(column => ({
                ...column,
                cards: column.cards.map(card => {
                    if (card.id === cardId) {
                        cardFound = true;
                        // Ensure existing fields are preserved if not in updatedData
                        return { ...card, ...updatedData };
                    }
                    return card;
                })
            }));

            if (cardFound) {
                setState(prev => ({ ...prev, columns: newColumns }));
                toast({ title: "Card Updated", description: `Task "${updatedData.title || 'Card'}" updated.` });
            } else {
                toast({ title: "Update Failed", description: "Card not found.", variant: "destructive" });
            }
        }, [columns, setState, toast]);


        const handleDeleteCard = useCallback((cardId) => {
            let cardFound = false;
            const newColumns = columns.map(column => ({
                ...column,
                cards: column.cards.filter(card => {
                    if (card.id === cardId) {
                        cardFound = true;
                        return false; // Filter out the card
                    }
                    return true;
                })
            }));

            if (cardFound) {
                setState(prev => ({ ...prev, columns: newColumns }));
                toast({ title: "Card Deleted", variant: "destructive" });
            } else {
                toast({ title: "Deletion Failed", description: "Card not found.", variant: "destructive" });
            }
        }, [columns, setState, toast]);

        return {
            handleAddCard,
            handleEditCard,
            handleDeleteCard,
        };
    };

    export default useCardCrudActions;
  