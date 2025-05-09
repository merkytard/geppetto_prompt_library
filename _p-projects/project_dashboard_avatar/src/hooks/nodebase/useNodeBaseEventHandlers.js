
    import { useCallback, useEffect } from 'react';
    import { useStoreApi } from 'reactflow';
    // Callbacks are now injected in useNodeBaseCoreState, so specific action hooks are not needed here for that purpose.

    const useNodeBaseEventHandlers = (
        coreState,
        selectionState
    ) => {
      const { onEdgesChange } = coreState; // Get onEdgesChange from core state
      const { setSelectedNodes } = selectionState;
      const store = useStoreApi();

      // Selection change handler remains the same
      const handleSelectionChange = useCallback(({ nodes: selected }) => {
          setSelectedNodes(selected);
      }, [setSelectedNodes]);

      // Connect handler remains the same, uses onEdgesChange from core
      const handleConnect = useCallback((params) => {
          const edgeStyle = { stroke: 'hsl(var(--primary))', strokeWidth: 1.5 };
          onEdgesChange([{ type: 'add', item: { ...params, animated: true, style: edgeStyle } }]);
      }, [onEdgesChange]);

      return {
        handleSelectionChange,
        handleConnect,
      };
    };

    export default useNodeBaseEventHandlers;
  