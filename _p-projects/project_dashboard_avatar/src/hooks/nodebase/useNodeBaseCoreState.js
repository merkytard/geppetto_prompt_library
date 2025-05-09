
    import { useState, useEffect, useRef, useCallback } from 'react';
    import { useReactFlow, applyNodeChanges, applyEdgeChanges } from 'reactflow';
    import usePersistentState from '@/hooks/usePersistentState';
    import { useDebouncedCallback } from 'use-debounce';

    export const initialNodesData = { default: [{ id: 'node_0_default_initial', type: 'textNode', position: { x: 150, y: 150 }, data: { label: 'Welcome to NodeBase!', color: 'bg-primary', details: ['Drag to move', 'Click to select'], handles: ['default_source', 'default_target'], wallId: 'default', projectId: 'global' } }] };
    export const initialEdgesData = { default: [] };
    export const initialBookmarksData = [];
    export const initialWallsData = [{ id: 'default', name: 'Main Wall', projectId: 'global' }];

    const useNodeBaseCoreState = (callbacks) => {
      const [allNodes, setAllNodesInternal] = usePersistentState('nodebaseAllNodes_v4', initialNodesData);
      const [allEdges, setAllEdgesInternal] = usePersistentState('nodebaseAllEdges_v4', initialEdgesData);
      const [bookmarkedNodeIds, setBookmarkedNodeIdsInternal] = usePersistentState('nodebaseBookmarks_v4', initialBookmarksData);
      const [walls, setWallsInternal] = usePersistentState('nodebaseWalls_v4', initialWallsData);
      const [currentWallId, setCurrentWallIdInternal] = usePersistentState('nodebaseCurrentWall_v4', 'default');
      
      const reactFlowInstance = useReactFlow();
      const wallViewports = useRef({});
      const flowInitializedForWall = useRef({});

      const [nodes, setNodesLocal] = useState([]);
      const [edges, setEdgesLocal] = useState([]);
      const isInternalUpdate = useRef(false);
      const isFirstLoadForWall = useRef(true);

      const setAllNodes = useCallback((updater) => {
        setAllNodesInternal(prev => {
          const newState = typeof updater === 'function' ? updater(prev) : updater;
          return newState;
        });
      }, [setAllNodesInternal]);
      
      const setAllEdges = useCallback((updater) => {
        setAllEdgesInternal(prev => {
          const newState = typeof updater === 'function' ? updater(prev) : updater;
          return newState;
        });
      }, [setAllEdgesInternal]);

      const setWalls = useCallback((updater) => {
        setWallsInternal(prev => {
          const newState = typeof updater === 'function' ? updater(prev) : updater;
          return newState;
        });
      }, [setWallsInternal]);

      const setBookmarkedNodeIds = useCallback((updater) => {
        setBookmarkedNodeIdsInternal(prev => {
          const newState = typeof updater === 'function' ? updater(prev) : updater;
          return newState;
        });
      }, [setBookmarkedNodeIdsInternal]);
      
      const setCurrentWallId = useCallback((updater) => {
        setCurrentWallIdInternal(prev => {
          const newId = typeof updater === 'function' ? updater(prev) : updater;
          if (prev !== newId) { 
            isFirstLoadForWall.current = true; 
            flowInitializedForWall.current[newId] = false;
          }
          return newId;
        });
      }, [setCurrentWallIdInternal]);


      useEffect(() => {
        let wallIdToUse = currentWallId;
        let shouldUpdateWallId = false;

        const wallExists = walls.some(w => w.id === wallIdToUse);
        if (!wallExists) {
            wallIdToUse = 'default';
            shouldUpdateWallId = true;
        }
        
        setAllNodes(prev => {
            let updated = false; 
            const newState = JSON.parse(JSON.stringify(prev || {})); 
            if (!newState.default || !Array.isArray(newState.default) || newState.default.length === 0) { 
              newState.default = JSON.parse(JSON.stringify(initialNodesData.default)); 
              updated = true; 
            }
            if (!newState[wallIdToUse] || !Array.isArray(newState[wallIdToUse])) { 
              newState[wallIdToUse] = (wallIdToUse === 'default' && newState.default && newState.default.length > 0) ? JSON.parse(JSON.stringify(newState.default)) : []; 
              updated = true; 
            }
            return updated ? newState : prev;
        });

         setAllEdges(prev => {
            let updated = false; 
            const newState = JSON.parse(JSON.stringify(prev || {}));
            if (!newState.default || !Array.isArray(newState.default)) { newState.default = JSON.parse(JSON.stringify(initialEdgesData.default)); updated = true; }
            if (!newState[wallIdToUse] || !Array.isArray(newState[wallIdToUse])) { newState[wallIdToUse] = []; updated = true; }
             return updated ? newState : prev;
         });

         setWalls(prev => {
             const currentWalls = prev || [];
             const defaultWallIndex = currentWalls.findIndex(w => w.id === 'default');
             if (defaultWallIndex === -1) { return [JSON.parse(JSON.stringify(initialWallsData[0])), ...currentWalls]; }
             else if (!currentWalls[defaultWallIndex].projectId) { return currentWalls.map(w => w.id === 'default' ? { ...w, projectId: 'global' } : w); }
             return currentWalls;
         });

         if (shouldUpdateWallId && currentWallId !== wallIdToUse) { 
            setCurrentWallId(wallIdToUse); 
         }
    }, [currentWallId, walls, setCurrentWallId, setAllNodes, setAllEdges, setWalls]);


      const getNodesWithCallbacks = useCallback((wallNodes) => {
          if (!wallNodes || !callbacks || !callbacks.onNodeDataChange || !callbacks.deleteSingleNode || !callbacks.createTaskFromNode) {
            return wallNodes || [];
          }
          const currentWallData = walls.find(w => w.id === currentWallId);
          const currentWallProjectId = currentWallData?.projectId || 'global';

          return wallNodes.map(node => ({
              ...node,
              id: node.id || `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              position: node.position || { x: Math.random() * 400 + 50, y: Math.random() * 400 + 50 },
              data: {
                  ...(node.data || {}),
                  onDataChange: callbacks.onNodeDataChange,
                  deleteNode: callbacks.deleteSingleNode,
                  createTaskFromNode: callbacks.createTaskFromNode,
                  details: node.data?.details || [],
                  handles: node.data?.handles || ['default_source', 'default_target'],
                  wallId: node.data?.wallId || currentWallId,
                  projectId: node.data?.projectId || currentWallProjectId,
              }
          }));
      }, [callbacks, currentWallId, walls]);


      useEffect(() => {
        isInternalUpdate.current = true;
        const nodesFromStorage = allNodes?.[currentWallId] || [];
        const edgesFromStorage = allEdges?.[currentWallId] || [];
      
        setNodesLocal(getNodesWithCallbacks(nodesFromStorage));
        setEdgesLocal(edgesFromStorage);
        
        const attemptFitView = () => {
            if (reactFlowInstance && reactFlowInstance.getNodes) {
                const currentFlowNodes = reactFlowInstance.getNodes();
                const savedViewport = wallViewports.current[currentWallId];

                if (currentFlowNodes.length > 0) {
                    if (savedViewport && flowInitializedForWall.current[currentWallId] && !isFirstLoadForWall.current) {
                         reactFlowInstance.setViewport(savedViewport, { duration: 80 }); 
                    } else {
                        reactFlowInstance.fitView({ duration: 200, padding: 0.2 }); 
                        flowInitializedForWall.current[currentWallId] = true;
                        isFirstLoadForWall.current = false;
                    }
                } else { 
                    reactFlowInstance.setViewport({ x: 0, y: 0, zoom: 1 }, { duration: 80 });
                    flowInitializedForWall.current[currentWallId] = true;
                    isFirstLoadForWall.current = false;
                }
            }
            setTimeout(() => { isInternalUpdate.current = false; }, 100); 
        };
        
        const fitViewTimeoutId = setTimeout(attemptFitView, 200); 
        return () => clearTimeout(fitViewTimeoutId);

    }, [currentWallId, allNodes, allEdges, reactFlowInstance, getNodesWithCallbacks]);


      const debouncedPersistChanges = useDebouncedCallback(({ nodes: currentFlowNodes, edges: currentFlowEdges }) => {
          if (!currentWallId) return;

          const nodesToSave = currentFlowNodes.map(({ data: { onDataChange, deleteNode, createTaskFromNode, ...restData }, ...node }) => ({ ...node, data: restData }));

          setAllNodes(prev => ({ ...prev, [currentWallId]: nodesToSave }));
          setAllEdges(prev => ({ ...prev, [currentWallId]: currentFlowEdges }));
          
          if (reactFlowInstance && reactFlowInstance.getViewport) {
            wallViewports.current[currentWallId] = reactFlowInstance.getViewport();
          }
      }, 300);


      const onNodesChange = useCallback((changes) => {
          if (isInternalUpdate.current) return;
          setNodesLocal((nds) => {
              const changedNodes = applyNodeChanges(changes, nds);
              debouncedPersistChanges({ nodes: changedNodes, edges: edges });
              return changedNodes;
          });
      }, [setNodesLocal, edges, debouncedPersistChanges]); 

      const onEdgesChange = useCallback((changes) => {
          if (isInternalUpdate.current) return;
          setEdgesLocal((eds) => {
              const changedEdges = applyEdgeChanges(changes, eds);
              debouncedPersistChanges({ nodes: nodes, edges: changedEdges });
              return changedEdges;
          });
      }, [setEdgesLocal, nodes, debouncedPersistChanges]); 

      return {
        nodes: nodes, setNodes: setNodesLocal, onNodesChange,
        edges: edges, setEdges: setEdgesLocal, onEdgesChange,
        bookmarkedNodeIds, setBookmarkedNodeIds,
        walls, setWalls,
        currentWallId, setCurrentWallId,
        allNodes, setAllNodes,
        allEdges, setAllEdges,
        getNodesWithCallbacks,
      };
    };

    export default useNodeBaseCoreState;
  