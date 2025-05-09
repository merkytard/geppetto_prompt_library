
    import { useMemo } from 'react';
    import { useReactFlow } from 'reactflow';
    import useNodeBaseCoreState from './useNodeBaseCoreState';
    import useNodeBaseSelectionState from './useNodeBaseSelectionState';
    import useNodeBaseLinkingState from './useNodeBaseLinkingState';
    import useNodeBaseEventHandlers from './useNodeBaseEventHandlers';
    import useNodeBaseActions from './actions/useNodeBaseActions';
    import useProjects from '@/hooks/useProjects';

    const useNodeBaseState = (projectFilter) => {
        const reactFlowInstance = useReactFlow();
        const { projects: allProjectsData } = useProjects();

        const coreState = useNodeBaseCoreState(
            useMemo(() => ({
                onNodeDataChange: () => {}, 
                deleteSingleNode: () => {}, 
                createTaskFromNode: () => {},
            }), [])
        );

        const selectionState = useNodeBaseSelectionState();
        const linkingState = useNodeBaseLinkingState();
        
        const eventHandlers = useNodeBaseEventHandlers(coreState, selectionState);
        
        const actions = useNodeBaseActions(coreState, selectionState, linkingState, projectFilter, allProjectsData);

        if (coreState.callbacks) {
            coreState.callbacks.onNodeDataChange = actions.onNodeDataChange;
            coreState.callbacks.deleteSingleNode = actions.deleteSingleNode;
            coreState.callbacks.createTaskFromNode = actions.createTaskFromNode;
        }
        
        return {
            ...coreState,
            ...selectionState,
            ...linkingState,
            ...eventHandlers,
            actions,
            reactFlowInstance,
            allProjectsData,
        };
    };

    export default useNodeBaseState;
  