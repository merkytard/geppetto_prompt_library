
    import React, { useEffect, useState } from 'react';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
    import { motion } from 'framer-motion';
    import { Share2, ListChecks, Flag, Brain, Activity, Users, BarChart3 } from 'lucide-react';
    import { getIconComponent } from '@/data/icons';
    import ProjectMemberChart from '@/components/ProjectMemberChart';
    import ProjectSprintChart from '@/components/ProjectSprintChart';
    import TamagotchiAvatar from '@/components/TamagotchiAvatar'; 
    import useKanbanData from '@/hooks/useKanbanData'; 
    import useJiraData from '@/hooks/useJiraData';
    import useGamification from '@/hooks/useGamification';

    const ProjectDetailView = ({ project }) => {
      const { columns: kanbanColumns } = useKanbanData(project?.id);
      const { columns: jiraColumns, milestones: jiraMilestones } = useJiraData(); 
      const { tamagotchiState, getProjectSpirit } = useGamification(); 

      const [projectStats, setProjectStats] = useState({
        kanbanTasksOpen: 0,
        kanbanTasksCompleted: 0, 
        jiraTasksOpen: 0,
        jiraTasksCompleted: 0,
        activeMilestones: 0,
      });
      
      const projectSpirit = project ? getProjectSpirit(project.id) : null;

      useEffect(() => {
        if (project) {
          let kanbanOpen = 0;
          let kanbanDone = 0;
          kanbanColumns.forEach(col => {
            col.cards.forEach(card => {
              if (card.projectId === project.id) {
                if (col.title.toLowerCase() === 'done' || col.title.toLowerCase() === 'completed' || card.status === 'COMPLETED') {
                  kanbanDone++;
                } else {
                  kanbanOpen++;
                }
              }
            });
          });

          let jiraOpen = 0;
          let jiraDone = 0;
          jiraColumns.forEach(col => {
            col.cards.forEach(card => {
              if (card.projectId === project.id) {
                 if (col.title.toLowerCase() === 'done' || col.title.toLowerCase() === 'completed' || card.status === 'COMPLETED') {
                  jiraDone++;
                } else {
                  jiraOpen++;
                }
              }
            });
          });
          
          const activeProjectMilestones = jiraMilestones.filter(
            ms => ms.projectId === project.id && ms.status !== 'COMPLETED' && !ms.isArchived && ms.status !== 'ARCHIVED'
          ).length;

          setProjectStats({
            kanbanTasksOpen: kanbanOpen,
            kanbanTasksCompleted: kanbanDone,
            jiraTasksOpen: jiraOpen,
            jiraTasksCompleted: jiraDone,
            activeMilestones: activeProjectMilestones,
          });
        }
      }, [project, kanbanColumns, jiraColumns, jiraMilestones]);


      if (!project) {
        return (
            <div className="p-6 text-center text-muted-foreground flex flex-col items-center justify-center h-full">
                <BarChart3 className="h-16 w-16 mb-4 text-primary/30" />
                <p className="text-lg">Select a project to view its detailed dashboard.</p>
                <p className="text-sm">Key metrics, team overview, and progress will appear here.</p>
            </div>
        );
      }

      const IconComponent = getIconComponent(project.icon);

      const StatCard = ({ title, value, icon, color }) => (
        <Card className={`bg-gradient-to-br ${color || 'from-card to-muted/30'} shadow-md`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{value}</div>
          </CardContent>
        </Card>
      );

      return (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="space-y-6 p-1" 
        >
          <Card className="shadow-lg border-primary/20">
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                 <div className="flex items-center gap-3">
                    <IconComponent className="h-8 w-8 text-primary" />
                    <div>
                        <CardTitle className="text-xl md:text-2xl">{project.name}</CardTitle>
                        {project.description && (
                            <CardDescription className="pt-1 text-xs sm:text-sm">{project.description}</CardDescription>
                        )}
                    </div>
                 </div>
                 <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs gold-button flex-shrink-0 w-full sm:w-auto"
                    onClick={() => alert(`Navigate to NodeBase for project ${project.id} (WIP)`)}
                 >
                    <Brain className="mr-1.5 h-3.5 w-3.5"/> View in NodeBase
                 </Button>
              </div>
            </CardHeader>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <StatCard title="Kanban Tasks Open" value={projectStats.kanbanTasksOpen} icon={<ListChecks className="h-4 w-4 text-muted-foreground" />} color="from-blue-500/10 to-blue-600/5" />
            <StatCard title="Jira Issues Open" value={projectStats.jiraTasksOpen} icon={<ListChecks className="h-4 w-4 text-muted-foreground" />} color="from-sky-500/10 to-sky-600/5" />
            <StatCard title="Active Milestones" value={projectStats.activeMilestones} icon={<Flag className="h-4 w-4 text-muted-foreground" />} color="from-green-500/10 to-green-600/5" />
            <StatCard title="Kanban Tasks Done" value={projectStats.kanbanTasksCompleted} icon={<ListChecks className="h-4 w-4 text-muted-foreground" />} color="from-emerald-500/10 to-emerald-600/5" />
            <StatCard title="Jira Issues Done" value={projectStats.jiraTasksCompleted} icon={<ListChecks className="h-4 w-4 text-muted-foreground" />} color="from-teal-500/10 to-teal-600/5" />
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <ProjectSprintChart projectId={project.id} />
            <ProjectMemberChart projectId={project.id} />
            
            <Card className="lg:col-span-1 flex flex-col items-center justify-center p-2 shadow-md">
              <CardHeader className="pb-2 text-center">
                <CardTitle className="text-base">Team Spirit</CardTitle>
                <CardDescription className="text-xs">Project's Tamagotchi</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center">
                {projectSpirit ? (
                  <TamagotchiAvatar state={{...projectSpirit, name: `${project.name.split(' ')[0]} Spirit` }} size="default" />
                ) : (
                  <div className="text-center text-muted-foreground p-4">
                    <Users className="h-12 w-12 mx-auto mb-2 text-primary/30" />
                    <p className="text-sm">Team avatar not active.</p>
                    <p className="text-xs">Complete tasks to boost team spirit!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

        </motion.div>
      );
    };

    export default ProjectDetailView;
  