
    import React, { memo, useState } from 'react';
    import { Handle, Position } from 'reactflow';
    import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Textarea } from '@/components/ui/textarea';
    import { Input } from '@/components/ui/input';
    import { Send, Trash2, Link as LinkIcon, Save } from 'lucide-react'; // Added Save icon
    import { cn } from '@/lib/utils';
    import useKanbanData from '@/hooks/useKanbanData'; // Import to use handleAddCard

    const OutputNode = memo(({ id, data, isConnectable }) => {
      const [title, setTitle] = useState(data.title || 'New Task');
      const [description, setDescription] = useState(data.description || '');
      const { handleAddCard, columns } = useKanbanData(); // Get add card function and columns

      const handleTitleChange = (event) => {
        setTitle(event.target.value);
        data.onDataChange(id, { title: event.target.value });
      };

      const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
        data.onDataChange(id, { description: event.target.value });
      };

      const handleCreateTask = () => {
        if (!columns || columns.length === 0) {
          console.error("No columns available to add card to.");
          // Optionally show a toast message to the user
          return;
        }
        const targetColumnId = columns[0].id; // Add to the first column by default
        const cardData = {
          title: title || 'Untitled Task from Node',
          description: description,
          type: 'TASK', // Default type, could be configurable
          tags: ['NodeBase'], // Add a default tag
          // Add other relevant fields if needed (dueDate, estimatedTime, etc.)
        };
        handleAddCard(targetColumnId, cardData);
        // Optionally link the node to the newly created card? Needs card ID back.
        // This requires handleAddCard to return the new card's ID.
      };

      return (
        <Card className={cn("border-2 shadow-lg w-64", data.color || 'bg-background', data.isSelected ? 'border-primary shadow-xl' : 'border-muted')}>
          <Handle type="target" position={Position.Left} isConnectable={isConnectable} className="w-2 h-2 bg-primary" />
          <CardHeader className="p-2 border-b bg-secondary/30 rounded-t-lg">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xs font-semibold flex items-center gap-1">
                <Send className="h-3 w-3" /> Output / Task
              </CardTitle>
              <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground hover:text-destructive" onClick={() => data.deleteNode(id)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-2 space-y-1">
             <Input
                value={title}
                onChange={handleTitleChange}
                placeholder="Task Title"
                className="text-sm font-medium h-7 nodrag"
             />
            <Textarea
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Task description..."
              className="text-xs h-16 nodrag resize-none"
            />
          </CardContent>
          <CardFooter className="p-2 border-t flex justify-end">
             <Button variant="outline" size="sm" className="h-6 px-2 text-xs gold-button" onClick={handleCreateTask}>
                 <Save className="h-3 w-3 mr-1"/> Create Task
             </Button>
             {/* Link button could be added here if needed */}
          </CardFooter>
          {/* No source handle needed for an output node typically */}
        </Card>
      );
    });

    export default OutputNode;
  