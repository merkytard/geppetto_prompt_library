
    import { useCallback } from 'react';
    import { useToast } from "@/components/ui/use-toast";

    const useNodeBaseWallManagement = (coreState, selectionState) => {
        const { walls, setWalls, currentWallId, setCurrentWallId, setAllNodes, setAllEdges } = coreState;
        const { setSelectedNodes } = selectionState;
        const { toast } = useToast();

        const selectWall = useCallback((wallId) => {
            if (walls.find(w => w.id === wallId)) {
                setCurrentWallId(wallId);
                setSelectedNodes([]); // Clear selection when changing walls
            } else {
                toast({ title: "Error", description: "Wall not found.", variant: "destructive" });
            }
        }, [walls, setCurrentWallId, setSelectedNodes, toast]);

        const addWall = useCallback((name, projectId = 'global') => { // Accept projectId
            const newWallId = `wall_${Date.now()}`;
            const newWall = { id: newWallId, name: name || `Wall ${walls.length + 1}`, projectId }; // Store projectId
            setWalls(prev => [...prev, newWall]);
            // Initialize nodes/edges for the new wall
            setAllNodes(prev => ({ ...prev, [newWallId]: [] }));
            setAllEdges(prev => ({ ...prev, [newWallId]: [] }));
            setCurrentWallId(newWallId); // Switch to the new wall
            toast({ title: "Wall Added", description: `Created and switched to wall "${newWall.name}".` });
        }, [walls.length, setWalls, setAllNodes, setAllEdges, setCurrentWallId, toast]);

        const deleteWall = useCallback((wallId) => {
            if (wallId === 'default') {
                toast({ title: "Delete Failed", description: "Cannot delete the default wall.", variant: "destructive" });
                return;
            }
            if (walls.length <= 1) {
                 toast({ title: "Delete Failed", description: "Cannot delete the last wall.", variant: "destructive" });
                 return;
            }

            const wallToDelete = walls.find(w => w.id === wallId);
            if (!wallToDelete) return;

            // Confirmation maybe? For now, just delete.
            setWalls(prev => prev.filter(w => w.id !== wallId));
            setAllNodes(prev => { const newState = { ...prev }; delete newState[wallId]; return newState; });
            setAllEdges(prev => { const newState = { ...prev }; delete newState[wallId]; return newState; });

            // Switch to default wall if the current one was deleted
            if (currentWallId === wallId) {
                setCurrentWallId('default');
            }
            toast({ title: "Wall Deleted", description: `Wall "${wallToDelete.name}" deleted.`, variant: "destructive" });

        }, [walls, currentWallId, setWalls, setAllNodes, setAllEdges, setCurrentWallId, toast]);

        const updateWallProject = useCallback((wallId, newProjectId) => {
            setWalls(prev => prev.map(w => w.id === wallId ? { ...w, projectId: newProjectId } : w));
            // Optionally update nodes within that wall if needed, though projectId on wall might suffice
            toast({ title: "Wall Project Updated", description: `Wall "${walls.find(w=>w.id===wallId)?.name}" assigned to project.` });
        }, [setWalls, walls, toast]);


        return {
            selectWall,
            addWall,
            deleteWall,
            updateWallProject, // Expose the new function
        };
    };

    export default useNodeBaseWallManagement;
  