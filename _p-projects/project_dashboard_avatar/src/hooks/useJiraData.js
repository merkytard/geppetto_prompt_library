
    import { useState, useEffect, useCallback, useMemo } from 'react';
    import usePersistentState from '@/hooks/usePersistentState';
    import { useToast } from "@/components/ui/use-toast";
    import { 
        initialJiraColumns as initialColumns, 
        initialJiraUsers as initialUsers, 
        initialJiraTags as initialTags, 
        initialJiraProjects as initialProjectsData, 
        initialJiraMilestones as initialMilestones 
    } from '@/data/initialJiraData.js';
    import useGamification from '@/hooks/useGamification';
    import { produce } from 'immer'; 
    import {
        updateColumnsOnAddCard,
        updateColumnsOnEditCard,
        updateColumnsOnDeleteCard,
        updateColumnsOnAssignUser,
        updateColumnsOnChangeColor,
        updateColumnsOnLinkNode,
        updateColumnsOnArchiveCard,
        updateColumnsOnSetReminder
    } from '@/lib/kanbanActionHelpers'; 
    import useProjects from '@/hooks/useProjects';

    const useJiraData = () => {
        const { toast } = useToast();
        const { projects: allAppProjects } = useProjects(); 

        const [projects, setProjects] = usePersistentState('jiraProjects_v2', initialProjectsData);
        const [columns, setColumns] = usePersistentState('jiraColumns_v2', initialColumns);
        const [users, setUsers] = usePersistentState('jiraUsers_v2', initialUsers);
        const [tags, setTags] = usePersistentState('jiraTags_v2', initialTags);
        const [milestones, setMilestones] = usePersistentState('jiraMilestones_v2', initialMilestones);
        const [archivedCards, setArchivedCards] = usePersistentState('jiraArchivedCards_v2', []);
        const { awardXP } = useGamification();

        const addJiraTask = useCallback((cardData, targetColumnId, projectId) => {
            setColumns(prevColumns => {
                const { updatedColumns, cardTitle } = updateColumnsOnAddCard(cardData, targetColumnId, projectId)(prevColumns);
                toast({ title: "Task Added", description: `New Jira task "${cardTitle}" created.` });
                return updatedColumns;
            });
        }, [setColumns, toast]);


        const handleUpdateCard = useCallback((columnId, cardId, updatedData) => {
            setColumns(prevColumns => {
                const { updatedColumns, cardTitle } = updateColumnsOnEditCard(columnId, cardId, updatedData)(prevColumns);
                toast({ title: "Task Updated", description: `Task "${cardTitle}" details modified.` });
                return updatedColumns;
            });
        }, [setColumns, toast]);

        const handleDeleteCard = useCallback((columnId, cardId) => {
            setColumns(prevColumns => {
                const { updatedColumns, cardTitle } = updateColumnsOnDeleteCard(columnId, cardId)(prevColumns);
                toast({ title: "Task Deleted", description: `Task "${cardTitle}" removed.`, variant: "destructive" });
                return updatedColumns;
            });
        }, [setColumns, toast]);

        const handleAssignUser = useCallback((columnId, cardId, userId) => {
            setColumns(prevColumns => {
                const { updatedColumns, cardTitle } = updateColumnsOnAssignUser(columnId, cardId, userId)(prevColumns);
                const user = users.find(u => u.id === userId);
                const action = userId === null ? 'unassigned from' : (prevColumns.flatMap(col=>col.cards).find(c=>c.id === cardId)?.assignedUserIds?.includes(userId) ? 'assigned to' : 'unassigned from');
                toast({ title: "User Assignment", description: `${user ? user.name : 'User'} ${action} task "${cardTitle}".` });
                return updatedColumns;
            });
        }, [setColumns, users, toast]);

        const handleChangeCardColor = useCallback((columnId, cardId, colorValue) => {
            setColumns(prevColumns => {
                const { updatedColumns, cardTitle } = updateColumnsOnChangeColor(columnId, cardId, colorValue)(prevColumns);
                toast({ title: "Task Color Changed", description: `Color updated for task "${cardTitle}".` });
                return updatedColumns;
            });
        }, [setColumns, toast]);

        const handleLinkToNode = useCallback((cardId, nodeId) => {
             setColumns(prevColumns => {
                const { updatedColumns, cardTitle } = updateColumnsOnLinkNode(cardId, nodeId)(prevColumns);
                const action = nodeId ? 'linked to' : 'unlinked from';
                const nodeIdentifier = nodeId ? `Node ${nodeId.substring(0, 6)}...` : 'NodeBase';
                toast({ title: "Node Link Updated", description: `Task "${cardTitle}" ${action} ${nodeIdentifier}.` });
                return updatedColumns;
            });
        }, [setColumns, toast]);

        const handleArchiveCard = useCallback((columnId, cardId) => {
            setColumns(prevColumns => {
                const { updatedColumns, cardTitle, archivedCard } = updateColumnsOnArchiveCard(columnId, cardId)(prevColumns);
                if (archivedCard) {
                    setArchivedCards(prev => [...prev, archivedCard]);
                    toast({ title: "Task Archived", description: `Task "${cardTitle}" moved to archive.` });
                }
                return updatedColumns;
            });
        }, [setColumns, setArchivedCards, toast]);
        
        const handleCompleteCard = useCallback((columnId, cardId) => {
            let cardToComplete = null;
            let originalColumnId = columnId; 

            const allCards = columns.flatMap(col => col.cards);
            cardToComplete = allCards.find(c => c.id === cardId);

            if (!cardToComplete) {
                toast({ title: "Error", description: "Task not found for completion.", variant: "destructive" });
                return;
            }
            
            setColumns(prevColumns => 
                produce(prevColumns, draft => {
                    let cardFoundAndRemoved = false;
                    for (const col of draft) {
                        const cardIndex = col.cards.findIndex(c => c.id === cardId);
                        if (cardIndex !== -1) {
                            col.cards.splice(cardIndex, 1);
                            cardFoundAndRemoved = true;
                            break; 
                        }
                    }
                    if(!cardFoundAndRemoved && originalColumnId){ 
                         const col = draft.find(c => c.id === originalColumnId);
                         if(col){
                            const cardIndex = col.cards.findIndex(c => c.id === cardId);
                            if (cardIndex !== -1) {
                                col.cards.splice(cardIndex, 1);
                            }
                         }
                    }
                })
            );
            
            awardXP(cardToComplete.xpValue || 25, cardToComplete.title || "Task", cardToComplete.projectId);
            // Toast is handled by awardXP in useGamification
        }, [columns, setColumns, awardXP, toast]);


        const handleSetReminder = useCallback((columnId, cardId, settings) => {
            setColumns(prevColumns => {
                const { updatedColumns, cardTitle } = updateColumnsOnSetReminder(columnId, cardId, settings)(prevColumns);
                const frequencyText = settings.frequency === 'none' ? 'removed' : `set to ${settings.frequency.replace('_', ' ')}`;
                toast({ title: "Reminder Updated", description: `Reminder for task "${cardTitle}" ${frequencyText}.` });
                return updatedColumns;
            });
        }, [setColumns, toast]);

        const addMilestone = useCallback((milestoneData) => {
            const newMilestone = {
                id: `ms-jira-${Date.now()}`, 
                name: milestoneData.title || 'New Milestone',
                description: milestoneData.description || '',
                dueDate: milestoneData.dueDate || new Date().toISOString().split('T')[0],
                projectId: milestoneData.projectId || (projects.length > 0 ? projects[0].id : 'jira-proj-1'),
                status: 'IN_PROGRESS', 
                progress: 0,
                goals: [], 
            };
            setMilestones(prev => [...prev, newMilestone]);
            toast({ title: "Milestone Added", description: `Milestone "${newMilestone.name}" created.` });
        }, [setMilestones, toast, projects]);

        const updateMilestoneGoals = useCallback((milestoneId, goals) => {
            setMilestones(prev => prev.map(ms => {
                if (ms.id === milestoneId) {
                    const completedGoals = goals.filter(g => g.completed).length;
                    const progress = goals.length > 0 ? Math.round((completedGoals / goals.length) * 100) : 0;
                    return { ...ms, goals, progress };
                }
                return ms;
            }));
            toast({ title: "Milestone Updated", description: `Goals updated for milestone.` });
        }, [setMilestones, toast]);

        const archiveMilestone = useCallback((milestoneId) => {
            setMilestones(prev => prev.map(ms => ms.id === milestoneId ? { ...ms, status: 'ARCHIVED', isArchived: true } : ms)); 
            const milestone = milestones.find(ms => ms.id === milestoneId);
            toast({ title: "Milestone Archived", description: `Milestone "${milestone?.name}" archived.` });
        }, [setMilestones, milestones, toast]);


        return {
            projects: allAppProjects, // Use projects from useProjects for consistency
            columns, 
            users,
            tags,
            milestones,
            archivedCards, 
            
            addJiraTask,
            handleUpdateCard,
            handleDeleteCard,
            handleAssignUser,
            handleChangeCardColor,
            handleLinkToNode,
            handleArchiveCard,
            handleCompleteCard,
            handleSetReminder,

            addMilestone,
            updateMilestoneGoals,
            archiveMilestone,
        };
    };

    export default useJiraData;
  