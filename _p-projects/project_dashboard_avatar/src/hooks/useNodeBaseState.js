
    import { useMemo, useEffect } from 'react';
    import { useReactFlow } from 'reactflow';
    import useNodeBaseCoreState from '@/hooks/nodebase/useNodeBaseCoreState';
    import useNodeBaseSelectionState from '@/hooks/nodebase/useNodeBaseSelectionState';
    import useNodeBaseLinkingState from '@/hooks/nodebase/useNodeBaseLinkingState';
    import useNodeBaseActions from '@/hooks/nodebase/useNodeBaseActions';
    import useNodeBaseEventHandlers from '@/hooks/nodebase/useNodeBaseEventHandlers';
    import useProjects from '@/hooks/useProjects';
    import { useToast } from "@/components/ui/use-toast";

    const useNodeBaseState = (projectFilter) => {
      const { toast } = useToast();
      const reactFlowInstance = useReactFlow();
      const { projects: allGlobalProjects } = useProjects();

      const actionCallbacks = useMemo(() => ({
        onNodeDataChange: (nodeId, data) => {
          console.warn("Default onNodeDataChange called.", nodeId, data);
        },
        deleteSingleNode: (nodeId) => {
          console.warn("Default deleteSingleNode called.", nodeId);
        },
        createTaskFromNode: (nodeId, nodeLabel) => {
            console.warn("Default createTaskFromNode called.", nodeId, nodeLabel);
        },
      }), []);

      const coreState = useNodeBaseCoreState(actionCallbacks);
      const selectionState = useNodeBaseSelectionState();
      const linkingState = useNodeBaseLinkingState();
      
      // Pass allGlobalProjects to useNodeBaseActions
      const combinedActions = useNodeBaseActions(coreState, selectionState, linkingState, projectFilter, allGlobalProjects);
      
      useEffect(() => {
        if (combinedActions.onNodeDataChange) {
            actionCallbacks.onNodeDataChange = combinedActions.onNodeDataChange;
        }
        if (combinedActions.deleteSingleNode) {
            actionCallbacks.deleteSingleNode = combinedActions.deleteSingleNode;
        }
        if (combinedActions.createTaskFromNode) {
            actionCallbacks.createTaskFromNode = combinedActions.createTaskFromNode;
        }
      }, [combinedActions, actionCallbacks]);


      const eventHandlers = useNodeBaseEventHandlers(coreState, selectionState);

      const filteredNodes = useMemo(() => {
        const currentWall = coreState.walls.find(w => w.id === coreState.currentWallId);
        if (!currentWall) return [];

        const wallProjectId = currentWall.projectId || 'global';
        let nodesForCurrentWall = coreState.nodes; 
        
        if (projectFilter === 'all') { 
            if (wallProjectId === 'global') { 
                return nodesForCurrentWall; 
            }
            return nodesForCurrentWall; 
        }
        if (wallProjectId === 'global') { 
            return nodesForCurrentWall.filter(node => node.data.projectId === projectFilter); 
        }
        if (wallProjectId !== projectFilter) { 
            return [];
        }
        return nodesForCurrentWall;

      }, [coreState.nodes, coreState.currentWallId, coreState.walls, projectFilter]);


       const wallsWithProjectNames = useMemo(() => {
           return coreState.walls.map(wall => {
               const project = allGlobalProjects.find(p => p.id === wall.projectId);
               return {
                   ...wall,
                   projectName: project ? project.name : (wall.projectId === 'global' || !wall.projectId ? 'Global' : 'Unknown Project'),
               };
           });
       }, [coreState.walls, allGlobalProjects]);


      useEffect(() => {
        if (combinedActions && combinedActions.recordSnapshot && combinedActions.canUndo !== undefined) { 
          combinedActions.recordSnapshot(); 
        }
      }, [combinedActions]);


      return {
        nodes: filteredNodes,
        edges: coreState.edges, 
        onNodesChange: coreState.onNodesChange,
        onEdgesChange: coreState.onEdgesChange,
        
        walls: wallsWithProjectNames, 
        currentWallId: coreState.currentWallId,
        
        selectedNodes: selectionState.selectedNodes,
        setSelectedNodes: selectionState.setSelectedNodes, 
        
        linkingNodeId: linkingState.linkingNodeId,
        setLinkingNodeId: linkingState.setLinkingNodeId,
        isLinkDialogOpen: linkingState.isLinkDialogOpen,
        setIsLinkDialogOpen: linkingState.setIsLinkDialogOpen,
        
        actions: combinedActions, 
        
        ...eventHandlers, 
      };
    };

    export default useNodeBaseState;
  