
    import React, { useState, useEffect } from 'react';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
    import { Button } from '@/components/ui/button';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { useToast } from "@/components/ui/use-toast";

    const LinkTaskDialog = ({
      isOpen,
      onOpenChange,
      currentNodeId,
      onSaveLink,
      availableTasks = [],
      initialTaskId,
      onCreateTask // New prop for creating a task
    }) => {
      const [selectedTaskId, setSelectedTaskId] = useState('');
      const [showCreateTaskForm, setShowCreateTaskForm] = useState(false);
      const [newTaskSummary, setNewTaskSummary] = useState('');
      const { toast } = useToast();

      useEffect(() => {
        if (isOpen) {
          setSelectedTaskId(initialTaskId || '');
          setShowCreateTaskForm(false); // Reset form visibility
          setNewTaskSummary(''); // Reset new task summary
        }
      }, [isOpen, initialTaskId]);

      const handleSave = () => {
        if (selectedTaskId) {
          onSaveLink(currentNodeId, selectedTaskId);
          toast({ title: "Task Linked", description: `Node successfully linked to task.` });
        } else {
          // If no task is selected, it implies unlinking or clearing the link
          onSaveLink(currentNodeId, null); 
          toast({ title: "Task Link Cleared", description: `Node is no longer linked to a task.` });
        }
        onOpenChange(false);
      };

      const handleCreateAndLinkTask = () => {
        if (!newTaskSummary.trim()) {
          toast({ title: "Error", description: "Task summary cannot be empty.", variant: "destructive" });
          return;
        }
        if (onCreateTask) {
          // Mock creating task and getting an ID. In real app, onCreateTask would be async and return ID.
          const createdTaskId = onCreateTask(currentNodeId, { summary: newTaskSummary, status: 'Todo' }); 
          if (createdTaskId) {
            setSelectedTaskId(createdTaskId); // Auto-select the newly created task
            onSaveLink(currentNodeId, createdTaskId); // Immediately save the link
            toast({ title: "Task Created & Linked", description: `New task "${newTaskSummary}" created and linked.` });
            onOpenChange(false);
          } else {
             toast({ title: "Error", description: "Failed to create task.", variant: "destructive" });
          }
        }
      };

      return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Link Node to Task</DialogTitle>
              <DialogDescription>
                Select an existing task to link to this node, or create a new one.
              </DialogDescription>
            </DialogHeader>
            
            {!showCreateTaskForm ? (
              <div className="py-4 space-y-4">
                <div>
                  <Label htmlFor="task-select">Select Task</Label>
                  <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
                    <SelectTrigger id="task-select">
                      <SelectValue placeholder="Choose a task..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None (Clear Link)</SelectItem>
                      {availableTasks.map(task => (
                        <SelectItem key={task.id} value={task.id}>
                          {task.summary} ({task.status})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" onClick={() => setShowCreateTaskForm(true)} className="w-full">
                  Create New Task Instead
                </Button>
              </div>
            ) : (
              <div className="py-4 space-y-4">
                <div>
                  <Label htmlFor="new-task-summary">New Task Summary</Label>
                  <Input 
                    id="new-task-summary" 
                    value={newTaskSummary} 
                    onChange={(e) => setNewTaskSummary(e.target.value)}
                    placeholder="e.g., Develop login page" 
                  />
                </div>
                <Button onClick={() => setShowCreateTaskForm(false)} variant="outline">
                  Back to Select Task
                </Button>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              {showCreateTaskForm ? (
                <Button onClick={handleCreateAndLinkTask} disabled={!newTaskSummary.trim()}>Create & Link</Button>
              ) : (
                <Button onClick={handleSave}>
                  {selectedTaskId ? 'Save Link' : 'Clear Link'}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    };

    export default LinkTaskDialog;
  