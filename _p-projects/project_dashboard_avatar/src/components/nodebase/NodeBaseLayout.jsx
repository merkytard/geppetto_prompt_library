
    import React from 'react';
    import useNodeBaseState from '@/hooks/useNodeBaseState';
    import NodeBaseToolbar from '@/components/nodebase/NodeBaseToolbar';
    import NodeBaseFlow from '@/components/nodebase/NodeBaseFlow';
    import NodeHierarchyPanel from '@/components/nodebase/NodeHierarchyPanel';
    import TextNode from '@/components/nodes/TextNode';
    import ImageNode from '@/components/nodes/ImageNode';
    import DetailedNode from '@/components/nodes/DetailedNode';
    import OutputNode from '@/components/nodes/OutputNode';
    import { cn } from '@/lib/utils';
    import { motion, AnimatePresence } from 'framer-motion';
    import LinkTaskDialog from '@/components/nodebase/LinkTaskDialog'; 
    import { Loader2 } from 'lucide-react';

    const nodeTypes = {
      textNode: TextNode,
      imageNode: ImageNode,
      detailedNode: DetailedNode,
      outputNode: OutputNode,
    };

    const panelVariants = {
        open: { width: '280px', opacity: 1, padding: '0.75rem', x: 0 },
        closed: { width: 0, opacity: 0, padding: 0, x: '-100%' }, 
    };
    const panelVariantsRight = {
        open: { width: '280px', opacity: 1, padding: '0.75rem', x: 0 },
        closed: { width: 0, opacity: 0, padding: 0, x: '100%' }, 
    };


    const NodeBaseLayout = ({ projectFilter, isNodeBasePanelsOpen, toggleNodeBasePanels, projects: allProjectsDataFromPage }) => {
      const {
        nodes, edges, onNodesChange, onEdgesChange, 
        selectedNodes, 
        actions, 
        currentWallId,
        linkingNodeId, isLinkDialogOpen, setIsLinkDialogOpen, 
        availableTasks, 
        allProjectsData: allProjectsDataFromHook, 
      } = useNodeBaseState(projectFilter);

      const allProjects = allProjectsDataFromPage || allProjectsDataFromHook;

      if (!actions || !nodes || !edges) {
        return (
            <div className="flex items-center justify-center h-full w-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                <p>Loading NodeBase...</p>
            </div>
        ); 
      }
      
      const { 
        handleSelectionChange, handleConnect, 
        addNode, deleteSelectedNodes, changeSelectedNodesColor, groupSelectedNodes, ungroupSelectedNodes, 
        saveTaskLink, createTaskFromNode, openLinkDialog, 
        zoomToNode, addSelectedNodesToBookmarks, removeBookmark, zoomToBookmarkedNode, 
        setCurrentWallId, addWall, deleteWall, renameWall, assignProjectToWall, 
        undo, redo, canUndo, canRedo, 
        walls, bookmarkedNodes 
      } = actions;


      return (
        <div className="flex flex-1 h-full overflow-hidden relative">
          <AnimatePresence>
            {isNodeBasePanelsOpen && (
              <motion.div
                key="nodebase-toolbar-panel"
                variants={panelVariants}
                initial="closed"
                animate="open"
                exit="closed"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="bg-card border-r h-full overflow-y-auto shadow-lg dark:border-slate-700 flex-shrink-0 absolute md:relative top-0 left-0 z-20 md:z-auto"
              >
                <NodeBaseToolbar
                    onAddNode={addNode}
                    selectedNodesCount={selectedNodes.length}
                    onChangeColor={changeSelectedNodesColor}
                    onGroupNodes={groupSelectedNodes}
                    onDeleteNodes={deleteSelectedNodes}
                    onOpenLinkDialog={selectedNodes.length === 1 ? () => openLinkDialog(selectedNodes[0].id) : undefined}
                    
                    walls={walls}
                    currentWallId={currentWallId}
                    onSelectWall={setCurrentWallId}
                    onAddWall={addWall}
                    onDeleteWall={deleteWall}
                    onRenameWall={renameWall} 
                    onUpdateWallProject={assignProjectToWall} 
                    projects={allProjects} 

                    onUndo={undo}
                    onRedo={redo}
                    canUndo={canUndo}
                    canRedo={canRedo}
                    addSelectedNodesToBookmarks={addSelectedNodesToBookmarks}
                />
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className={cn(
            "flex-1 flex flex-col h-full relative bg-background dark:bg-slate-800 transition-all duration-300 ease-in-out",
            isNodeBasePanelsOpen && "md:ml-[280px]", 
            isNodeBasePanelsOpen && "md:mr-[280px]" 
          )}>
            <div className="flex-1 h-full w-full overflow-hidden">
                <NodeBaseFlow
                  nodes={nodes}
                  edges={edges}
                  nodeTypes={nodeTypes}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onSelectionChange={handleSelectionChange}
                  onConnect={handleConnect}
                  currentWallId={currentWallId}
                />
            </div>
          </div>

          <AnimatePresence>
            {isNodeBasePanelsOpen && (
              <motion.div
                key="nodebase-hierarchy-panel"
                variants={panelVariantsRight}
                initial="closed"
                animate="open"
                exit="closed"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="bg-card border-l h-full overflow-y-auto shadow-lg dark:border-slate-700 flex-shrink-0 absolute md:relative top-0 right-0 z-20 md:z-auto"
              >
                 <NodeHierarchyPanel
                    nodes={nodes.filter(n => n.data.wallId === currentWallId)}
                    selectedNodes={selectedNodes}
                    onNodeSelect={(nodeId) => zoomToNode && zoomToNode(nodeId)}
                    bookmarkedNodes={bookmarkedNodes || []} 
                    onBookmarkSelect={(nodeId) => zoomToBookmarkedNode && zoomToBookmarkedNode(nodeId)}
                    removeBookmark={removeBookmark}
                    onAddSelectedToBookmarks={addSelectedNodesToBookmarks}
                    onAddNode={addNode}
                    onChangeColor={changeSelectedNodesColor}
                    onGroupNodes={groupSelectedNodes}
                    onDeleteNodes={deleteSelectedNodes}
                    onOpenLinkDialog={selectedNodes.length === 1 ? () => openLinkDialog(selectedNodes[0].id) : undefined}
                    onUngroupNodes={ungroupSelectedNodes}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <LinkTaskDialog
            isOpen={isLinkDialogOpen}
            onOpenChange={setIsLinkDialogOpen}
            currentNodeId={linkingNodeId}
            onSaveLink={saveTaskLink}
            availableTasks={availableTasks}
            initialTaskId={nodes.find(n => n.id === linkingNodeId)?.data.linkedTaskId}
            onCreateTask={createTaskFromNode} 
          />
        </div>
      );
    };

    export default NodeBaseLayout;
  