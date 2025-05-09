
    import { useState } from 'react';

    const useNodeBaseLinkingState = () => {
        const [linkingNodeId, setLinkingNodeId] = useState(null);
        const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
        return { linkingNodeId, setLinkingNodeId, isLinkDialogOpen, setIsLinkDialogOpen };
    };

    export default useNodeBaseLinkingState;
  