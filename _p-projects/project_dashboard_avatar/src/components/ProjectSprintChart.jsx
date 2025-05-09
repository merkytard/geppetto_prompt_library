
    import React, { useState } from 'react';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
    import { Button } from "@/components/ui/button";
    import { BarChartHorizontal, LineChart, TrendingUp } from 'lucide-react'; // Icons for switching views

    // Mock data structure for sprints
    const mockSprints = [
      { id: 's1', name: 'Sprint 1 (Apr)', completed: 15, total: 20, velocity: 15 },
      { id: 's2', name: 'Sprint 2 (May)', completed: 18, total: 25, velocity: 18 },
      { id: 's3', name: 'Sprint 3 (Jun)', completed: 5, total: 15, velocity: 5 }, // Current/Upcoming
      { id: 's4', name: 'Sprint 4 (Jul)', completed: 0, total: 10, velocity: 0 }, // Upcoming
    ];

    const ProjectSprintChart = ({ projectId }) => {
      const [viewType, setViewType] = useState('bar'); // 'bar' or 'combo'
      // In a real app, fetch or filter sprints based on projectId
      const projectSprints = mockSprints;

      const renderBarChart = () => (
        <div className="space-y-4">
          {projectSprints.map(sprint => {
            const progress = sprint.total > 0 ? (sprint.completed / sprint.total) * 100 : 0;
            return (
              <div key={sprint.id}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">{sprint.name}</span>
                  <span className="text-xs text-muted-foreground">{sprint.completed}/{sprint.total} tasks</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5 dark:bg-gray-700">
                  <div
                    className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      );

      // Enhanced Placeholder for Combo Chart
      const renderComboChartPlaceholder = () => (
        <div className="relative h-[200px] w-full overflow-hidden rounded-md border bg-muted/30 p-4 flex items-end gap-2">
          {/* Mock Bars */}
          {projectSprints.map((sprint, index) => {
            const progress = sprint.total > 0 ? (sprint.completed / sprint.total) * 100 : 0;
            return (
              <div key={sprint.id} className="flex-1 h-full flex flex-col justify-end items-center group">
                 <div
                    className="w-3/4 bg-primary/70 rounded-t-sm transition-all duration-300 ease-out group-hover:bg-primary"
                    style={{ height: `${progress * 0.8}%` }} // Scale height for visual
                 ></div>
                 <span className="text-[10px] text-muted-foreground mt-1 truncate">{sprint.name.split(' ')[1]}</span>
              </div>
            );
          })}
          {/* Mock Line (SVG or simple divs) */}
          <div className="absolute inset-0 flex items-center justify-center text-primary/50 opacity-70">
             <TrendingUp className="h-16 w-16" strokeWidth={1}/>
          </div>
           <p className="absolute top-2 left-2 text-xs text-muted-foreground bg-background/80 px-2 py-0.5 rounded">Velocity/Burndown (Placeholder)</p>
        </div>
      );

      return (
        <Card>
          <CardHeader>
             <div className="flex justify-between items-center">
                <div>
                    <CardTitle>Sprint Progress</CardTitle>
                    <CardDescription>Task completion across recent sprints.</CardDescription>
                </div>
                <div className="flex items-center border rounded-md p-0.5 bg-muted">
                   <Button variant={viewType === 'bar' ? 'secondary' : 'ghost'} size="sm" className="h-7 px-1.5" onClick={() => setViewType('bar')} title="Bar Chart View"> <BarChartHorizontal className="h-4 w-4"/> </Button>
                   <Button variant={viewType === 'combo' ? 'secondary' : 'ghost'} size="sm" className="h-7 px-1.5" onClick={() => setViewType('combo')} title="Combo Chart View"> <LineChart className="h-4 w-4"/> </Button>
                </div>
             </div>
          </CardHeader>
          <CardContent>
            {projectSprints.length > 0 ? (
              viewType === 'bar' ? renderBarChart() : renderComboChartPlaceholder()
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No sprint data available for this project.</p>
            )}
          </CardContent>
        </Card>
      );
    };

    export default ProjectSprintChart;
  