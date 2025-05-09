
    import { useCallback, useMemo } from 'react';
    import { useReactFlow, useStoreApi } from 'reactflow';
    import { useToast } from "@/components/ui/use-toast";

    const useNodeViewUtils = (coreState, selectionState) => {
        const {
            setAllNodes, setBookmarkedNodeIds, onNodesChange: coreOnNodesChange,
            currentWallId, allNodes, bookmarkedNodeIds, walls, getNodesWithCallbacks, setCurrentWallId
        } = coreState;
        const { selectedNodes } = selectionState || {};
        const reactFlowInstance = useReactFlow();
        const store = useStoreApi();
        const { toast } = useToast();


        const onNodeDataChange = useCallback((nodeId, newData) => {
            setAllNodes(prevAllNodes => {
                const wallNodes = prevAllNodes[currentWallId] || [];
                const updatedWallNodesRaw = wallNodes.map(node => {
                    if (node.id === nodeId) {
                        const updatedData = { ...node.data, ...newData };
                        const { onDataChange, deleteNode, createTaskFromNode, ...restData } = updatedData;
                        if (restData.details === undefined) restData.details = node.data.details || [];
                        if (restData.handles === undefined) restData.handles = node.data.handles || ['default_source', 'default_target'];
                        if (restData.wallId === undefined) restData.wallId = node.data.wallId || currentWallId;
                        if (restData.projectId === undefined) restData.projectId = node.data.projectId || walls.find(w => w.id === currentWallId)?.projectId || 'global';
                        return { ...node, data: restData };
                    }
                    return node;
                });
                 const updatedWallNodesWithCallbacks = getNodesWithCallbacks(updatedWallNodesRaw);
                return { ...prevAllNodes, [currentWallId]: updatedWallNodesWithCallbacks };
            });
        }, [setAllNodes, currentWallId, walls, getNodesWithCallbacks]);


        const zoomToNode = useCallback((nodeId) => {
             const { nodeInternals } = store.getState(); const node = nodeInternals.get(nodeId);
             if (!node) {
                 let targetWallId = null;
                 let targetNode = null;
                 for (const wallId in allNodes) {
                     targetNode = allNodes[wallId].find(n => n.id === nodeId);
                     if (targetNode) {
                         targetWallId = wallId;
                         break;
                     }
                 }

                 if (targetWallId && targetWallId !== currentWallId) {
                     setCurrentWallId(targetWallId);
                     toast({ title: "Switched Wall", description: `Moved to wall containing node ${nodeId.substring(0,6)}...` });
                 } else if (targetNode && reactFlowInstance && coreOnNodesChange) {
                      const { x, y } = targetNode.position;
                      reactFlowInstance.setCenter(x + (targetNode.width || 150) / 2, y + (targetNode.height || 50) / 2, { zoom: 1.5, duration: 500 });
                       setTimeout(() => {
                           const selectChange = [{ type: 'select', id: nodeId, selected: true }];
                           coreOnNodesChange(selectChange);
                           setTimeout(() => {
                               const deselectChange = [{ type: 'select', id: nodeId, selected: false }];
                               coreOnNodesChange(deselectChange);
                           }, 1500);
                       }, 100);
                 }
                 return;
             }

             if (reactFlowInstance && coreOnNodesChange) {
                 const { x, y } = node.positionAbsolute || node.position; const nodeWidth = node.width || 150; const nodeHeight = node.height || 50;
                 reactFlowInstance.setCenter(x + nodeWidth / 2, y + nodeHeight / 2, { zoom: 1.5, duration: 500 });
                 const selectChange = [{ type: 'select', id: nodeId, selected: true }];
                 coreOnNodesChange(selectChange);
                 setTimeout(() => {
                     const deselectChange = [{ type: 'select', id: nodeId, selected: false }];
                     coreOnNodesChange(deselectChange);
                 }, 1500);
             }
        }, [reactFlowInstance, store, coreOnNodesChange, allNodes, currentWallId, setCurrentWallId, toast]);


        const addSelectedNodesToBookmarks = useCallback(() => {
            if (!selectedNodes) return;
            const selectedIds = selectedNodes.map(n => n.id); if (selectedIds.length === 0) return;
            setBookmarkedNodeIds(prev => {
                const newBookmarks = [...prev]; let addedCount = 0;
                selectedIds.forEach(id => { if (!newBookmarks.includes(id)) { newBookmarks.push(id); addedCount++; } });
                if (addedCount > 0) { toast({ title: "Bookmarks Added", description: `${addedCount} node(s) added to Quick Focus Bookmarks.` }); }
                return newBookmarks;
            });
        }, [selectedNodes, setBookmarkedNodeIds, toast]);

        const removeBookmark = useCallback((nodeId) => {
            setBookmarkedNodeIds(prev => prev.filter(id => id !== nodeId));
            toast({ title: "Bookmark Removed", description: `Node ${nodeId.substring(0, 6)}... removed from bookmarks.` });
        }, [setBookmarkedNodeIds, toast]);

        const bookmarkedNodes = useMemo(() => {
             const allNodesFlat = Object.values(allNodes).flat();
             return getNodesWithCallbacks(bookmarkedNodeIds.map(id => allNodesFlat.find(n => n.id === id)).filter(Boolean));
        }, [bookmarkedNodeIds, allNodes, getNodesWithCallbacks]);

        return {
            onNodeDataChange,
            zoomToNode,
            addSelectedNodesToBookmarks,
            removeBookmark,
            bookmarkedNodes,
        };
    };

    export default useNodeViewUtils;
  