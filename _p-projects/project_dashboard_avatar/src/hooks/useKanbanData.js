
    import { useState, useEffect, useCallback, useMemo } from 'react';
    import usePersistentState from '@/hooks/usePersistentState';
    import { useToast } from "@/components/ui/use-toast";
    import { initialKanbanData, initialUsers, initialTags } from '@/data/initialKanbanData';
    import useKanbanActions from '@/hooks/kanban/useKanbanActions';
    import useGamification from '@/hooks/useGamification';
    import useProjects from '@/hooks/useProjects';

    const useKanbanData = (initialProjectId = 'all') => {
        const { toast } = useToast();
        const { projects } = useProjects();
        const [columns, setColumns] = usePersistentState('kanbanColumns_v3', initialKanbanData); // Corrected: use initialKanbanData
        const [users, setUsersState] = usePersistentState('kanbanUsers_v2', initialUsers); // Renamed to avoid conflict
        const [tags, setTagsState] = usePersistentState('kanbanTags_v2', initialTags); // Renamed to avoid conflict
        const [archivedCards, setArchivedCards] = usePersistentState('kanbanArchivedCards_v2', []);
        const [selectedProjectId, setSelectedProjectId] = useState(initialProjectId);
        const { awardXP } = useGamification();

        const memoizedProjects = useMemo(() => projects, [projects]);

        const kanbanActions = useKanbanActions(
            setColumns,
            users,
            tags,
            setTagsState, // Pass the setter
            archivedCards,
            setArchivedCards,
            toast
        );

        const handleCompleteCard = useCallback((columnId, cardId) => {
            let cardToComplete = null;
            let originalColumnId = columnId;

            setColumns(prevColumns => {
                const newColumns = prevColumns.map(col => {
                    if (col.id === originalColumnId) {
                        const cardIndex = col.cards.findIndex(c => c.id === cardId);
                        if (cardIndex !== -1) {
                            cardToComplete = { ...col.cards[cardIndex], status: 'COMPLETED' };
                            
                            const updatedCards = [...col.cards];
                            updatedCards.splice(cardIndex, 1); 
                            return { ...col, cards: updatedCards };
                        }
                    }
                    return col;
                });

                if (cardToComplete) {
                    awardXP(25, cardToComplete.title || "Task");
                    toast({ title: "Task Completed!", description: `Task "${cardToComplete.title}" marked as done.` });
                }
                return newColumns;
            });


        }, [setColumns, awardXP, toast, setArchivedCards]);


        const filteredColumns = useMemo(() => {
            if (!columns) return []; // Guard against columns being undefined during initialization
            if (selectedProjectId === 'all') return columns;
            return columns.map(column => ({
                ...column,
                cards: column.cards.filter(card => card.projectId === selectedProjectId && !card.isArchived)
            })).filter(column => column.cards.length > 0 || columns.length <= 3); 
        }, [columns, selectedProjectId]);


        return {
            columns: filteredColumns,
            setColumns,
            users,
            setUsers: setUsersState, // Expose renamed setter
            tags,
            setTags: setTagsState, // Expose renamed setter
            archivedCards,
            setArchivedCards,
            selectedProjectId,
            setSelectedProjectId,
            projects: memoizedProjects,
            handleCompleteCard, 
            ...kanbanActions
        };
    };

    export default useKanbanData;
  