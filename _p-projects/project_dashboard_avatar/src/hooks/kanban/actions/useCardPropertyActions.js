
    import { useCallback } from 'react';
    import { useToast } from "@/components/ui/use-toast";
    import { useNavigate } from 'react-router-dom';
    import { updateColumnsOnAssignUser, updateColumnsOnChangeColor } from '@/lib/kanbanActionHelpers';

    const useCardPropertyActions = (setColumns, users, updateCardData) => {
        const { toast } = useToast();
        const navigate = useNavigate();

        const handleAssignUser = useCallback((columnId, cardId, userId) => {
            setColumns(prevColumns => {
                const { updatedColumns, cardTitle } = updateColumnsOnAssignUser(prevColumns, columnId, cardId, userId);
                const user = users.find(u => u.id === userId);
                toast({ title: "User Assignment Updated", description: userId ? `User "${user?.name}" assignment updated for card "${cardTitle}".` : `User unassigned from card "${cardTitle}".` });
                return updatedColumns;
            });
        }, [setColumns, users, toast]);

        const handleChangeCardColor = useCallback((columnId, cardId, colorValue) => {
             setColumns(prevColumns => {
                 const { updatedColumns, cardTitle } = updateColumnsOnChangeColor(prevColumns, columnId, cardId, colorValue);
                 if (cardTitle) {
                     toast({ title: "Card Color Changed", description: `Color updated for card "${cardTitle}".` });
                 }
                 return updatedColumns;
             });
        }, [setColumns, toast]);

        const handleLinkToNode = useCallback((cardId, nodeId = null) => {
            if (nodeId) {
                updateCardData(cardId, { linkedNodeId: nodeId });
            } else {
                navigate(`/nodebase?linkingCardId=${cardId}`);
                toast({ title: "Select Node", description: "Navigate to NodeBase and select a node to link." });
            }
        }, [updateCardData, navigate, toast]);

        return { handleAssignUser, handleChangeCardColor, handleLinkToNode };
    };

    export default useCardPropertyActions;
  