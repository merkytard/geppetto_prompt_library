
    import React, { useState, useMemo, useCallback } from 'react';
    import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
    import { Button } from '@/components/ui/button';
    import { PlusCircle, Filter, LayoutDashboard, ListChecks, CalendarDays, Settings2, ChevronLeft, ChevronRight, Users, Award, Activity } from 'lucide-react';
    import {
      DropdownMenu,
      DropdownMenuContent,
      DropdownMenuRadioGroup,
      DropdownMenuRadioItem,
      DropdownMenuLabel,
      DropdownMenuSeparator,
      DropdownMenuTrigger,
    } from "@/components/ui/dropdown-menu";
    import JiraLeftPanel from '@/components/jira/JiraLeftPanel';
    import JiraRightPanel from '@/components/jira/JiraRightPanel';
    import JiraTaskList from '@/components/jira/JiraTaskList';
    import JiraMilestoneList from '@/components/jira/JiraMilestoneList';
    import JiraCalendarView from '@/components/jira/JiraCalendarView';
    import AddCardDialog from '@/components/AddCardDialog';
    import useJiraData from '@/hooks/useJiraData';
    import useGamification from '@/hooks/useGamification';
    import { DndContext } from '@dnd-kit/core';
    import { useToast } from "@/components/ui/use-toast";
    import { cn } from '@/lib/utils';
    import { motion, AnimatePresence } from 'framer-motion';
    import TamagotchiAvatar from '@/components/TamagotchiAvatar';
    import Leaderboard from '@/components/Leaderboard';
    import EggSelection from '@/components/EggSelection';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
    import { ScrollArea } from '@/components/ui/scroll-area';


    const JiraPageContent = ({
        projects, columns, users, tags, milestones,
        handleUpdateCard, handleDeleteCard, handleAssignUser, handleChangeCardColor,
        handleLinkToNode, handleArchiveCard, handleCompleteCard, handleSetReminder,
        addMilestone, updateMilestoneGoals, archiveMilestone, addJiraTask,
        tamagotchiState, leaderboardData, handleChooseEgg,
        selectedProjectId, setSelectedProjectId,
        isAddTaskDialogOpen, setIsAddTaskDialogOpen,
        activeTab, setActiveTab,
        isRightPanelOpen, setIsRightPanelOpen
    }) => {
        const { toast } = useToast();

        const onCompleteCardWithXP = (columnId, cardId) => {
            const card = columns?.flatMap(col => col.cards).find(c => c.id === cardId);
            if (card) {
                handleCompleteCard(columnId, cardId);
            }
        };

        const handleActualAddTask = (cardData) => {
            if (!columns || columns.length === 0) {
                toast({ title: "Cannot Add Task", description: "Please add a Jira column/status first (via Kanban settings or directly if Jira allows).", variant: "destructive" });
                return;
            }
            const targetColumnId = columns[0].id;
            addJiraTask(cardData, targetColumnId, selectedProjectId === 'all' ? (projects && projects.length > 0 ? projects[0].id : null) : selectedProjectId);
            setIsAddTaskDialogOpen(false);
        };
        
        const filteredColumns = useMemo(() => {
            if (!columns) return [];
            if (selectedProjectId === 'all') return columns;
            return columns.map(column => ({
                ...column,
                cards: column.cards.filter(card => card.projectId === selectedProjectId)
            }));
        }, [columns, selectedProjectId]);

        const allTasksForCalendar = useMemo(() => {
            if (!columns) return [];
            return columns.flatMap(col => col.cards.map(card => ({...card, columnId: col.id })));
        }, [columns]);

        const filteredMilestones = useMemo(() => {
            if (!milestones) return [];
            if (selectedProjectId === 'all') return milestones;
            return milestones.filter(ms => ms.projectId === selectedProjectId);
        }, [milestones, selectedProjectId]);

        const selectedProjectName = useMemo(() => {
            if (!projects) return "Loading...";
            if (selectedProjectId === 'all') return "All Projects";
            const project = projects.find(p => p.id === selectedProjectId);
            return project ? project.name : "Select Project";
        }, [selectedProjectId, projects]);

        const rightPanelVariants = {
            open: { width: '280px', opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
            closed: { width: 0, opacity: 0, x: 50, transition: { type: 'spring', stiffness: 300, damping: 30 } }
        };

        return (
            <>
                <header className="flex items-center justify-between p-3 border-b bg-card/80 backdrop-blur-sm sticky top-0 z-30">
                    <div className="flex items-center gap-2">
                        <LayoutDashboard className="h-6 w-6 text-primary" />
                        <h1 className="text-xl font-semibold text-foreground">Jira</h1>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="ml-2 text-xs sm:text-sm">
                                    <Filter className="h-3.5 w-3.5 mr-1.5" />
                                    {selectedProjectName}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                <DropdownMenuLabel>Filter by Project</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup value={selectedProjectId} onValueChange={setSelectedProjectId}>
                                    <DropdownMenuRadioItem value="all">All Projects</DropdownMenuRadioItem>
                                    {(projects || []).map((project) => (
                                        <DropdownMenuRadioItem key={project.id} value={project.id}>
                                            {project.name}
                                        </DropdownMenuRadioItem>
                                    ))}
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button size="sm" onClick={() => setIsAddTaskDialogOpen(true)} className="gold-button text-xs sm:text-sm">
                            <PlusCircle className="h-4 w-4 mr-1.5" />
                            Add Task
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setIsRightPanelOpen(!isRightPanelOpen)} className="ml-1 hidden xl:inline-flex">
                            {isRightPanelOpen ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                        </Button>
                    </div>
                </header>

                <main className="flex-1 p-1 sm:p-2 md:p-3 overflow-y-auto bg-slate-50 dark:bg-slate-800/50 rounded-lg m-1 md:m-2 shadow-inner">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                        <TabsList className="mb-2 sticky top-0 bg-card/90 backdrop-blur-sm z-10">
                            <TabsTrigger value="tasks" className="text-xs sm:text-sm px-2 sm:px-3 py-1.5">
                                <ListChecks className="h-4 w-4 mr-1.5" />Tasks
                            </TabsTrigger>
                            <TabsTrigger value="milestones" className="text-xs sm:text-sm px-2 sm:px-3 py-1.5">
                                <Settings2 className="h-4 w-4 mr-1.5" />Milestones
                            </TabsTrigger>
                            <TabsTrigger value="calendar" className="text-xs sm:text-sm px-2 sm:px-3 py-1.5">
                                <CalendarDays className="h-4 w-4 mr-1.5" />Calendar
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="tasks" className="flex-grow overflow-y-auto">
                            <JiraTaskList
                                columns={filteredColumns}
                                users={users || []}
                                projects={projects || []}
                                selectedProjectId={selectedProjectId}
                                onUpdateCard={handleUpdateCard}
                                onDeleteCard={handleDeleteCard}
                                onAssignUser={handleAssignUser}
                                onChangeCardColor={handleChangeCardColor}
                                onLinkToNode={handleLinkToNode}
                                onArchiveCard={handleArchiveCard}
                                onCompleteCard={onCompleteCardWithXP}
                                onSetReminder={handleSetReminder}
                            />
                        </TabsContent>
                        <TabsContent value="milestones" className="flex-grow overflow-y-auto">
                            <JiraMilestoneList
                                milestones={filteredMilestones}
                                projects={projects || []}
                                selectedProjectId={selectedProjectId}
                                onAddMilestone={addMilestone}
                                onUpdateGoals={updateMilestoneGoals}
                                onArchiveMilestone={archiveMilestone}
                            />
                        </TabsContent>
                        <TabsContent value="calendar" className="flex-grow overflow-y-auto">
                            <JiraCalendarView 
                                allCards={allTasksForCalendar} 
                                milestones={milestones || []} 
                                selectedProjectId={selectedProjectId}
                                setReminderForCard={handleSetReminder}
                            />
                        </TabsContent>
                    </Tabs>
                </main>
                
                <AnimatePresence>
                {isRightPanelOpen && (
                     <motion.aside 
                        key="right-panel"
                        variants={rightPanelVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="p-2 border-l bg-card/50 backdrop-blur-sm overflow-y-auto no-scrollbar hidden xl:block flex-shrink-0"
                    >
                        <JiraRightPanel selectedProjectId={selectedProjectId} projects={projects || []} />
                    </motion.aside>
                )}
                </AnimatePresence>

                <AddCardDialog
                    isOpen={isAddTaskDialogOpen}
                    onOpenChange={setIsAddTaskDialogOpen}
                    onAddCard={handleActualAddTask}
                    users={users || []}
                    tags={tags || []}
                    defaultColumnId={columns && columns.length > 0 ? columns[0].id : null}
                    projects={projects || []}
                    selectedProjectId={selectedProjectId}
                    isJiraContext={true}
                />
            </>
        );
    };


    const JiraPage = () => {
        const jiraData = useJiraData();
        const gamificationData = useGamification();

        const [selectedProjectId, setSelectedProjectId] = useState('all');
        const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
        const [activeTab, setActiveTab] = useState("tasks");
        const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
        const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);

        const panelVariants = {
            open: { width: '320px', opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
            closed: { width: 0, opacity: 0, x: -50, transition: { type: 'spring', stiffness: 300, damping: 30 } }
        };

        return (
            <DndContext onDragEnd={() => { /* Placeholder for future DND */ }}>
                <div className="flex h-full max-h-[calc(100vh-var(--header-height,64px))] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                    <AnimatePresence>
                    {isLeftPanelOpen && (
                        <motion.aside 
                            key="left-panel"
                            variants={panelVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            className="border-r bg-card/50 backdrop-blur-sm overflow-y-auto no-scrollbar flex-shrink-0"
                        >
                            <div className="p-3 space-y-4">
                                {gamificationData.tamagotchiState && gamificationData.tamagotchiState.hasChosen ? (
                                  <Card className="bg-gradient-to-br from-card to-muted/30 shadow-lg border-primary/10">
                                    <CardHeader className="p-4 text-center">
                                      <CardTitle className="text-xl">My Companion</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-col items-center p-4">
                                      <TamagotchiAvatar state={gamificationData.tamagotchiState} size="large" />
                                    </CardContent>
                                  </Card>
                                ) : (
                                  <Card className="bg-gradient-to-br from-card to-muted/30 shadow-lg border-primary/10">
                                    <CardHeader className="p-4 text-center">
                                      <CardTitle className="text-xl">Choose Your Companion!</CardTitle>
                                      <CardDescription className="text-sm">A new friend awaits to guide you.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-4">
                                      <EggSelection onHatch={gamificationData.handleChooseEgg} />
                                    </CardContent>
                                  </Card>
                                )}

                                <Card className="bg-card shadow-md">
                                  <CardHeader className="p-3">
                                    <CardTitle className="text-base flex items-center">
                                      <Award className="h-4 w-4 mr-2 text-yellow-500" />
                                      Leaderboard
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="p-3">
                                    <Leaderboard data={gamificationData.leaderboardData || []} currentUser={gamificationData.tamagotchiState?.name} />
                                  </CardContent>
                                </Card>

                                <Card className="bg-card shadow-md">
                                  <CardHeader className="p-3">
                                    <CardTitle className="text-base flex items-center">
                                      <Users className="h-4 w-4 mr-2 text-blue-500" />
                                      Team Members
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="p-3 text-xs">
                                    {jiraData.users && jiraData.users.length > 0 ? (
                                      <ul className="space-y-1.5">
                                        {jiraData.users.map(user => (
                                          <li key={user.id} className="flex items-center gap-2 p-1.5 rounded bg-muted/50">
                                            <img  alt={user.name} class="w-5 h-5 rounded-full" src="https://images.unsplash.com/photo-1675270714610-11a5cadcc7b3" />
                                            <span>{user.name}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <p className="text-muted-foreground">No users found.</p>
                                    )}
                                  </CardContent>
                                </Card>
                                
                                <Card className="bg-card shadow-md">
                                  <CardHeader className="p-3">
                                    <CardTitle className="text-base flex items-center">
                                      <Activity className="h-4 w-4 mr-2 text-green-500" />
                                      Recent Activity
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="p-3 text-xs text-muted-foreground">
                                    <p>Activity feed coming soon...</p>
                                  </CardContent>
                                </Card>
                            </div>
                        </motion.aside>
                    )}
                    </AnimatePresence>
                    
                    <div className="flex flex-col flex-1 overflow-hidden">
                         <Button variant="ghost" size="icon" onClick={() => setIsLeftPanelOpen(!isLeftPanelOpen)} className="absolute top-3 left-3 z-40 bg-card/70 hover:bg-card md:hidden">
                            {isLeftPanelOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                        </Button>
                        <JiraPageContent
                            {...jiraData}
                            {...gamificationData}
                            selectedProjectId={selectedProjectId}
                            setSelectedProjectId={setSelectedProjectId}
                            isAddTaskDialogOpen={isAddTaskDialogOpen}
                            setIsAddTaskDialogOpen={setIsAddTaskDialogOpen}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            isRightPanelOpen={isRightPanelOpen}
                            setIsRightPanelOpen={setIsRightPanelOpen}
                        />
                    </div>
                </div>
            </DndContext>
        );
    };

    export default JiraPage;
  