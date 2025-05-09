
    import { useState, useCallback, useEffect } from 'react';
    import { useToast } from "@/components/ui/use-toast";

    const MAX_HISTORY_LENGTH = 20;

    const useUndoRedo = (coreState) => {
      const { 
        allNodes, setAllNodes, 
        allEdges, setAllEdges, 
        currentWallId, setCurrentWallId, 
        walls, setWalls, 
        bookmarkedNodeIds, setBookmarkedNodeIds 
      } = coreState;
      
      const { toast } = useToast();

      const getSnapshot = useCallback(() => {
        return {
          allNodes: JSON.parse(JSON.stringify(allNodes || {})),
          allEdges: JSON.parse(JSON.stringify(allEdges || {})),
          currentWallId: currentWallId,
          walls: JSON.parse(JSON.stringify(walls || [])),
          bookmarkedNodeIds: JSON.parse(JSON.stringify(bookmarkedNodeIds || [])),
        };
      }, [allNodes, allEdges, currentWallId, walls, bookmarkedNodeIds]);

      const [history, setHistory] = useState(() => [getSnapshot()]);
      const [currentIndex, setCurrentIndex] = useState(0);
      
      const applySnapshot = useCallback((snapshot) => {
        setAllNodes(snapshot.allNodes);
        setAllEdges(snapshot.allEdges);
        setCurrentWallId(snapshot.currentWallId);
        setWalls(snapshot.walls);
        setBookmarkedNodeIds(snapshot.bookmarkedNodeIds);
      }, [setAllNodes, setAllEdges, setCurrentWallId, setWalls, setBookmarkedNodeIds]);


      const recordSnapshot = useCallback(() => {
        const newSnapshot = getSnapshot();
        setHistory(prevHistory => {
          const newHistory = prevHistory.slice(0, currentIndex + 1);
          newHistory.push(newSnapshot);
          if (newHistory.length > MAX_HISTORY_LENGTH) {
            return newHistory.slice(newHistory.length - MAX_HISTORY_LENGTH);
          }
          return newHistory;
        });
        setCurrentIndex(prevIndex => Math.min(prevIndex + 1, MAX_HISTORY_LENGTH -1));
      }, [getSnapshot, currentIndex]);
      
      // Initialize history on mount or when core state is available
      useEffect(() => {
        if (allNodes && allEdges && walls && bookmarkedNodeIds && currentWallId) {
            const initialSnapshot = getSnapshot();
            setHistory([initialSnapshot]);
            setCurrentIndex(0);
        }
      }, []); // Run once on mount, or when core state items are first defined.

      const undo = useCallback(() => {
        if (currentIndex > 0) {
          const newIndex = currentIndex - 1;
          applySnapshot(history[newIndex]);
          setCurrentIndex(newIndex);
          toast({ title: "Undo Successful", description: "Last action reverted."});
        } else {
          toast({ title: "Nothing to Undo", description: "No previous actions in history.", variant: "default" });
        }
      }, [currentIndex, history, applySnapshot, toast]);

      const redo = useCallback(() => {
        if (currentIndex < history.length - 1) {
          const newIndex = currentIndex + 1;
          applySnapshot(history[newIndex]);
          setCurrentIndex(newIndex);
          toast({ title: "Redo Successful", description: "Last undone action restored."});
        } else {
           toast({ title: "Nothing to Redo", description: "No further actions in history.", variant: "default"});
        }
      }, [currentIndex, history, applySnapshot, toast]);

      const canUndo = currentIndex > 0;
      const canRedo = currentIndex < history.length - 1;

      return { undo, redo, recordSnapshot, canUndo, canRedo };
    };

    export default useUndoRedo;
  