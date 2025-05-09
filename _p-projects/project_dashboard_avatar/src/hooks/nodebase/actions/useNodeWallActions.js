
    import { useCallback } from 'react';
    import { useReactFlow } from 'reactflow';
    import { useToast } from "@/components/ui/use-toast";

    const useNodeWallActions = (coreState, selectionState, allProjectsData) => {
      const {
        walls, setWalls,
        currentWallId, setCurrentWallId,
        allNodes, setAllNodes,
        allEdges, setAllEdges,
      } = coreState;
      
      const reactFlowInstance = useReactFlow(); 
      const { toast } = useToast();

      const addWall = useCallback((name, projectId = 'global') => {
        const newWallId = `wall_${Date.now()}`;
        const newWall = { id: newWallId, name: name || `Wall ${walls.length + 1}`, projectId };
        setWalls(prev => [...prev, newWall]);
        setAllNodes(prev => ({ ...prev, [newWallId]: [] }));
        setAllEdges(prev => ({ ...prev, [newWallId]: [] }));
        setCurrentWallId(newWallId);
        if (selectionState && typeof selectionState.setSelectedNodes === 'function') {
            selectionState.setSelectedNodes([]);
        } else {
            console.warn("setSelectedNodes function not available in useNodeWallActions during addWall");
        }
        toast({ title: "Wall Added", description: `Wall "${newWall.name}" created.` });
        return newWallId;
      }, [walls, setWalls, setAllNodes, setAllEdges, setCurrentWallId, selectionState, toast]);

      const deleteWall = useCallback((wallIdToDelete) => {
        if (wallIdToDelete === 'default') {
          toast({ title: "Action Denied", description: "The default wall cannot be deleted.", variant: "destructive" });
          return;
        }
        if (walls.length <= 1) {
            toast({ title: "Action Denied", description: "Cannot delete the last wall.", variant: "destructive" });
            return;
        }

        const wallToDelete = walls.find(w => w.id === wallIdToDelete);
        setWalls(prev => prev.filter(wall => wall.id !== wallIdToDelete));
        setAllNodes(prev => {
          const { [wallIdToDelete]: _, ...rest } = prev;
          return rest;
        });
        setAllEdges(prev => {
          const { [wallIdToDelete]: _, ...rest } = prev;
          return rest;
        });

        if (currentWallId === wallIdToDelete) {
          setCurrentWallId('default');
        }
        toast({ title: "Wall Deleted", description: `Wall "${wallToDelete?.name || wallIdToDelete}" deleted.` });
      }, [walls, currentWallId, setCurrentWallId, setWalls, setAllNodes, setAllEdges, toast]);

      const renameWall = useCallback((wallIdToRename, newName) => {
        setWalls(prev => prev.map(wall =>
          wall.id === wallIdToRename ? { ...wall, name: newName } : wall
        ));
        toast({ title: "Wall Renamed", description: `Wall renamed to "${newName}".` });
      }, [setWalls, toast]);
      
      const assignProjectToWall = useCallback((wallId, projectId) => {
        setWalls(prevWalls => prevWalls.map(wall => 
            wall.id === wallId ? { ...wall, projectId: projectId } : wall
        ));
        const wall = walls.find(w=>w.id === wallId);
        const projectName = allProjectsData?.find(p=>p.id === projectId)?.name || projectId; // Use allProjectsData
        toast({ title: "Wall Project Updated", description: `Wall "${wall?.name}" assigned to project "${projectName}".`});
      }, [setWalls, walls, allProjectsData, toast]); // Added allProjectsData to dependencies


      return {
        addWall,
        deleteWall,
        renameWall,
        setCurrentWallId,
        assignProjectToWall,
      };
    };

    export default useNodeWallActions;
  