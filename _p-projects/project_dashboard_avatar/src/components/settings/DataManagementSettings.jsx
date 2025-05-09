
    import React, { useState } from 'react';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
    import { Button } from "@/components/ui/button";
    import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
    import { DatabaseZap, RotateCcw, Trash2 } from 'lucide-react';
    import { useToast } from "@/components/ui/use-toast";
    import { initialKanbanData, initialUsers as initialKanbanUsers, initialTags as initialKanbanTags } from '@/data/initialKanbanData';
    import { 
        initialJiraProjects, 
        initialJiraColumns, 
        initialJiraUsers, 
        initialJiraTags, 
        initialJiraMilestones 
    } from '@/data/initialJiraData';
    import { initialNodesData, initialEdgesData, initialBookmarksData, initialWallsData } from '@/hooks/nodebase/useNodeBaseCoreState';
    import { defaultSettings as initialAppSettings } from '@/hooks/useAppSettings';
    import { initialProjects } from '@/hooks/useProjects';

    const DataManagementSettings = () => {
      const { toast } = useToast();
      const [isResetAllDialogOpen, setIsResetAllDialogOpen] = useState(false);

      const resetAllData = () => {
        try {
          localStorage.removeItem('projects_v3');
          localStorage.removeItem('kanbanColumns_v3');
          localStorage.removeItem('kanbanUsers_v2');
          localStorage.removeItem('kanbanTags_v2');
          localStorage.removeItem('kanbanArchivedCards_v2');
          localStorage.removeItem('jiraProjects_v1');
          localStorage.removeItem('jiraColumns_v1');
          localStorage.removeItem('jiraUsers_v1');
          localStorage.removeItem('jiraTags_v1');
          localStorage.removeItem('jiraMilestones_v1');
          localStorage.removeItem('jiraArchivedCards_v1');
          localStorage.removeItem('nodebaseAllNodes_v2');
          localStorage.removeItem('nodebaseAllEdges_v2');
          localStorage.removeItem('nodebaseBookmarks_v2');
          localStorage.removeItem('nodebaseWalls_v2');
          localStorage.removeItem('nodebaseCurrentWall_v2');
          localStorage.removeItem('appSettings');
          localStorage.removeItem('tamagotchiState');
          localStorage.removeItem('vite-ui-theme'); 
          localStorage.removeItem('chatGptApiKeyInput');
          localStorage.removeItem('integrationStatus');

          localStorage.setItem('projects_v3', JSON.stringify(initialProjects));
          localStorage.setItem('kanbanColumns_v3', JSON.stringify(initialKanbanData));
          localStorage.setItem('kanbanUsers_v2', JSON.stringify(initialKanbanUsers));
          localStorage.setItem('kanbanTags_v2', JSON.stringify(initialKanbanTags));
          localStorage.setItem('jiraProjects_v1', JSON.stringify(initialJiraProjects));
          localStorage.setItem('jiraColumns_v1', JSON.stringify(initialJiraColumns));
          localStorage.setItem('jiraUsers_v1', JSON.stringify(initialJiraUsers));
          localStorage.setItem('jiraTags_v1', JSON.stringify(initialJiraTags));
          localStorage.setItem('jiraMilestones_v1', JSON.stringify(initialJiraMilestones));
          localStorage.setItem('nodebaseAllNodes_v2', JSON.stringify(initialNodesData));
          localStorage.setItem('nodebaseAllEdges_v2', JSON.stringify(initialEdgesData));
          localStorage.setItem('nodebaseBookmarks_v2', JSON.stringify(initialBookmarksData));
          localStorage.setItem('nodebaseWalls_v2', JSON.stringify(initialWallsData));
          localStorage.setItem('nodebaseCurrentWall_v2', JSON.stringify('default'));
          localStorage.setItem('appSettings', JSON.stringify(initialAppSettings));
          localStorage.setItem('tamagotchiState', JSON.stringify({
            name: "Sparky", type: "chameleon", level: 1, xp: 0, xpToNextLevel: 100,
            mood: "happy", energy: 100, hunger: 0, evolutionStage: 1, hasChosen: false,
            lastInteractionTime: Date.now(), lastFedTime: Date.now(), lastPlayedTime: Date.now()
          }));
          localStorage.setItem('vite-ui-theme', JSON.stringify('light'));


          toast({
            title: "Application Reset Successful",
            description: "All application data has been reset to defaults. Please refresh the page.",
            variant: "success",
            duration: 5000,
          });
        } catch (error) {
          console.error("Error resetting application data:", error);
          toast({
            title: "Error Resetting Data",
            description: "Could not reset all application data. Check console for details.",
            variant: "destructive",
          });
        }
        setIsResetAllDialogOpen(false);
      };

      return (
        <Card className="shadow-sm border-destructive/50">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2 text-destructive">
              <DatabaseZap className="h-5 w-5" /> Data Management
            </CardTitle>
            <CardDescription className="pt-1">
              Manage application data, including resetting to default state. Use with caution.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-1 text-destructive/90">Reset Application Data</h3>
              <p className="text-sm text-muted-foreground mb-2">
                This will clear all locally stored data (projects, tasks, nodes, settings, etc.) and restore the application to its initial default state. This action is irreversible.
              </p>
              <AlertDialog open={isResetAllDialogOpen} onOpenChange={setIsResetAllDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="mr-2 h-4 w-4" /> Reset All Application Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete all your current application data from local storage and reset everything to its default state.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={resetAllData} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                      Yes, Reset Everything
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      );
    };

    export default DataManagementSettings;
  