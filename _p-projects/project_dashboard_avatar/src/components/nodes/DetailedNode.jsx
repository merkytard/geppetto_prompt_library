
    import React, { useState, useCallback } from 'react';
    import { Handle, Position } from 'reactflow';
    import { Input } from '@/components/ui/input';
    import { Textarea } from '@/components/ui/textarea';
    import { Label } from '@/components/ui/label';
    import { Button } from '@/components/ui/button';
    import { Bot, X, MessageSquare as MessageSquareQuestion, PlusCircle, MinusCircle } from 'lucide-react';
    import { cn } from '@/lib/utils';

    const MAX_HANDLES = 5;
    const MAX_DETAILS = 10;

    const DetailItem = ({ index, detailKey, detailValue, onKeyChange, onValueChange, onRemove }) => (
        <div className="flex items-center gap-1">
            <Input
                value={detailKey}
                onChange={(e) => onKeyChange(index, e.target.value)}
                className="nodrag text-xs h-6 bg-transparent focus:bg-card/30 flex-1 p-1" // Ensure padding
                placeholder="Key"
                onClick={(e) => e.stopPropagation()} // Prevent drag start on click
                onMouseDown={(e) => e.stopPropagation()} // Prevent drag start on mouse down
            />
            <Input
                value={detailValue}
                onChange={(e) => onValueChange(index, e.target.value)}
                className="nodrag text-xs h-6 bg-transparent focus:bg-card/30 flex-2 p-1" // Ensure padding
                placeholder="Value"
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
            />
            <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground hover:text-destructive nodrag flex-shrink-0" onClick={() => onRemove(index)}>
                <MinusCircle className="h-3 w-3" />
            </Button>
        </div>
    );

    const DetailedNode = ({ data, id, selected }) => {
      const [title, setTitle] = useState(data.title || '');
      const [content, setContent] = useState(data.content || '');
      const [details, setDetails] = useState(data.details || []);
      const [handles, setHandles] = useState(data.handles || ['default_source', 'default_target']);

      const nodeColorClass = data.color || 'bg-background';
      const isGrouped = !!data.groupId;

      const handleDataChange = (field, value) => {
          if (data.onDataChange) {
              data.onDataChange(id, { [field]: value });
          }
      }

      const onTitleChange = useCallback((evt) => setTitle(evt.target.value), []);
      const onContentChange = useCallback((evt) => setContent(evt.target.value), []);

      const onTitleBlur = useCallback(() => handleDataChange('title', title), [title, id, data]);
      const onContentBlur = useCallback(() => handleDataChange('content', content), [content, id, data]);

      // --- Details Management ---
      const handleDetailKeyChange = (index, newKey) => {
          const newDetails = [...details];
          newDetails[index] = { ...newDetails[index], key: newKey };
          setDetails(newDetails);
          handleDataChange('details', newDetails);
      };
      const handleDetailValueChange = (index, newValue) => {
          const newDetails = [...details];
          newDetails[index] = { ...newDetails[index], value: newValue };
          setDetails(newDetails);
          handleDataChange('details', newDetails);
      };
      const addDetail = () => {
          if (details.length < MAX_DETAILS) {
              const newDetails = [...details, { key: '', value: '' }];
              setDetails(newDetails);
              handleDataChange('details', newDetails);
          }
      };
      const removeDetail = (index) => {
          const newDetails = details.filter((_, i) => i !== index);
          setDetails(newDetails);
          handleDataChange('details', newDetails);
      };

      // --- Handles Management ---
      const addHandle = (type) => {
          if (handles.length < MAX_HANDLES * 2) {
              const newHandleId = `${type[0]}${Math.random().toString(36).substring(2, 5)}`;
              const newHandles = [...handles, newHandleId];
              setHandles(newHandles);
              handleDataChange('handles', newHandles);
          }
      };
      const removeHandle = (handleId) => {
          const newHandles = handles.filter(h => h !== handleId && h !== 'default_source' && h !== 'default_target');
          if (!newHandles.some(h => h.startsWith('s'))) newHandles.push('default_source');
          if (!newHandles.some(h => h.startsWith('t'))) newHandles.push('default_target');
          setHandles(newHandles);
          handleDataChange('handles', newHandles);
      };

      const getHandlePosition = (type, index, total) => {
          return `${(100 / (total + 1)) * (index + 1)}%`;
      };

      const sourceHandles = handles.filter(h => h.startsWith('s'));
      const targetHandles = handles.filter(h => h.startsWith('t'));

      const handleChatClick = (e) => {
         e.stopPropagation();
         const question = prompt(`Ask AI about "${title || 'this detailed node'}":`, `Summarize the content of this node.`);
         if (question) {
            alert(`AI Mock Request:\nNode ID: ${id}\nQuestion: ${question}\n\n(This would ideally open the chat widget with context)`);
         }
      }

      const handleDeleteClick = (e) => {
          e.stopPropagation();
          if (data.deleteNode) data.deleteNode(id);
      }

      // Stop propagation on input/textarea focus/mousedown to prevent node drag
      const stopPropagation = (e) => e.stopPropagation();

      return (
        <div className={cn(
            "node-base-node relative p-2 w-[250px] reactflow-node",
            selected ? "selected" : "",
            isGrouped ? "border-2 border-blue-500 border-dashed" : ""
        )} >

          {targetHandles.map((handleId, index) => (
              <Handle key={handleId} id={handleId} type="target" position={Position.Left} className="w-2 h-2 !bg-primary"
                  style={{ top: getHandlePosition('target', index, targetHandles.length) }} isConnectable={true} />
          ))}

          <div className={cn("node-text-bubble space-y-2", nodeColorClass)}>
             <div>
                 <Label htmlFor={`title-${id}`} className="text-xs font-semibold opacity-80">Title</Label>
                 <Input
                    id={`title-${id}`} value={title} onChange={onTitleChange} onBlur={onTitleBlur}
                    className="nodrag text-sm font-medium h-8 mt-1 bg-transparent focus:bg-card/30 p-1"
                    placeholder="Node Title"
                    onClick={stopPropagation} onMouseDown={stopPropagation} // Prevent drag
                  />
             </div>
             <div>
                 <Label htmlFor={`content-${id}`} className="text-xs font-semibold opacity-80">Content</Label>
                 <Textarea
                    id={`content-${id}`} value={content} onChange={onContentChange} onBlur={onContentBlur}
                    className="nodrag text-sm min-h-[60px] mt-1 bg-transparent focus:bg-card/30 p-1"
                    placeholder="Node content..."
                    onClick={stopPropagation} onMouseDown={stopPropagation} // Prevent drag
                  />
             </div>

             {details.length > 0 && (
                 <div className="space-y-1 pt-2 border-t mt-2">
                     <Label className="text-xs font-semibold opacity-80">Details</Label>
                     {details.map((detail, index) => (
                         <DetailItem key={index} index={index} detailKey={detail.key} detailValue={detail.value}
                             onKeyChange={handleDetailKeyChange} onValueChange={handleDetailValueChange} onRemove={removeDetail} />
                     ))}
                 </div>
             )}
             {details.length < MAX_DETAILS && (
                 <Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground nodrag w-full justify-start" onClick={addDetail}>
                     <PlusCircle className="h-3 w-3 mr-1" /> Add Detail
                 </Button>
             )}

              {data.linkedTaskId && ( <div className="text-xs opacity-70 pt-1 border-t mt-2"> Linked: Task {data.linkedTaskId.substring(0, 6)}... </div> )}
          </div>

          {sourceHandles.map((handleId, index) => (
              <Handle key={handleId} id={handleId} type="source" position={Position.Right} className="w-2 h-2 !bg-primary"
                  style={{ top: getHandlePosition('source', index, sourceHandles.length) }} isConnectable={true} />
          ))}

           <Button variant="ghost" size="icon" className="absolute top-1 left-1 h-5 w-5 p-0 text-muted-foreground hover:text-destructive z-10 opacity-50 hover:opacity-100 nodrag"
              onClick={handleDeleteClick} title="Delete Node"> <X className="h-3 w-3" /> </Button>
           <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-5 w-5 p-0 text-muted-foreground hover:text-primary z-10 opacity-50 hover:opacity-100 nodrag"
              onClick={handleChatClick} title="Ask AI about this node"> <MessageSquareQuestion className="h-3 w-3" /> </Button>

             <div className="absolute bottom-1 left-1 flex gap-1 z-10 opacity-50 hover:opacity-100 nodrag">
                 <Button variant="ghost" size="icon" className="h-5 w-5 p-0" onClick={() => addHandle('target')} title="Add Target Handle" disabled={targetHandles.length >= MAX_HANDLES}>
                     <PlusCircle className="h-3 w-3" />
                 </Button>
                 <Button variant="ghost" size="icon" className="h-5 w-5 p-0" onClick={() => addHandle('source')} title="Add Source Handle" disabled={sourceHandles.length >= MAX_HANDLES}>
                     <PlusCircle className="h-3 w-3" />
                 </Button>
             </div>
        </div>
      );
    };

    export default React.memo(DetailedNode);
  