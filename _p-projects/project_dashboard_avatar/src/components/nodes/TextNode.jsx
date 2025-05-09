
    import React, { useState, useCallback } from 'react';
    import { Handle, Position } from 'reactflow';
    import { Textarea } from '@/components/ui/textarea';
    import { Button } from '@/components/ui/button';
    import { Bot, X, MessageSquare as MessageSquareQuestion } from 'lucide-react';
    import { cn } from '@/lib/utils';

    const TextNode = ({ data, id, selected }) => {
      const [isEditing, setIsEditing] = useState(false);
      const [label, setLabel] = useState(data.label || '');
      const nodeColorClass = data.color || 'bg-background';
      const isGrouped = !!data.groupId; // Check if grouped

      const onDoubleClick = useCallback(() => setIsEditing(true), []);

      const onBlur = useCallback(() => {
        setIsEditing(false);
        if (data.onDataChange && label !== data.label) {
             data.onDataChange(id, { label });
        }
      }, [id, label, data]);

      const onChange = useCallback((evt) => setLabel(evt.target.value), []);

      const handleChatClick = (e) => {
         e.stopPropagation();
         const question = prompt(`Ask AI about "${label || 'this node'}":`, `Summarize this node's content.`);
         if (question) {
            alert(`AI Mock Request:\nNode ID: ${id}\nQuestion: ${question}\n\n(This would ideally open the chat widget with context)`);
         }
      }

      const handleDeleteClick = (e) => {
          e.stopPropagation();
          if (data.deleteNode) data.deleteNode(id);
      }

      return (
        <div className={cn(
            "node-base-node relative reactflow-node",
            selected ? "selected" : "",
            isGrouped ? "border-2 border-blue-500 border-dashed" : "" // Group indicator
        )} >
          <Handle type="target" position={Position.Left} className="w-2 h-2 !bg-primary" style={{ top: '50%' }} isConnectable={true} />

          <div
            className={cn("node-text-bubble min-w-[150px] min-h-[60px] flex items-center", nodeColorClass)}
            onDoubleClick={onDoubleClick}
          >
            {isEditing ? (
              <Textarea
                value={label}
                onChange={onChange}
                onBlur={onBlur}
                className="nodrag text-sm p-1 resize-none w-full bg-transparent focus:outline-none"
                autoFocus
              />
            ) : (
              <div className="text-sm p-1 break-words w-full">{label || "Empty Node"}</div>
            )}
          </div>

          <Handle type="source" position={Position.Right} className="w-2 h-2 !bg-primary" style={{ top: '50%' }} isConnectable={true} />

          {/* Control Buttons */}
          <Button
             variant="ghost" size="icon"
             className="absolute top-1 left-1 h-5 w-5 p-0 text-muted-foreground hover:text-destructive z-10 opacity-50 hover:opacity-100 nodrag"
             onClick={handleDeleteClick}
             title="Delete Node"
           >
              <X className="h-3 w-3" />
           </Button>
           <Button
              variant="ghost" size="icon"
              className="absolute top-1 right-1 h-5 w-5 p-0 text-muted-foreground hover:text-primary z-10 opacity-50 hover:opacity-100 nodrag"
              onClick={handleChatClick}
              title="Ask AI about this node"
            >
               <MessageSquareQuestion className="h-3 w-3" />
            </Button>
        </div>
      );
    };

    export default React.memo(TextNode);
  