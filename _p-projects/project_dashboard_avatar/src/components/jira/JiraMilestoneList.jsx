
    import React, { useState } from 'react';
    import { Button } from '@/components/ui/button';
    import { Progress } from '@/components/ui/progress';
    import { ScrollArea } from '@/components/ui/scroll-area';
    import { CalendarDays, Target, CheckSquare, Archive } from 'lucide-react';
    import MilestoneGoalsDialog from '@/components/jira/MilestoneGoalsDialog';
    import {
        AlertDialog,
        AlertDialogAction,
        AlertDialogCancel,
        AlertDialogContent,
        AlertDialogDescription,
        AlertDialogFooter,
        AlertDialogHeader,
        AlertDialogTitle,
        AlertDialogTrigger,
    } from "@/components/ui/alert-dialog";
    import { motion } from 'framer-motion';
    import { useToast } from "@/components/ui/use-toast";

    const JiraMilestoneList = ({ milestones, selectedProjectId, projects, onUpdateGoals, onAddMilestone, onArchiveMilestone }) => {
        const [isGoalsDialogOpen, setIsGoalsDialogOpen] = useState(false);
        const [selectedMilestoneForGoals, setSelectedMilestoneForGoals] = useState(null);
        const { toast } = useToast();

        const handleOpenGoalsDialog = (milestone) => {
            setSelectedMilestoneForGoals(milestone);
            setIsGoalsDialogOpen(true);
        };

        const handleSaveGoals = (milestoneId, newGoals) => {
            if (onUpdateGoals) {
                onUpdateGoals(milestoneId, newGoals);
            }
            setIsGoalsDialogOpen(false);
        };

        const getProjectName = (projectId) => {
            if (!projects || projects.length === 0) return '...';
            const project = projects.find(p => p.id === projectId);
            return project ? project.name : 'Unknown Project';
        };
        
        const handleArchiveConfirm = (milestone) => {
            if (onArchiveMilestone) {
                onArchiveMilestone(milestone.id);
                toast({
                    title: "Milestone Archived",
                    description: `"${milestone.name}" has been marked as done and archived.`,
                    action: <Archive className="h-5 w-5 text-gray-500" />
                });
            }
        };

        const activeMilestones = milestones.filter(ms => !ms.isArchived);

        const itemVariants = {
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
            exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
        };

        return (
            <>
                <div className="p-4 md:p-6 border rounded-lg bg-card text-card-foreground h-full flex flex-col">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 flex-shrink-0">
                        <h2 className="text-lg md:text-xl font-semibold">
                            Milestones for {selectedProjectId === 'all' ? 'All Projects' : `Project: ${getProjectName(selectedProjectId)}`}
                        </h2>
                        <Button variant="outline" size="sm" className="gold-button text-xs sm:text-sm w-full sm:w-auto" onClick={() => onAddMilestone ? onAddMilestone({}) : null}>+ Add Milestone</Button>
                    </div>
                    <ScrollArea className="flex-grow pr-2">
                        <motion.div layout className="space-y-4">
                            {activeMilestones.map(milestone => (
                                <motion.div
                                    key={milestone.id}
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    layout
                                    className="p-3 md:p-4 border rounded-md bg-background shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-grow">
                                            <h3 className="font-semibold text-sm md:text-base">{milestone.name}</h3>
                                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                <CalendarDays className="h-3 w-3" /> Due: {milestone.dueDate} • Status: {milestone.status}
                                            </p>
                                            {selectedProjectId === 'all' && (
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Project: {getProjectName(milestone.projectId)}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-green-600 hover:text-green-700 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-full" title="Mark as Done">
                                                        <CheckSquare className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Complete Milestone?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Marking "{milestone.name}" as done will archive it.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleArchiveConfirm(milestone)} className="bg-green-600 hover:bg-green-700">
                                                            Mark as Done
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/20 rounded-full" onClick={() => handleOpenGoalsDialog(milestone)} title="View/Edit Goals">
                                                <Target className="h-4 w-4" />
                                            </Button>
                                            <span className="text-sm font-medium text-primary">{milestone.progress}%</span>
                                        </div>
                                    </div>
                                    <Progress value={milestone.progress} className="h-1.5 md:h-2" indicatorClassName="bg-gradient-to-r from-blue-500 to-primary" />
                                </motion.div>
                            ))}
                            {activeMilestones.length === 0 && <p className="text-muted-foreground text-center py-4">No active milestones match the current filter.</p>}
                        </motion.div>
                    </ScrollArea>
                </div>

                {selectedMilestoneForGoals && (
                    <MilestoneGoalsDialog
                        isOpen={isGoalsDialogOpen}
                        onOpenChange={setIsGoalsDialogOpen}
                        milestone={selectedMilestoneForGoals}
                        onSave={handleSaveGoals}
                    />
                )}
            </>
        );
    };

    export default JiraMilestoneList;
  