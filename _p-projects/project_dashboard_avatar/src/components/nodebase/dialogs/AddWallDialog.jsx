
    import React, { useState, useEffect } from 'react';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
    import { Button } from "@/components/ui/button";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

    const AddWallDialog = ({ isOpen, onOpenChange, onAddWall, projects = [] }) => {
        const [newWallName, setNewWallName] = useState('');
        const [newWallProjectId, setNewWallProjectId] = useState('global');

        useEffect(() => {
            if (isOpen) {
                setNewWallName('');
                setNewWallProjectId('global');
            }
        }, [isOpen]);

        const handleConfirm = () => {
            if (newWallName.trim()) {
                onAddWall(newWallName.trim(), newWallProjectId);
                onOpenChange(false);
            }
        };

        return (
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Wall</DialogTitle>
                        <DialogDescription>Create a new workspace for your nodes.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 py-2">
                        <Label htmlFor="wall-name">Wall Name</Label>
                        <Input id="wall-name" value={newWallName} onChange={(e) => setNewWallName(e.target.value)} placeholder="e.g., Feature Planning" />
                        <Label htmlFor="wall-project">Assign to Project (Optional)</Label>
                         <Select value={newWallProjectId} onValueChange={setNewWallProjectId}>
                            <SelectTrigger id="wall-project">
                                <SelectValue placeholder="Select Project" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="global">Global (No Project)</SelectItem>
                                {projects && projects.map(project => (
                                   <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button onClick={handleConfirm} disabled={!newWallName.trim()}>Add Wall</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    };
    export default AddWallDialog;
  