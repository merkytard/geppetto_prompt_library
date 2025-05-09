
    import React from 'react';
    import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
    import { BarChart, Users, CheckCircle, Activity, Info, TrendingUp, Loader2 } from 'lucide-react';
    import { Progress } from '@/components/ui/progress';

    const JiraRightPanel = ({ selectedProjectId, projects }) => {
        if (!projects) {
            return (
                <Card className="h-full flex flex-col items-center justify-center shadow-md bg-background/70 backdrop-blur-sm">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="mt-2 text-muted-foreground">Loading project data...</p>
                </Card>
            );
        }

        const project = selectedProjectId !== 'all' ? projects.find(p => p.id === selectedProjectId) : null;
        
        const globalStats = {
            totalTasks: projects.reduce((acc, p) => acc + (p.tasksCount || 0), 125), // Default or sum if available
            completedTasks: projects.reduce((acc, p) => acc + (p.completedTasksCount || 0), 80),
            activeSprints: 3, 
            teamVelocity: 25, 
        };

        if (selectedProjectId === 'all' || !project) {
            return (
                <Card className="h-full flex flex-col shadow-md bg-background/70 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                            <Info className="h-5 w-5 mr-2 text-primary" />
                            Global Project Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm overflow-y-auto">
                        <p className="text-muted-foreground">Showing statistics for all projects.</p>
                        <div className="flex items-center justify-between">
                            <span>Total Tasks:</span>
                            <span className="font-semibold">{globalStats.totalTasks}</span>
                        </div>
                        {globalStats.totalTasks > 0 && (
                            <>
                                <Progress value={(globalStats.completedTasks / globalStats.totalTasks) * 100} className="h-2" />
                                <p className="text-xs text-muted-foreground text-right">{globalStats.completedTasks} / {globalStats.totalTasks} completed</p>
                            </>
                        )}

                        <div className="flex items-center justify-between">
                            <span>Active Sprints:</span>
                            <span className="font-semibold">{globalStats.activeSprints}</span>
                        </div>
                         <div className="flex items-center justify-between">
                            <span>Avg. Team Velocity:</span>
                            <span className="font-semibold">{globalStats.teamVelocity} SP</span>
                        </div>
                        <p className="text-xs text-muted-foreground pt-2 border-t mt-3">
                            Select a specific project to see detailed information.
                        </p>
                    </CardContent>
                </Card>
            );
        }

        const projectStats = {
            tasks: project.tasksCount || 45,
            completed: project.completedTasksCount || 30,
            members: project.teamMembers?.length || 5,
            velocity: project.velocity || 22,
            sprintProgress: project.currentSprintProgress || 60,
            sprintGoal: project.currentSprintGoal || 'Launch Beta Version',
        };

        return (
            <div className="h-full overflow-y-auto p-1 pr-2 no-scrollbar">
                <Card className="shadow-md bg-background/70 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center">
                            <BarChart className="h-4 w-4 mr-2 text-primary" />
                            Project Stats: {project.name}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                            <span>Tasks:</span>
                            <span className="font-semibold">{projectStats.tasks}</span>
                        </div>
                        {projectStats.tasks > 0 && (
                            <>
                                <Progress value={(projectStats.completed / projectStats.tasks) * 100} className="h-1.5" />
                                <p className="text-xs text-muted-foreground text-right">{projectStats.completed} / {projectStats.tasks} completed</p>
                            </>
                        )}

                        <div className="flex items-center justify-between pt-1">
                            <Users className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                            <span>Team Members:</span>
                            <span className="font-semibold">{projectStats.members}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <TrendingUp className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                            <span>Velocity:</span>
                            <span className="font-semibold">{projectStats.velocity} SP</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="mt-4 shadow-md bg-background/70 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center">
                            <Activity className="h-4 w-4 mr-2 text-green-500" />
                            Active Sprint
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-xs">
                        <p className="font-medium text-slate-700 dark:text-slate-200">Sprint Goal: <span className="text-primary">{projectStats.sprintGoal}</span></p>
                        <Progress value={projectStats.sprintProgress} indicatorClassName="bg-green-500" className="h-1.5" />
                        <p className="text-xs text-muted-foreground text-right">{projectStats.sprintProgress}% complete</p>
                        <p className="text-muted-foreground pt-1">Days Remaining: <span className="font-semibold text-slate-700 dark:text-slate-200">5 days</span></p>
                    </CardContent>
                </Card>
            </div>
        );
    };

    export default JiraRightPanel;
  