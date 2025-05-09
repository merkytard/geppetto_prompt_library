
    import React, { useState, useCallback, useRef } from 'react';
    import { Handle, Position } from 'reactflow';
    import { Button } from '@/components/ui/button';
    import { Bot, X, MessageSquare as MessageSquareQuestion, Upload } from 'lucide-react';
    import { cn } from '@/lib/utils';

    const ImageNode = ({ data, id, selected }) => {
      const [altText, setAltText] = useState(data.alt || '');
      const [imageDataUrl, setImageDataUrl] = useState(data.imageDataUrl || null); // Store image data URL
      const fileInputRef = useRef(null);

      const nodeColorClass = data.color || 'bg-background';
      const isGrouped = !!data.groupId;

      const handleDataChange = (field, value) => {
        if (data.onDataChange) {
          data.onDataChange(id, { [field]: value });
        }
      };

      const onAltTextChange = useCallback((evt) => setAltText(evt.target.value), []);
      const onAltTextBlur = useCallback(() => handleDataChange('alt', altText), [altText, id, data]);

      const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result;
            setImageDataUrl(result);
            handleDataChange('imageDataUrl', result); // Save data URL to node data
          };
          reader.readAsDataURL(file);
        } else {
          alert('Please select a valid image file.');
        }
      };

      const triggerFileInput = () => {
        fileInputRef.current?.click();
      };

      const handleChatClick = (e) => {
        e.stopPropagation();
        const question = prompt(`Ask AI about this image node:`, `Describe the image in this node.`);
        if (question) {
          alert(`AI Mock Request:\nNode ID: ${id}\nQuestion: ${question}\n\n(This would ideally open the chat widget with context)`);
        }
      };

      const handleDeleteClick = (e) => {
        e.stopPropagation();
        if (data.deleteNode) data.deleteNode(id);
      };

      return (
        <div className={cn(
            "node-base-node relative p-2 w-[200px] reactflow-node",
            selected ? "selected" : "",
            isGrouped ? "border-2 border-blue-500 border-dashed" : ""
        )}>
          <Handle type="target" position={Position.Left} className="w-2 h-2 !bg-primary" />

          <div className={cn("node-text-bubble space-y-2", nodeColorClass)}>
            {imageDataUrl ? (
              <img 
                src={imageDataUrl} // Use state for src
                alt={altText || 'Uploaded image'}
                className="w-full h-auto rounded object-cover max-h-[200px]"
               src="https://images.unsplash.com/photo-1675023112817-52b789fd2ef0" />
            ) : (
              <div className="w-full h-[100px] bg-muted rounded flex items-center justify-center text-muted-foreground text-sm">
                No Image Uploaded
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden" // Hide the default input
            />
            <Button variant="outline" size="sm" className="w-full text-xs nodrag" onClick={triggerFileInput}>
              <Upload className="h-3 w-3 mr-1" /> Upload Image
            </Button>

            <input
              value={altText}
              onChange={onAltTextChange}
              onBlur={onAltTextBlur}
              className="nodrag text-xs w-full mt-1 p-1 border rounded bg-transparent focus:bg-card/30"
              placeholder="Alt text..."
            />
             {data.linkedTaskId && ( <div className="text-xs opacity-70 pt-1 border-t mt-2"> Linked: Task {data.linkedTaskId.substring(0, 6)}... </div> )}
          </div>

          <Handle type="source" position={Position.Right} className="w-2 h-2 !bg-primary" />

          {/* Control Buttons */}
          <Button
             variant="ghost" size="icon"
             className="absolute top-1 left-1 h-5 w-5 p-0 text-muted-foreground hover:text-destructive z-10 opacity-50 hover:opacity-100 nodrag"
             onClick={handleDeleteClick} title="Delete Node"
           > <X className="h-3 w-3" /> </Button>
           <Button
              variant="ghost" size="icon"
              className="absolute top-1 right-1 h-5 w-5 p-0 text-muted-foreground hover:text-primary z-10 opacity-50 hover:opacity-100 nodrag"
              onClick={handleChatClick} title="Ask AI about this node"
            > <MessageSquareQuestion className="h-3 w-3" /> </Button>
        </div>
      );
    };

    export default React.memo(ImageNode);
  