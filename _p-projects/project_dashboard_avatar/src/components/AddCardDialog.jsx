
    import React, { useState, useEffect } from 'react';
    import { Button } from "@/components/ui/button";
    import {
      Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose
    } from "@/components/ui/dialog";
    import { Input } from "@/components/ui/input";
    import { Textarea } from "@/components/ui/textarea";
    import { Label } from "@/components/ui/label";
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
    import { CalendarPlus as CalendarIcon, Tag, UserPlus, Palette } from 'lucide-react';
    import { initialUsers } from '@/data/initialKanbanData'; // Assuming users are here
    import { cn } from '@/lib/utils';

    const cardColors = [
      { name: 'Default', value: 'bg-card' },
      { name: 'Blue', value: 'bg-blue-100 dark:bg-blue-900/30' },
      { name: 'Green', value: 'bg-green-100 dark:bg-green-900/30' },
      { name: 'Yellow', value: 'bg-yellow-100 dark:bg-yellow-900/30' },
      { name: 'Purple', value: 'bg-purple-100 dark:bg-purple-900/30' },
      { name: 'Pink', value: 'bg-pink-100 dark:bg-pink-900/30' },
    ];

    const AddCardDialog = ({ children, card, columnId, onSave, users = initialUsers }) => {
      const [isOpen, setIsOpen] = useState(false);
      const [title, setTitle] = useState('');
      const [description, setDescription] = useState('');
      const [type, setType] = useState('TASK'); // Default type
      const [assignedUserIds, setAssignedUserIds] = useState([]);
      const [tags, setTags] = useState([]);
      const [newTag, setNewTag] = useState('');
      const [color, setColor] = useState('bg-card');
      const [dueDate, setDueDate] = useState(''); // Basic date input for now

      useEffect(() => {
        if (isOpen) {
          if (card) {
            setTitle(card.title || '');
            setDescription(card.description || '');
            setType(card.type || 'TASK');
            setAssignedUserIds(card.assignedUserIds || []);
            setTags(card.tags || []);
            setColor(card.color || 'bg-card');
            setDueDate(card.dueDate || ''); // Load due date
          } else {
            // Reset form for new card
            setTitle('');
            setDescription('');
            setType('TASK');
            setAssignedUserIds([]);
            setTags([]);
            setColor('bg-card');
            setDueDate(''); // Reset due date
          }
          setNewTag('');
        }
      }, [card, isOpen]);

      const handleTagAdd = () => {
        if (newTag.trim() && !tags.includes(newTag.trim())) {
          setTags([...tags, newTag.trim()]);
          setNewTag('');
        }
      };

      const handleTagRemove = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
      };

      const handleUserToggle = (userId) => {
        setAssignedUserIds(prev =>
          prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        );
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        if (title.trim()) {
          const cardData = {
            id: card?.id, // Include id if editing
            title: title.trim(),
            description: description.trim(),
            type,
            assignedUserIds,
            tags,
            color,
            dueDate: dueDate || null, // Save due date
          };
          onSave(columnId, cardData); // Pass columnId and cardData
          setIsOpen(false);
        }
      };

      return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>{children}</DialogTrigger>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>{card ? 'Edit Card' : 'Add New Card'}</DialogTitle>
              <DialogDescription>
                {card ? 'Update the details for this card.' : 'Enter the details for the new card.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                {/* Title */}
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Card title" required autoFocus />
                </div>

                {/* Description */}
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Card description (optional)" rows={3} />
                </div>

                {/* Type Select */}
                 <div className="grid gap-2">
                   <Label htmlFor="type">Type</Label>
                   <Select value={type} onValueChange={setType}>
                     <SelectTrigger id="type"> <SelectValue placeholder="Select type" /> </SelectTrigger>
                     <SelectContent> <SelectItem value="TASK">Task</SelectItem> <SelectItem value="BUG">Bug</SelectItem> <SelectItem value="EPIC">Epic</SelectItem> <SelectItem value="STORY">Story</SelectItem> </SelectContent>
                   </Select>
                 </div>

                 {/* Due Date */}
                 <div className="grid gap-2">
                    <Label htmlFor="dueDate">Due Date (Optional)</Label>
                    <Input
                        id="dueDate"
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full"
                    />
                 </div>


                {/* Assign Users Popover */}
                <div className="grid gap-2">
                  <Label>Assign Users</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start font-normal">
                        <UserPlus className="mr-2 h-4 w-4" />
                        {assignedUserIds.length > 0 ? `${assignedUserIds.length} user(s) assigned` : "Assign users"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <div className="p-2 max-h-48 overflow-y-auto">
                        {users.map(user => (
                          <div key={user.id} className="flex items-center space-x-2 p-1">
                            <input
                              type="checkbox"
                              id={`user-${user.id}`}
                              checked={assignedUserIds.includes(user.id)}
                              onChange={() => handleUserToggle(user.id)}
                              className="form-checkbox h-4 w-4 text-primary rounded focus:ring-primary border-gray-300"
                            />
                            <Label htmlFor={`user-${user.id}`} className="text-sm font-medium leading-none cursor-pointer">
                              {user.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Tags Input */}
                <div className="grid gap-2">
                  <Label htmlFor="tags">Tags</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="tags"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag"
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleTagAdd(); } }}
                    />
                    <Button type="button" variant="outline" size="sm" onClick={handleTagAdd}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {tags.map(tag => (
                      <span key={tag} className="flex items-center text-xs bg-secondary text-secondary-foreground rounded-full px-2 py-0.5">
                        {tag}
                        <button type="button" onClick={() => handleTagRemove(tag)} className="ml-1 text-muted-foreground hover:text-destructive">&times;</button>
                      </span>
                    ))}
                  </div>
                </div>

                 {/* Color Picker */}
                 <div className="grid gap-2">
                    <Label>Color</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start">
                                <Palette className="mr-2 h-4 w-4" />
                                <div className={cn("w-4 h-4 rounded-full mr-2 border", color)}></div>
                                {cardColors.find(c => c.value === color)?.name || 'Default'}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <div className="grid grid-cols-3 gap-1 p-1">
                                {cardColors.map(c => (
                                    <Button
                                        key={c.value}
                                        variant="ghost"
                                        size="sm"
                                        className="justify-start"
                                        onClick={() => setColor(c.value)}
                                    >
                                        <div className={cn("w-4 h-4 rounded-full mr-2 border", c.value)}></div>
                                        {c.name}
                                    </Button>
                                ))}
                            </div>
                        </PopoverContent>
                    </Popover>
                 </div>

              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" className="gold-button">Save Card</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      );
    };

    export default AddCardDialog;
  