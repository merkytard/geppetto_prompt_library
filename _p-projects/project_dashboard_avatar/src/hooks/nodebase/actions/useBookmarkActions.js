
    import { useCallback, useMemo } from 'react';
    import { useToast } from "@/components/ui/use-toast";
    import { useReactFlow } from 'reactflow';

    const useBookmarkActions = (coreState, selectionState) => {
      const { bookmarkedNodeIds, setBookmarkedNodeIds, nodes, getNodesWithCallbacks } = coreState;
      const { selectedNodes } = selectionState;
      const { toast } = useToast();
      const { fitBounds, getViewport, setViewport } = useReactFlow();

      const bookmarkedNodes = useMemo(() => {
        if (!bookmarkedNodeIds || bookmarkedNodeIds.length === 0) return [];
        
        const allWallNodes = Object.values(coreState.allNodes).flat();
        const nodesWithCb = getNodesWithCallbacks(allWallNodes);

        return bookmarkedNodeIds
            .map(bookmark => {
                const node = nodesWithCb.find(n => n.id === bookmark.id);
                if (node) {
                    return { ...node, wallId: bookmark.wallId }; // Ensure wallId is part of the bookmarked node info
                }
                return null;
            })
            .filter(Boolean);
      }, [bookmarkedNodeIds, coreState.allNodes, getNodesWithCallbacks]);


      const addSelectedNodesToBookmarks = useCallback(() => {
        if (selectedNodes.length === 0) {
          toast({ title: "No Nodes Selected", description: "Please select nodes to bookmark.", variant: "default" });
          return;
        }
        const newBookmarks = selectedNodes
          .filter(node => !bookmarkedNodeIds.find(b => b.id === node.id && b.wallId === node.data.wallId))
          .map(node => ({ id: node.id, wallId: node.data.wallId, label: node.data.label || node.id }));
        
        if (newBookmarks.length === 0) {
            toast({ title: "Already Bookmarked", description: "Selected node(s) are already in bookmarks.", variant: "default" });
            return;
        }

        setBookmarkedNodeIds(prev => [...prev, ...newBookmarks]);
        toast({ title: "Nodes Bookmarked", description: `${newBookmarks.length} node(s) added to bookmarks.` });
      }, [selectedNodes, bookmarkedNodeIds, setBookmarkedNodeIds, toast]);

      const removeBookmark = useCallback((nodeId, wallId) => {
        setBookmarkedNodeIds(prev => prev.filter(b => !(b.id === nodeId && b.wallId === wallId)));
        toast({ title: "Bookmark Removed", description: `Node removed from bookmarks.` });
      }, [setBookmarkedNodeIds, toast]);

      const zoomToBookmarkedNode = useCallback(async (nodeId, wallId) => {
        if (coreState.currentWallId !== wallId) {
          await coreState.setCurrentWallId(wallId); 
        }
    
        // Add a small delay to allow React Flow to update with the new wall's nodes
        setTimeout(() => {
            const node = coreState.allNodes[wallId]?.find(n => n.id === nodeId);
            if (node && node.position && typeof node.width !== 'undefined' && typeof node.height !== 'undefined') {
                const x = node.position.x + node.width / 2;
                const y = node.position.y + node.height / 2;
                const zoom = 1.5; 
    
                setViewport({ x, y, zoom }, { duration: 500 });
            } else if (node && node.position) { // Fallback if width/height are not available
                 fitBounds({ x: node.position.x, y: node.position.y, width: 150, height: 50 }, { duration: 500, padding: 0.1 });
            } else {
                toast({ title: "Error", description: "Bookmarked node not found or has no position.", variant: "destructive" });
            }
        }, 100); // Adjust delay as needed
    }, [coreState.currentWallId, coreState.setCurrentWallId, coreState.allNodes, fitBounds, setViewport, toast]);


      return {
        bookmarkedNodes, // The actual node objects
        bookmarkedNodeIds, // Just the IDs with wallId
        addSelectedNodesToBookmarks,
        removeBookmark,
        zoomToBookmarkedNode,
      };
    };

    export default useBookmarkActions;
  