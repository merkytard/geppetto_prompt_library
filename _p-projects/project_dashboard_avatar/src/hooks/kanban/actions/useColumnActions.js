
    import { useCallback } from 'react';
    import { useToast } from "@/components/ui/use-toast";

    let colIdCounter = 10; // Consider moving to a more global counter if needed across hooks

    const useColumnActions = (setColumns) => {
        const { toast } = useToast();

        const handleAddColumn = useCallback((title) => {
            const newColumn = { id: `col-${Date.now()}-${colIdCounter++}`, title, cards: [] };
            setColumns((prevColumns) => [...prevColumns, newColumn]);
            toast({ title: "Column Added", description: `Column "${title}" created.` });
        }, [setColumns, toast]);

        const handleEditColumnTitle = useCallback((columnId, newTitle) => {
            setColumns((prevColumns) => prevColumns.map((col) => col.id === columnId ? { ...col, title: newTitle } : col));
            toast({ title: "Column Updated", description: `Column title changed to "${newTitle}".` });
        }, [setColumns, toast]);

        const handleDeleteColumn = useCallback((columnId) => {
            setColumns((prevColumns) => {
                const columnToDelete = prevColumns.find(col => col.id === columnId);
                if (!columnToDelete) return prevColumns;
                if (columnToDelete.cards.length > 0) {
                    toast({ title: "Delete Failed", description: "Cannot delete a column with cards.", variant: "destructive" });
                    return prevColumns;
                }
                toast({ title: "Column Deleted", description: `Column "${columnToDelete.title}" deleted.`, variant: "destructive" });
                return prevColumns.filter((col) => col.id !== columnId);
            });
        }, [setColumns, toast]);

        return { handleAddColumn, handleEditColumnTitle, handleDeleteColumn };
    };

    export default useColumnActions;
  