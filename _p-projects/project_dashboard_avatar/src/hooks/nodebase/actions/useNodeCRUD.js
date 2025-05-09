
    import { useCallback } from 'react';
    import { useReactFlow } from 'reactflow';
    import { useToast } from "@/components/ui/use-toast";

    let idCounter = 1;
    const getId = (type = 'node') => `${type}_${Date.now()}_${idCounter++}`;

    const useNodeCRUD = (coreState, selectionState, callbacks) => {
        const {
            setAllNodes, setAllEdges, setBookmarkedNodeIds,
            currentWallId, walls, getNodesWithCallbacks
        } = coreState;
        const { selectedNodes } = selectionState;
        const reactFlowInstance = useReactFlow();
        const { toast } = useToast();

        const addNode = useCallback((type, data = {}) => {
            const currentWallProjectId = walls.find(w => w.id === currentWallId)?.projectId || 'global';
            const baseData = { color: 'bg-background', details: [], handles: ['default_source', 'default_target'], wallId: currentWallId, projectId: currentWallProjectId };
            let specificData = {};
            switch(type) {
                case 'textNode': specificData = { label: 'New Text Node' }; break;
                case 'imageNode': specificData = { alt: 'Placeholder Image', imageDescription: 'Abstract colorful pattern' }; break;
                case 'detailedNode': specificData = { title: 'New Detailed Note', content: 'Add details here...' }; break;
                case 'outputNode': specificData = { title: 'New Task Output', description: '' }; break;
                default: specificData = { label: 'New Node' };
            }

            const newNodeRaw = {
                id: getId(type), type, data: { ...baseData, ...specificData, ...data },
                position: reactFlowInstance.screenToFlowPosition({ x: window.innerWidth / 2 + Math.random() * 100 - 50, y: window.innerHeight / 3 + Math.random() * 100 - 50 }),
            };

            const newNodeWithCallbacks = getNodesWithCallbacks([newNodeRaw])[0];

            setAllNodes(prevAllNodes => {
                const wallNodes = prevAllNodes[currentWallId] || [];
                const updatedWallNodes = [...wallNodes, newNodeWithCallbacks];
                return { ...prevAllNodes, [currentWallId]: updatedWallNodes };
            });

            toast({ title: "Node Added", description: `Added ${type}.` });
        }, [reactFlowInstance, currentWallId, walls, setAllNodes, toast, getNodesWithCallbacks]);

        const deleteSingleNode = useCallback((nodeIdToDelete) => {
            setAllNodes(prevAllNodes => {
                const wallNodes = prevAllNodes[currentWallId] || [];
                const updatedWallNodes = wallNodes.filter(node => node.id !== nodeIdToDelete);
                return { ...prevAllNodes, [currentWallId]: updatedWallNodes };
            });
            setAllEdges((prevAllEdges) => {
                 const wallEdges = prevAllEdges[currentWallId] || [];
                 const updatedWallEdges = wallEdges.filter((edge) => edge.source !== nodeIdToDelete && edge.target !== nodeIdToDelete);
                 return { ...prevAllEdges, [currentWallId]: updatedWallEdges };
            });
            setBookmarkedNodeIds((prev) => prev.filter(id => id !== nodeIdToDelete));
            toast({ title: "Node deleted", description: `Node ${nodeIdToDelete.substring(0, 6)}... removed.`, variant: "destructive" });
        }, [setAllNodes, setAllEdges, currentWallId, setBookmarkedNodeIds, toast]);

        const deleteSelectedNodes = useCallback(() => {
            const selectedNodeIds = selectedNodes.map(n => n.id);
            if (selectedNodeIds.length === 0) return;

            setAllNodes(prevAllNodes => {
                const wallNodes = prevAllNodes[currentWallId] || [];
                const updatedWallNodes = wallNodes.filter(node => !selectedNodeIds.includes(node.id));
                return { ...prevAllNodes, [currentWallId]: updatedWallNodes };
            });

            setAllEdges((prevAllEdges) => {
                 const wallEdges = prevAllEdges[currentWallId] || [];
                 const updatedWallEdges = wallEdges.filter((edge) => !selectedNodeIds.includes(edge.source) && !selectedNodeIds.includes(edge.target));
                 return { ...prevAllEdges, [currentWallId]: updatedWallEdges };
            });

            setBookmarkedNodeIds((prev) => prev.filter(id => !selectedNodeIds.includes(id)));
            toast({ title: `${selectedNodeIds.length} Node(s) deleted`, variant: "destructive" });
        }, [selectedNodes, setAllNodes, setAllEdges, currentWallId, setBookmarkedNodeIds, toast]);

        const changeSelectedNodesColor = useCallback((colorValue) => {
            const selectedNodeIds = selectedNodes.map(n => n.id);
            if (selectedNodeIds.length === 0) return;

            setAllNodes(prevAllNodes => {
                const wallNodes = prevAllNodes[currentWallId] || [];
                const updatedWallNodesRaw = wallNodes.map(node =>
                    selectedNodeIds.includes(node.id) ? { ...node, data: { ...node.data, color: colorValue } } : node
                );
                const updatedWallNodesWithCallbacks = getNodesWithCallbacks(updatedWallNodesRaw);
                return { ...prevAllNodes, [currentWallId]: updatedWallNodesWithCallbacks };
            });
        }, [selectedNodes, setAllNodes, currentWallId, getNodesWithCallbacks]);

        return {
            addNode,
            deleteSingleNode,
            deleteSelectedNodes,
            changeSelectedNodesColor,
        };
    };

    export default useNodeCRUD;
  