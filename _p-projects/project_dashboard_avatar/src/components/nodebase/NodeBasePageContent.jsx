
    import React, { useState, useEffect, Suspense, useMemo } from 'react';
    import useProjects from '@/hooks/useProjects';
    import { cn } from '@/lib/utils';
    import { Loader2, Menu } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import NodeBaseLayout from '@/components/nodebase/NodeBaseLayout';

    const NodeBasePageContent = () => {
      const [projectFilter, setProjectFilter] = useState('all');
      const { projects, loading: projectsLoading, error: projectsError } = useProjects();
      const [isNodeBasePanelsOpen, setIsNodeBasePanelsOpen] = useState(window.innerWidth > 1024);

      const toggleNodeBasePanels = () => {
        setIsNodeBasePanelsOpen(prev => !prev);
      };

      useEffect(() => {
        const handleResize = () => {
          if (window.innerWidth <= 768) {
            setIsNodeBasePanelsOpen(false);
          } else if (window.innerWidth <= 1024) {
            setIsNodeBasePanelsOpen(false); 
          } else {
            setIsNodeBasePanelsOpen(true);
          }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
      }, []);

      const memoizedProjects = useMemo(() => projects, [projects]);

      if (projectsLoading) {
        return (
          <div className="flex items-center justify-center h-full w-full bg-background dark:bg-slate-900">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <p className="ml-4 text-lg text-muted-foreground">Loading Projects...</p>
          </div>
        );
      }

      if (projectsError) {
        return (
          <div className="flex flex-col items-center justify-center h-full w-full bg-background dark:bg-slate-900 text-destructive">
            <Loader2 className="h-16 w-16 animate-spin " />
            <p className="ml-4 text-lg">Error loading projects: {projectsError.message}</p>
            <p className="text-sm text-muted-foreground">Please try refreshing the page.</p>
          </div>
        );
      }

      return (
        <div className={cn(
            "flex flex-col h-full max-h-screen overflow-hidden",
            "md:h-[calc(100vh-var(--header-height,64px))]" 
        )}>
            <div className="p-2 border-b bg-background/80 backdrop-blur-sm md:hidden">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">NodeBase Controls</span>
                    <Button variant="ghost" size="icon" onClick={toggleNodeBasePanels}>
                        <Menu className="h-5 w-5" />
                    </Button>
                </div>
                 <select
                    value={projectFilter}
                    onChange={(e) => setProjectFilter(e.target.value)}
                    className="mt-2 block w-full p-2 border rounded-md text-sm bg-input text-foreground"
                >
                    <option value="all">All Projects</option>
                    {memoizedProjects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
            </div>

             <div className="flex-grow overflow-hidden bg-muted/10 dark:bg-slate-950">
                <Suspense fallback={
                    <div className="flex items-center justify-center h-full w-full bg-background dark:bg-slate-900">
                        <Loader2 className="h-16 w-16 animate-spin text-primary" />
                        <p className="ml-4 text-lg text-muted-foreground">Loading NodeBase Canvas...</p>
                    </div>
                }>
                    <NodeBaseLayout 
                        projectFilter={projectFilter} 
                        isNodeBasePanelsOpen={isNodeBasePanelsOpen} 
                        toggleNodeBasePanels={toggleNodeBasePanels}
                        projects={memoizedProjects}
                    />
                </Suspense>
             </div>
        </div>
      );
    };

    export default NodeBasePageContent;
  