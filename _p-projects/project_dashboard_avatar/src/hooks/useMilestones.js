
    import { useState, useEffect, useCallback } from 'react';
    import usePersistentState from './usePersistentState';
    import { useToast } from "@/components/ui/use-toast";

    const initialMilestones = [
      { id: 'ms-1', name: 'V1 Launch Readiness', projectId: 'proj-1', dueDate: '2025-05-30', status: 'On Track', progress: 75, goals: { sprint: 'Final testing, documentation.', personal: 'Review deployment script.' }, isArchived: false },
      { id: 'ms-2', name: 'Post-Launch Marketing Blitz', projectId: 'proj-1', dueDate: '2025-06-15', status: 'Planning', progress: 10, goals: { sprint: 'Plan ad campaigns.', personal: 'Draft press release.' }, isArchived: false },
      { id: 'ms-3', name: 'Alpha Feature Rollout', projectId: 'proj-2', dueDate: '2025-06-05', status: 'Delayed', progress: 40, goals: { sprint: 'Fix blocking bugs.', personal: 'Update user guides.' }, isArchived: false },
    ];

    let milestoneIdCounter = initialMilestones.length + 1;

    const useMilestones = () => {
      const [milestones, setMilestones] = usePersistentState('milestonesData', initialMilestones);
      const { toast } = useToast();

      const addMilestone = useCallback((milestoneData) => {
        const newId = `ms-${milestoneIdCounter++}`;
        const newMilestone = {
          id: newId,
          name: milestoneData.name || `New Milestone ${milestoneIdCounter - 1}`,
          projectId: milestoneData.projectId || null, // Assign project ID if provided
          dueDate: milestoneData.dueDate || new Date().toISOString().split('T')[0],
          status: milestoneData.status || 'Planning',
          progress: milestoneData.progress || 0,
          goals: milestoneData.goals || { sprint: '', personal: '' },
          isArchived: false,
        };
        setMilestones(prev => [...prev, newMilestone]);
        toast({ title: "Milestone Added", description: `"${newMilestone.name}" created.` });
        return newId;
      }, [setMilestones, toast]);

      const updateMilestone = useCallback((id, updates) => {
        setMilestones(prev => prev.map(ms => ms.id === id ? { ...ms, ...updates } : ms));
        // Optional: Add toast notification
      }, [setMilestones]);

      const deleteMilestone = useCallback((id) => {
        setMilestones(prev => prev.filter(ms => ms.id !== id));
        toast({ title: "Milestone Deleted", variant: "destructive" });
      }, [setMilestones, toast]);

      const updateMilestoneGoals = useCallback((id, goals) => {
        setMilestones(prev => prev.map(ms => ms.id === id ? { ...ms, goals: { ...ms.goals, ...goals } } : ms));
        toast({ title: "Milestone Goals Updated" });
      }, [setMilestones, toast]);

      const archiveMilestone = useCallback((id) => {
         setMilestones(prev => prev.map(ms => ms.id === id ? { ...ms, isArchived: true, status: 'Completed' } : ms));
         toast({ title: "Milestone Completed", description: "Milestone marked as done and archived." });
      }, [setMilestones, toast]);


      return {
        milestones,
        addMilestone,
        updateMilestone,
        deleteMilestone,
        updateMilestoneGoals,
        archiveMilestone, // Expose the new archive function
      };
    };

    export default useMilestones;
  