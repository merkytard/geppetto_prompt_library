
    import { useState } from 'react';

    const useNodeBaseSelectionState = () => {
        const [selectedNodes, setSelectedNodes] = useState([]);
        return { selectedNodes, setSelectedNodes };
    };

    export default useNodeBaseSelectionState;
  