
    import React, { useState, useEffect } from 'react';
    import { Button } from "@/components/ui/button";
    import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
    import { Textarea } from "@/components/ui/textarea";
    import { Label } from "@/components/ui/label";
    import { Target } from 'lucide-react';

    const MilestoneGoalsDialog = ({ isOpen, onOpenChange, milestone, onSave }) => {
        const [sprintGoals, setSprintGoals] = useState('');
        const [personalGoals, setPersonalGoals] = useState('');

        useEffect(() => {
            if (isOpen && milestone?.goals) {
                setSprintGoals(milestone.goals.sprint || '');
                setPersonalGoals(milestone.goals.personal || '');
            } else if (!isOpen) {
                // Reset on close if needed, though useEffect dependency handles updates
                setSprintGoals('');
                setPersonalGoals('');
            }
        }, [isOpen, milestone]);

        const handleSaveChanges = () => {
            if (onSave && milestone) {
                onSave(milestone.id, {
                    sprint: sprintGoals,
                    personal: personalGoals,
                });
            }
        };

        return (
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Target className="h-5 w-5 text-primary" />
                            Goals for Milestone: {milestone?.name || '...'}
                        </DialogTitle>
                        <DialogDescription>
                            Define or review the sprint and personal objectives related to this milestone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid w-full gap-1.5">
                            <Label htmlFor="sprint-goals">Sprint Goals</Label>
                            <Textarea
                                id="sprint-goals"
                                placeholder="What should the team achieve this sprint related to this milestone?"
                                value={sprintGoals}
                                onChange={(e) => setSprintGoals(e.target.value)}
                                rows={4}
                            />
                        </div>
                        <div className="grid w-full gap-1.5">
                            <Label htmlFor="personal-goals">Personal Goals</Label>
                            <Textarea
                                id="personal-goals"
                                placeholder="What are your individual objectives or focus areas for this milestone?"
                                value={personalGoals}
                                onChange={(e) => setPersonalGoals(e.target.value)}
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" onClick={handleSaveChanges}>Save Goals</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    };

    export default MilestoneGoalsDialog;
  