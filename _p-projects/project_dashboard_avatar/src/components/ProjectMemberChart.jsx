
    import React from 'react';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
    import { PieChart } from 'lucide-react'; // Use icon as placeholder
    import { initialUsers, initialKanbanData } from '@/data/initialKanbanData'; // Correctly import initialUsers

    // Function to get assigned members for a project (mock - assuming all tasks belong to the selected project)
    const getProjectMembersData = (projectId) => {
       if (!projectId) return {}; // Return empty if no project selected

       const memberCounts = {};
       // In a real app, filter tasks by projectId first
       const projectTasks = initialKanbanData.flatMap(col => col.cards);

       projectTasks.forEach(task => {
          // Ensure assignedUserIds exists before iterating
          (task.assignedUserIds || []).forEach(userId => {
             memberCounts[userId] = (memberCounts[userId] || 0) + 1;
          });
       });

       return memberCounts;
    }

    const ProjectMemberChart = ({ projectId }) => {
       const memberData = getProjectMembersData(projectId);
       const totalAssignments = Object.values(memberData).reduce((sum, count) => sum + count, 0);

       // Generate colors dynamically (simple hash function for mock)
       const stringToColor = (str) => {
           let hash = 0;
           for (let i = 0; i < str.length; i++) {
               hash = str.charCodeAt(i) + ((hash << 5) - hash);
           }
           const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
           return "#" + "00000".substring(0, 6 - c.length) + c;
       };


      return (
        <Card>
          <CardHeader>
            <CardTitle>Member Task Distribution</CardTitle>
            <CardDescription>Assignments per member on this project.</CardDescription>
          </CardHeader>
          <CardContent>
             {totalAssignments > 0 ? (
                <div className="flex flex-col items-center">
                   {/* Placeholder Chart Area */}
                   <div className="relative w-48 h-48 mb-4 flex items-center justify-center bg-muted rounded-full">
                      <PieChart className="w-24 h-24 text-primary/50" />
                       {/* Mock segments (would be dynamically generated in a real chart) */}
                       <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-muted-foreground/50">Chart Placeholder</div>
                   </div>
                   {/* Legend */}
                   <div className="w-full space-y-1">
                      {Object.entries(memberData).map(([userId, count]) => {
                          const user = initialUsers.find(u => u.id === userId); // Use initialUsers here
                          const percentage = ((count / totalAssignments) * 100).toFixed(1);
                          return (
                              <div key={userId} className="flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-2">
                                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: user ? (user.color || stringToColor(user.id)) : stringToColor(userId) }}></span>
                                      <span className="text-muted-foreground">{user?.name || `User ${userId.substring(0,4)}`}</span>
                                  </div>
                                  <span className="font-medium">{count} ({percentage}%)</span>
                              </div>
                          );
                      })}
                   </div>
                </div>
             ) : (
                 <p className="text-sm text-muted-foreground text-center py-8">No task assignments found for this project.</p>
             )}
             <p className="text-xs text-muted-foreground mt-4 text-center">Note: Pie chart is a placeholder.</p>
          </CardContent>
        </Card>
      );
    };

    export default ProjectMemberChart;
  