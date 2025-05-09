
    import React from 'react';
    import { ReactFlowProvider } from 'reactflow';
    import NodeBasePageContent from '@/components/nodebase/NodeBasePageContent';

    const NodeBasePage = () => {
      return (
          <ReactFlowProvider>
              <NodeBasePageContent />
          </ReactFlowProvider>
      );
    }

    export default NodeBasePage;
  