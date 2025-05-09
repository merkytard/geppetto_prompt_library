
    import { useCallback, useMemo } from 'react';
    import { useToast } from "@/components/ui/use-toast";
    import useKanbanData from '@/hooks/useKanbanData';

    const useNodeLinking = (coreState, linkingState, projectFilter, callbacks) => {
        const { currentWallId, walls, allNodes } = coreState;
        const { linkingNodeId, setLinkingNodeId, setIsLinkDialogOpen } = linkingState;
        const { updateCardData, handleAddCard, columns: kanbanColumns } = useKanbanData();
        const { toast } = useToast();
        const { onNodeDataChange } = callbacks;

        const openLinkDialog = useCallback((nodeId) => {
            setLinkingNodeId(nodeId);
            setIsLinkDialogOpen(true);
        }, [setLinkingNodeId, setIsLinkDialogOpen]);

        const saveTaskLink = useCallback((taskId) => {
            if (!linkingNodeId || !onNodeDataChange) return;
            onNodeDataChange(linkingNodeId, { linkedTaskId: taskId || null });

            if (updateCardData && kanbanColumns) {
                const allCards = kanbanColumns.flatMap(col => col.cards);
                allCards.forEach(card => {
                    if (card.linkedNodeId === linkingNodeId && card.id !== taskId) {
                        updateCardData(card.id, { linkedNodeId: null });
                    }
                });
                if(taskId) {
                    updateCardData(taskId, { linkedNodeId: linkingNodeId });
                }
                toast({ title: taskId ? "Task Linked" : "Task Unlinked", description: `Node ${linkingNodeId.substring(0,6)}... ${taskId ? 'linked to' : 'unlinked from'} task.` });
            } else { console.warn("updateCardData function or kanbanColumns not available from useKanbanData"); }
            setIsLinkDialogOpen(false); setLinkingNodeId(null);
        }, [linkingNodeId, onNodeDataChange, updateCardData, kanbanColumns, toast, setIsLinkDialogOpen, setLinkingNodeId]);

        const availableTasks = useMemo(() => {
            if (!kanbanColumns) return [];
            const tasks = kanbanColumns.flatMap(col => col.cards);
            const currentWallProjectId = walls.find(w => w.id === currentWallId)?.projectId || 'global';

            if (currentWallProjectId === 'global') {
                return tasks.map(card => ({ id: card.id, title: card.title }));
            }
            return tasks.filter(card => card.projectId === currentWallProjectId).map(card => ({ id: card.id, title: card.title }));
        }, [kanbanColumns, currentWallId, walls]);

        const createTaskFromNode = useCallback((nodeId) => {
            const node = (allNodes[currentWallId] || []).find(n => n.id === nodeId);
            if (!node || !handleAddCard || !onNodeDataChange) {
                toast({ title: "Error", description: "Could not find node, Kanban action, or update function.", variant: "destructive" }); return;
            }
            if (!kanbanColumns || kanbanColumns.length === 0) {
                toast({ title: "Error", description: "No Kanban columns found to add task.", variant: "destructive" }); return;
            }

            const targetColumnId = kanbanColumns[0].id;
            const nodeProjectId = node.data.projectId || 'global';

            const cardData = {
                title: node.data.title || node.data.label || 'Task from Node',
                description: node.data.description || node.data.content || `Created from NodeBase node ${nodeId.substring(0, 6)}...`,
                type: 'TASK', tags: ['NodeBase'], linkedNodeId: nodeId,
                projectId: nodeProjectId !== 'global' ? nodeProjectId : null,
            };

            const newCardId = handleAddCard(targetColumnId, cardData);
            if (newCardId) {
               onNodeDataChange(nodeId, { linkedTaskId: newCardId });
               toast({ title: "Task Created", description: `Task "${cardData.title}" created in Kanban and linked.` });
            } else {
               toast({ title: "Error", description: "Failed to create task in Kanban.", variant: "destructive"});
            }

        }, [allNodes, currentWallId, handleAddCard, kanbanColumns, toast, onNodeDataChange]);

        return {
            openLinkDialog,
            saveTaskLink,
            availableTasks,
            createTaskFromNode,
        };
    };

    export default useNodeLinking;
  