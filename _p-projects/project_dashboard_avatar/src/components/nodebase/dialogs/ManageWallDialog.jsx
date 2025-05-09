
    import React, { useState, useEffect } from 'react';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
    import { Button } from "@/components/ui/button";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

    const ManageWallDialog = ({ isOpen, onOpenChange, wallData, onSave, projects = [] }) => {
        const [wallName, setWallName] = useState('');
        const [wallProjectId, setWallProjectId] = useState('global');

        useEffect(() => {
            if (isOpen && wallData) {
                setWallName(wallData.name || '');
                setWallProjectId(wallData.projectId || 'global');
            }
        }, [isOpen, wallData]);

        const handleConfirm = () => {
            if (wallName.trim()) {
                onSave(wallData.id, wallName.trim(), wallProjectId);
                onOpenChange(false);
            }
        };

        if (!wallData) return null;

        return (
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Manage Wall</DialogTitle>
                        <DialogDescription>Update settings for "{wallData.name}".</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 py-2">
                        <Label htmlFor="manage-wall-name">Wall Name</Label>
                        <Input id="manage-wall-name" value={wallName} onChange={(e) => setWallName(e.target.value)} placeholder="e.g., Feature Planning" />
                        <Label htmlFor="manage-wall-project">Assign to Project</Label>
                         <Select value={wallProjectId} onValueChange={setWallProjectId}>
                            <SelectTrigger id="manage-wall-project">
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
                        <Button onClick={handleConfirm} disabled={!wallName.trim()}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    };
    export default ManageWallDialog;
  