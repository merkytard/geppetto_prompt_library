
    import { useCallback } from 'react';
    import { useReactFlow } from 'reactflow';
    import { useToast } from "@/components/ui/use-toast";

    let groupIdCounter = 1;
    const getGroupId = () => `group_${Date.now()}_${groupIdCounter++}`;

    const useNodeGrouping = (coreState, selectionState) => {
        const { setAllNodes, currentWallId, getNodesWithCallbacks } = coreState;
        const { selectedNodes } = selectionState;
        const reactFlowInstance = useReactFlow();
        const { toast } = useToast();

        const groupSelectedNodes = useCallback(() => {
            if (selectedNodes.length < 2) {
                toast({ title: "Grouping Error", description: "Select at least two nodes to group.", variant: "destructive" });
                return;
            }

            const selectedNodeIds = selectedNodes.map(n => n.id);
            const newGroupId = getGroupId();

            // Calculate bounding box for the group
            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
            selectedNodes.forEach(node => {
                minX = Math.min(minX, node.position.x);
                minY = Math.min(minY, node.position.y);
                maxX = Math.max(maxX, node.position.x + (node.width || 150)); // Use actual width or default
                maxY = Math.max(maxY, node.position.y + (node.height || 50)); // Use actual height or default
            });

            const padding = 40;
            const groupNode = {
                id: newGroupId,
                type: 'group',
                position: { x: minX - padding, y: minY - padding },
                data: { label: `Group ${groupIdCounter -1}` },
                style: {
                    width: maxX - minX + padding * 2,
                    height: maxY - minY + padding * 2,
                    backgroundColor: 'rgba(100, 100, 200, 0.1)',
                    borderColor: 'rgba(100, 100, 200, 0.5)',
                    borderWidth: 1,
                    borderRadius: 8,
                },
            };

            setAllNodes(prevAllNodes => {
                const wallNodes = prevAllNodes[currentWallId] || [];
                const updatedWallNodesRaw = wallNodes.map(node =>
                    selectedNodeIds.includes(node.id) ? { ...node, parentNode: newGroupId, extent: 'parent' } : node
                );
                const nodesWithGroup = [...updatedWallNodesRaw, groupNode];
                const nodesWithCallbacks = getNodesWithCallbacks(nodesWithGroup);
                return { ...prevAllNodes, [currentWallId]: nodesWithCallbacks };
            });

            toast({ title: "Nodes Grouped", description: `${selectedNodes.length} nodes added to a new group.` });
        }, [selectedNodes, setAllNodes, currentWallId, reactFlowInstance, toast, getNodesWithCallbacks]);


        const ungroupSelectedNodes = useCallback(() => {
            const groupNodes = selectedNodes.filter(node => node.type === 'group');
            if (groupNodes.length === 0) {
                toast({ title: "Ungrouping Error", description: "No group selected to ungroup.", variant: "destructive" });
                return;
            }

            const groupIds = groupNodes.map(g => g.id);

            setAllNodes(prevAllNodes => {
                const wallNodes = prevAllNodes[currentWallId] || [];
                // Remove parentNode and extent from child nodes, and filter out the group nodes themselves
                const updatedWallNodesRaw = wallNodes
                    .map(node => groupIds.includes(node.parentNode) ? { ...node, parentNode: undefined, extent: undefined } : node)
                    .filter(node => !(node.type === 'group' && groupIds.includes(node.id)));

                const nodesWithCallbacks = getNodesWithCallbacks(updatedWallNodesRaw);
                return { ...prevAllNodes, [currentWallId]: nodesWithCallbacks };
            });

            toast({ title: "Nodes Ungrouped", description: `Nodes from ${groupIds.length} group(s) have been ungrouped.` });
        }, [selectedNodes, setAllNodes, currentWallId, toast, getNodesWithCallbacks]);


        return {
            groupSelectedNodes,
            ungroupSelectedNodes,
        };
    };

    export default useNodeGrouping;
  