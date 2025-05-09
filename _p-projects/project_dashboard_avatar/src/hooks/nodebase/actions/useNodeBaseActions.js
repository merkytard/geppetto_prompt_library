
    import { useMemo, useCallback } from 'react';
    import useNodeCRUD from './useNodeCRUD';
    import useNodeGrouping from './useNodeGrouping';
    import useNodeLinking from './useNodeLinking';
    import useNodeViewUtils from './useNodeViewUtils';
    import useNodeWallActions from './useNodeWallActions'; 
    import useBookmarkActions from './useBookmarkActions'; 
    import useUndoRedo from './useUndoRedo'; 

    const useNodeBaseActions = (coreState, selectionState, linkingState, projectFilter, allProjectsData) => {
      
      const actionCallbacks = useMemo(() => ({
        onNodeDataChange: () => {}, deleteSingleNode: () => {}, createTaskFromNode: () => {},
        setNodes: () => {}, setEdges: () => {}, getNodes: () => [], getEdges: () => [],
      }), []);

      const viewUtilsActions = useNodeViewUtils(coreState, selectionState);
      const crudActions = useNodeCRUD(coreState, selectionState, actionCallbacks);
      const linkingActions = useNodeLinking(coreState, linkingState, projectFilter, actionCallbacks);
      const groupingActions = useNodeGrouping(coreState, selectionState);
      const wallActions = useNodeWallActions(coreState, selectionState, allProjectsData); 
      const bookmarkActions = useBookmarkActions(coreState, selectionState);
      const undoRedoActions = useUndoRedo(coreState);
      
      actionCallbacks.onNodeDataChange = useCallback((nodeId, data) => {
          if (viewUtilsActions.onNodeDataChange) {
            viewUtilsActions.onNodeDataChange(nodeId, data);
          }
      }, [viewUtilsActions]);

      actionCallbacks.deleteSingleNode = useCallback((nodeId) => {
          if (crudActions.deleteSingleNode) {
            crudActions.deleteSingleNode(nodeId);
          }
      }, [crudActions]);
      
      actionCallbacks.createTaskFromNode = useCallback((nodeId, taskData) => {
          if (linkingActions.createTaskFromNode) {
            linkingActions.createTaskFromNode(nodeId, taskData);
          }
      }, [linkingActions]);

      actionCallbacks.setNodes = coreState.setNodes;
      actionCallbacks.setEdges = coreState.setEdges;
      actionCallbacks.getNodes = useCallback(() => coreState.nodes, [coreState.nodes]);
      actionCallbacks.getEdges = useCallback(() => coreState.edges, [coreState.edges]);


      return {
        ...crudActions, ...groupingActions, ...linkingActions, ...viewUtilsActions,
        ...wallActions, ...bookmarkActions, ...undoRedoActions,
      };
    };

    export default useNodeBaseActions;
  