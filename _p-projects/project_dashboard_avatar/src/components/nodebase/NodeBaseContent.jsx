
    import React from 'react';
    import { useReactFlow } from 'reactflow';
    import NodeBaseFlow from '@/components/nodebase/NodeBaseFlow';
    import NodeBaseToolbar from '@/components/nodebase/NodeBaseToolbar';
    import NodeHierarchyPanel from '@/components/nodebase/NodeHierarchyPanel';
    import LinkTaskDialog from '@/components/nodebase/LinkTaskDialog';
    import useNodeBaseState from '@/hooks/useNodeBaseState';
    import { useToast } from "@/components/ui/use-toast";
    import { cn } from '@/lib/utils';
    import { motion, AnimatePresence } from 'framer-motion';
    import TextNode from '@/components/nodes/TextNode';
    import ImageNode from '@/components/nodes/ImageNode';
    import DetailedNode from '@/components/nodes/DetailedNode';
    import OutputNode from '@/components/nodes/OutputNode';

    const nodeTypes = {
        textNode: TextNode,
        imageNode: ImageNode,
        detailedNode: DetailedNode,
        outputNode: OutputNode,
    };


    const NodeBaseContent = ({ projectFilter, isSidebarOpen }) => {
        const reactFlowInstance = useReactFlow(); // Keep if needed for direct instance access
        const { toast } = useToast(); // Keep if needed for local toasts

        const {
            nodes, edges, walls, currentWallId,
            selectedNodes, // Use selectedNodes directly
            linkingNodeId, isLinkDialogOpen,
            bookmarkedNodeIds, bookmarkedNodes,
            setNodes, setEdges, onNodesChange, onEdgesChange,
            selectWall, addWall, deleteWall, // Use wall actions from hook
            setSelectedNodes, setLinkingNodeId, setIsLinkDialogOpen,
            setBookmarkedNodeIds,
            handleSelectionChange, handleConnect,
            onNodeDataChange, deleteSingleNode, addNode, deleteSelectedNodes,
            changeSelectedNodesColor, groupSelectedNodes, ungroupSelectedNodes,
            openLinkDialog, saveTaskLink, availableTasks, createTaskFromNode,
            zoomToNode, addSelectedNodesToBookmarks, removeBookmark,
        } = useNodeBaseState(projectFilter); // Pass projectFilter to the hook

        // Filter nodes and edges based on currentWallId (already done inside useNodeBaseState effect, but keep for clarity if needed)
        // const filteredNodes = React.useMemo(() => nodes, [nodes]); // Nodes are already filtered by the hook's effect
        // const filteredEdges = React.useMemo(() => edges, [edges]); // Edges are already filtered by the hook's effect

        // Inject data change callbacks - This is now handled within useNodeBaseState hook
        // const nodesWithCallbacks = React.useMemo(() => { ... }, [nodes, ...]);


        return (
            <div className="flex h-full">
                <AnimatePresence>
                    {isSidebarOpen && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: '280px', opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="h-full border-r overflow-hidden flex-shrink-0"
                        >
                           <NodeBaseToolbar
                               onAddNode={addNode}
                               selectedNodesCount={selectedNodes.length} // Use selectedNodes.length
                               onChangeColor={changeSelectedNodesColor}
                               onGroupNodes={groupSelectedNodes}
                               onDeleteNodes={deleteSelectedNodes}
                               onOpenLinkDialog={selectedNodes.length === 1 ? () => openLinkDialog(selectedNodes[0].id) : undefined}
                               walls={walls}
                               currentWallId={currentWallId}
                               onSelectWall={selectWall} // Use selectWall from hook
                               onAddWall={addWall} // Use addWall from hook
                               onDeleteWall={deleteWall} // Use deleteWall from hook
                           />
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className={cn("flex-grow h-full transition-all duration-300 ease-in-out", isSidebarOpen ? "ml-0" : "ml-0")}>
                    <NodeBaseFlow
                        nodes={nodes} // Pass nodes directly (already filtered and have callbacks)
                        edges={edges} // Pass edges directly (already filtered)
                        nodeTypes={nodeTypes}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onSelectionChange={handleSelectionChange}
                        onConnect={handleConnect}
                    />
                </div>

                <AnimatePresence>
                    {isSidebarOpen && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: '280px', opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="h-full border-l overflow-hidden flex-shrink-0"
                        >
                           <NodeHierarchyPanel
                               nodes={nodes} // Pass current wall's nodes
                               bookmarkedNodes={bookmarkedNodes}
                               selectedNodes={selectedNodes} // Pass selectedNodes
                               onZoomToNode={zoomToNode}
                               onAddSelectedToBookmarks={addSelectedNodesToBookmarks} // Pass function
                               onRemoveBookmark={removeBookmark} // Pass function
                               onAddNode={addNode} // Pass function
                               onChangeColor={changeSelectedNodesColor} // Pass function
                               onGroupNodes={groupSelectedNodes} // Pass function
                               onDeleteNodes={deleteSelectedNodes} // Pass function
                               onOpenLinkDialog={selectedNodes.length === 1 ? () => openLinkDialog(selectedNodes[0].id) : undefined} // Pass function conditionally
                               onUngroupNodes={ungroupSelectedNodes} // Pass function
                           />
                        </motion.div>
                    )}
                </AnimatePresence>

                <LinkTaskDialog
                    isOpen={isLinkDialogOpen}
                    onOpenChange={setIsLinkDialogOpen}
                    currentNodeId={linkingNodeId} // Pass the current node ID
                    onSaveLink={saveTaskLink} // Renamed prop
                    availableTasks={availableTasks}
                    initialTaskId={nodes.find(n => n.id === linkingNodeId)?.data.linkedTaskId} // Renamed prop
                />
            </div>
        );
    };

    export default NodeBaseContent;
  