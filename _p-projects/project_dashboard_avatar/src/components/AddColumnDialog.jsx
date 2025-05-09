
    import React, { useState, useEffect } from 'react';
    import { Button } from "@/components/ui/button";
    import {
      Dialog,
      DialogContent,
      DialogDescription,
      DialogFooter,
      DialogHeader,
      DialogTitle,
      DialogTrigger,
    } from "@/components/ui/dialog";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";

    const AddColumnDialog = ({ children, onSave }) => {
      const [isOpen, setIsOpen] = useState(false);
      const [title, setTitle] = useState('');

      useEffect(() => {
        if (isOpen) {
          setTitle(''); // Reset title when dialog opens
        }
      }, [isOpen]);

      const handleSubmit = (e) => {
        e.preventDefault();
        if (title.trim()) {
          onSave(title.trim());
          setIsOpen(false);
        }
      };

      return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>{children}</DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Column</DialogTitle>
              <DialogDescription>Enter a title for the new Kanban column.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Column Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., To Do, In Progress"
                    required
                    autoFocus
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button type="submit" className="gold-button">Add Column</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      );
    };

    export default AddColumnDialog;
  