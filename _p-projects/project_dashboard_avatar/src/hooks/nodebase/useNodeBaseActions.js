
    import { useMemo, useCallback } from 'react';
    import useNodeCRUD from './actions/useNodeCRUD';
    import useNodeGrouping from './actions/useNodeGrouping';
    import useNodeLinking from './actions/useNodeLinking';
    import useNodeViewUtils from './actions/useNodeViewUtils';
    import useNodeWallActions from './actions/useNodeWallActions'; 
    import useBookmarkActions from './actions/useBookmarkActions'; 
    import useUndoRedo from './actions/useUndoRedo'; 

    const useNodeBaseActions = (coreState, selectionState, linkingState, projectFilter, allProjectsData) => {
      
      const actionCallbacks = useMemo(() => ({
        onNodeDataChange: () => {}, deleteSingleNode: () => {}, createTaskFromNode: () => {},
        setNodes: () => {}, setEdges: () => {}, getNodes: () => [], getEdges: () => [],
      }), []);

      const viewUtilsActions = useNodeViewUtils(coreState, selectionState);
      const crudActions = useNodeCRUD(coreState, selectionState, actionCallbacks);
      const linkingActions = useNodeLinking(coreState, linkingState, projectFilter, actionCallbacks);
      const groupingActions = useNodeGrouping(coreState, selectionState);
      const wallActions = useNodeWallActions(coreState, selectionState, allProjectsData); // Corrected: Pass selectionState
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

      const wrapWithUndoRecord = (actionFn) => {
        if (!actionFn) return () => console.warn("Attempted to wrap undefined action for undo/redo");
        return (...args) => {
            actionFn(...args);
            undoRedoActions.recordSnapshot();
        };
      };

      return {
        // CRUD Actions
        addNode: wrapWithUndoRecord(crudActions.addNode),
        deleteSelectedNodes: wrapWithUndoRecord(crudActions.deleteSelectedNodes),
        deleteSingleNode: wrapWithUndoRecord(crudActions.deleteSingleNode),

        // Grouping Actions
        groupSelectedNodes: wrapWithUndoRecord(groupingActions.groupSelectedNodes),
        ungroupSelectedNodes: wrapWithUndoRecord(groupingActions.ungroupSelectedNodes),
        
        // Linking Actions
        openLinkDialog: linkingActions.openLinkDialog,
        saveTaskLink: wrapWithUndoRecord(linkingActions.saveTaskLink),
        createTaskFromNode: wrapWithUndoRecord(linkingActions.createTaskFromNode),
        availableTasks: linkingActions.availableTasks,

        // View Utils Actions
        changeSelectedNodesColor: wrapWithUndoRecord(viewUtilsActions.changeSelectedNodesColor),
        onNodeDataChange: wrapWithUndoRecord(viewUtilsActions.onNodeDataChange),
        zoomToNode: viewUtilsActions.zoomToNode,
        zoomToFit: viewUtilsActions.zoomToFit,
        zoomIn: viewUtilsActions.zoomIn,
        zoomOut: viewUtilsActions.zoomOut,

        // Wall Actions
        addWall: wrapWithUndoRecord(wallActions.addWall),
        deleteWall: wrapWithUndoRecord(wallActions.deleteWall),
        renameWall: wrapWithUndoRecord(wallActions.renameWall),
        setCurrentWallId: wrapWithUndoRecord(coreState.setCurrentWallId), 
        assignProjectToWall: wrapWithUndoRecord(wallActions.assignProjectToWall),
        
        // Bookmark Actions
        addSelectedNodesToBookmarks: wrapWithUndoRecord(bookmarkActions.addSelectedNodesToBookmarks),
        removeBookmark: wrapWithUndoRecord(bookmarkActions.removeBookmark),
        zoomToBookmarkedNode: bookmarkActions.zoomToBookmarkedNode,
        bookmarkedNodes: bookmarkActions.bookmarkedNodes,

        // Undo/Redo Actions
        undo: undoRedoActions.undo,
        redo: undoRedoActions.redo,
        canUndo: undoRedoActions.canUndo,
        canRedo: undoRedoActions.canRedo,
        
        walls: coreState.walls, 
      };
    };

    export default useNodeBaseActions;
  