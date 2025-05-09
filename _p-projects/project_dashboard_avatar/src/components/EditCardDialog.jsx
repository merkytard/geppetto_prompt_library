
    import React, { useState, useEffect, useCallback } from 'react';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Textarea } from '@/components/ui/textarea';
    import { Label } from '@/components/ui/label';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
    import { Calendar as CalendarIcon, User, Tag, Palette, Trash2, Link as LinkIcon, ExternalLink, FolderOpen, Zap, Layers, Brain } from 'lucide-react';
    import { Calendar } from '@/components/ui/calendar';
    import { Badge } from '@/components/ui/badge';
    import { cn } from '@/lib/utils';
    import { format, parseISO, isValid } from 'date-fns';
    import {
      AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
      AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
    } from "@/components/ui/alert-dialog";
    import ReminderSettingsPopover from '@/components/ReminderSettingsPopover';
    import useNodeBaseState from '@/hooks/useNodeBaseState'; 

    const cardColors = [
      { label: 'Default', value: 'bg-card' }, { label: 'Blue', value: 'bg-blue-100 dark:bg-blue-900/30' },
      { label: 'Green', value: 'bg-green-100 dark:bg-green-900/30' }, { label: 'Yellow', value: 'bg-yellow-100 dark:bg-yellow-900/30' },
      { label: 'Purple', value: 'bg-purple-100 dark:bg-purple-900/30' }, { label: 'Pink', value: 'bg-pink-100 dark:bg-pink-900/30' },
    ];

    const EditCardDialog = ({
      isOpen, onOpenChange, cardData, onSave, onDelete, availableTags = [], users = [], columnId,
      onAssignUser, onChangeColor, onLinkToNode, onSetReminder, projects = [], isJiraContext = false
    }) => {
      const [title, setTitle] = useState('');
      const [description, setDescription] = useState('');
      const [assignedUserIds, setAssignedUserIds] = useState([]);
      const [tags, setTags] = useState([]);
      const [newTag, setNewTag] = useState('');
      const [priority, setPriority] = useState('Medium');
      const [dueDate, setDueDate] = useState(null);
      const [selectedColor, setSelectedColor] = useState('bg-card');
      const [projectId, setProjectId] = useState('');
      const [xpValue, setXpValue] = useState(0);
      const [sourceCodeUrl, setSourceCodeUrl] = useState('');
      const [localFolderPath, setLocalFolderPath] = useState('');
      const [linkedKanbanTask, setLinkedKanbanTask] = useState(''); // New state for Kanban link
      const [linkedNodeId, setLinkedNodeId] = useState(''); // New state for NodeBase link

      const { actions: nodeBaseActions } = useNodeBaseState(projectId || 'all'); 

      useEffect(() => {
        if (cardData) {
          setTitle(cardData.title || '');
          setDescription(cardData.description || '');
          setAssignedUserIds(cardData.assignedUserIds || []);
          setTags(cardData.tags || []);
          setPriority(cardData.priority || 'Medium');
          setDueDate(cardData.dueDate ? parseISO(cardData.dueDate) : null);
          setSelectedColor(cardData.color || 'bg-card');
          setProjectId(cardData.projectId || '');
          setXpValue(cardData.xpValue || 0);
          setSourceCodeUrl(cardData.sourceCodeUrl || '');
          setLocalFolderPath(cardData.localFolderPath || '');
          setLinkedKanbanTask(cardData.linkedKanbanTask || '');
          setLinkedNodeId(cardData.linkedNodeId || '');
        } else {
          
          setTitle('');
          setDescription('');
          setAssignedUserIds([]);
          setTags([]);
          setPriority('Medium');
          setDueDate(null);
          setSelectedColor('bg-card');
          setProjectId(projects.length > 0 ? projects[0].id : '');
          setXpValue(isJiraContext ? 15 : 10); 
          setSourceCodeUrl('');
          setLocalFolderPath('');
          setLinkedKanbanTask('');
          setLinkedNodeId('');
        }
      }, [cardData, isOpen, projects, isJiraContext]);

      const handleSave = () => {
        if (!title.trim()) {
          
          return;
        }
        const updatedData = {
          title: title.trim(),
          description: description.trim(),
          assignedUserIds,
          tags,
          priority,
          dueDate: dueDate ? format(dueDate, 'yyyy-MM-dd') : null,
          color: selectedColor,
          projectId: projectId || null,
          xpValue: Number(xpValue) || 0,
          sourceCodeUrl: sourceCodeUrl.trim(),
          localFolderPath: localFolderPath.trim(),
          linkedKanbanTask: linkedKanbanTask.trim(),
          linkedNodeId: linkedNodeId.trim(),
        };
        onSave(cardData.id, updatedData);
        onOpenChange(false);
      };

      const handleAddTag = () => {
        if (newTag && !tags.includes(newTag)) {
          setTags([...tags, newTag]);
        }
        setNewTag('');
      };

      const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
      };

      const handleUserAssignment = (userId) => {
        setAssignedUserIds(prev =>
          prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        );
      };

      const handleLinkToNodeWrapper = () => {
        if (onLinkToNode && cardData?.id) {
            onLinkToNode(cardData.id, null); 
        }
        // Do not close dialog here, let parent handle it or NodeBase linking dialog open
      };


      return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-[525px] max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>{cardData?.id ? 'Edit Task' : 'Add New Task'}</DialogTitle>
              <DialogDescription>
                {cardData?.id ? 'Update the details of this task.' : 'Fill in the details for the new task.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 overflow-y-auto px-1 pr-2 scrollbar-thin">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" placeholder="Task title" />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">Description</Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3 min-h-[80px]" placeholder="Task description" />
              </div>

              {projects && projects.length > 0 && (
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="project" className="text-right">Project</Label>
                    <Select value={projectId} onValueChange={setProjectId}>
                        <SelectTrigger id="project" className="col-span-3">
                            <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                        <SelectContent>
                            {projects.map(proj => (
                                <SelectItem key={proj.id} value={proj.id}>{proj.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
              )}

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="assigned-users" className="text-right flex items-center gap-1"><User className="h-4 w-4"/>Assign</Label>
                <div className="col-span-3">
                  <Select onValueChange={handleUserAssignment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Assign users" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map(user => (
                        <SelectItem key={user.id} value={user.id} disabled={assignedUserIds.includes(user.id)}>
                          {user.name} {assignedUserIds.includes(user.id) ? '(Assigned)' : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {assignedUserIds.map(userId => {
                      const user = users.find(u => u.id === userId);
                      return user ? <Badge key={userId} variant="secondary" className="cursor-pointer" onClick={() => handleUserAssignment(userId)}>{user.name} &times;</Badge> : null;
                    })}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="tags" className="text-right pt-2 flex items-center gap-1"><Tag className="h-4 w-4"/>Tags</Label>
                <div className="col-span-3">
                  <div className="flex gap-2">
                    <Input id="new-tag" value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="New tag" className="flex-grow" />
                    <Button type="button" size="sm" variant="outline" onClick={handleAddTag}>Add Tag</Button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {tags.map(tag => (
                      <Badge key={tag} variant="outline" className="cursor-pointer" onClick={() => handleRemoveTag(tag)}>{tag} &times;</Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="priority" className="text-right">Priority</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger id="priority" className="col-span-3">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="due-date" className="text-right">Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant={"outline"} id="due-date" className={cn("col-span-3 justify-start text-left font-normal", !dueDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate && isValid(dueDate) ? format(dueDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="xp-value" className="text-right flex items-center gap-1"><Zap className="h-4 w-4"/>XP Value</Label>
                <Input id="xp-value" type="number" value={xpValue} onChange={(e) => setXpValue(parseInt(e.target.value,10))} className="col-span-3" placeholder="XP for completion" />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="source-code-url" className="text-right flex items-center gap-1"><ExternalLink className="h-4 w-4"/>Source URL</Label>
                <Input id="source-code-url" value={sourceCodeUrl} onChange={(e) => setSourceCodeUrl(e.target.value)} className="col-span-3" placeholder="https://github.com/..." />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="local-folder-path" className="text-right flex items-center gap-1"><FolderOpen className="h-4 w-4"/>Local Path</Label>
                <Input id="local-folder-path" value={localFolderPath} onChange={(e) => setLocalFolderPath(e.target.value)} className="col-span-3" placeholder="C:\\Projects\\..." />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="linked-kanban-task" className="text-right flex items-center gap-1"><Layers className="h-4 w-4"/>Kanban Link</Label>
                <Input id="linked-kanban-task" value={linkedKanbanTask} onChange={(e) => setLinkedKanbanTask(e.target.value)} className="col-span-3" placeholder="Kanban Task ID" />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="linked-node-id" className="text-right flex items-center gap-1"><Brain className="h-4 w-4"/>NodeBase Link</Label>
                <div className="col-span-3 flex items-center gap-2">
                    <Input id="linked-node-id" value={linkedNodeId} onChange={(e) => setLinkedNodeId(e.target.value)} className="flex-grow" placeholder="NodeBase Node ID" />
                    {cardData?.id && onLinkToNode && (
                        <Button variant="outline" size="icon" onClick={handleLinkToNodeWrapper} title="Select Node from NodeBase">
                            <LinkIcon className="h-4 w-4" />
                        </Button>
                    )}
                </div>
              </div>


              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="card-color" className="text-right flex items-center gap-1"><Palette className="h-4 w-4"/>Color</Label>
                <Select value={selectedColor} onValueChange={setSelectedColor}>
                  <SelectTrigger id="card-color" className="col-span-3">
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    {cardColors.map(color => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center gap-2">
                          <span className={cn("w-3 h-3 rounded-full inline-block", color.value)}></span>
                          {color.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="pt-4 border-t">
              {cardData?.id && onDelete && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="mr-auto">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete Task
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the task "{cardData.title}".
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => { onDelete(cardData.id); onOpenChange(false); }}>
                        Yes, delete task
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button onClick={handleSave}>{cardData?.id ? 'Save Changes' : 'Add Task'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    };

    export default EditCardDialog;
  