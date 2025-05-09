
    import React, { useEffect, useRef, memo } from 'react';
    import ReactFlow, { Controls, Background, MiniMap, BackgroundVariant, SelectionMode, useReactFlow } from 'reactflow';
    import { cn } from '@/lib/utils';

    const NodeBaseFlow = memo(({
      nodes,
      edges,
      nodeTypes,
      onNodesChange,
      onEdgesChange,
      onSelectionChange,
      onConnect,
      currentWallId
    }) => {
      const { fitView, getNodes, setViewport } = useReactFlow();
      const prevWallIdRef = useRef(currentWallId);
      const fitViewTimeoutRef = useRef(null);
      const initialFitDoneForWall = useRef({}); // Track fitView per wall


      useEffect(() => {
        if (currentWallId !== prevWallIdRef.current) {
          // initialFitDoneForWall.current[currentWallId] = false; // Reset fitView on wall change, handled below
          prevWallIdRef.current = currentWallId;
        }

        if (fitViewTimeoutRef.current) {
            clearTimeout(fitViewTimeoutRef.current);
        }

        const performFitView = () => {
          const currentFlowNodes = getNodes();
          if (currentFlowNodes && currentFlowNodes.length > 0) {
            if (!initialFitDoneForWall.current[currentWallId]) {
              fitView({ padding: 0.25, duration: 250 }); // Slightly more padding and duration
              initialFitDoneForWall.current[currentWallId] = true;
            }
          } else if (currentFlowNodes) { 
            setViewport({ x: 0, y: 0, zoom: 1 }, { duration: 150 });
            initialFitDoneForWall.current[currentWallId] = true; 
          }
        };
        
        // Delay fitView slightly more to ensure nodes are fully rendered in the DOM
        fitViewTimeoutRef.current = setTimeout(performFitView, 150); 

        return () => {
            if (fitViewTimeoutRef.current) {
                clearTimeout(fitViewTimeoutRef.current);
            }
        };
      }, [nodes, currentWallId, fitView, getNodes, setViewport]); 


      return (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onSelectionChange={onSelectionChange}
          className="bg-transparent touch-none" 
          deleteKeyCode={['Backspace', 'Delete']} 
          multiSelectionKeyCode={['Meta', 'Control']} 
          selectionMode={SelectionMode.Partial}
          nodesDraggable={true}
          nodesConnectable={true}
          elementsSelectable={true}
          selectNodesOnDrag={true} 
          minZoom={0.05} 
          maxZoom={2.5}  
        >
          <Controls className="fill-primary stroke-primary text-primary hidden md:flex" showInteractive={false} />
          <MiniMap nodeStrokeWidth={3} zoomable pannable className="hidden lg:block" />
          <Background
             variant={BackgroundVariant.Dots}
             gap={20} 
             size={0.6} 
             className="bg-gradient-to-br from-background to-muted/30 dark:from-slate-900 dark:to-slate-800/50"
           />
        </ReactFlow>
      );
    });
    
    NodeBaseFlow.displayName = 'NodeBaseFlow';
    export default NodeBaseFlow;
  