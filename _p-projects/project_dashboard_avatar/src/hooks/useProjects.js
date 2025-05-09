
    import { useState, useCallback, useEffect } from 'react';
    import usePersistentState from '@/hooks/usePersistentState';
    import { useToast } from "@/components/ui/use-toast";

    export const initialProjects = [
      { id: 'proj-1', name: 'Project Phoenix', description: 'Revamp the core platform infrastructure.', icon: 'Flame' },
      { id: 'proj-2', name: 'Marketing Campaign Q3', description: 'Launch new ad campaigns and track performance.', icon: 'Megaphone' },
      { id: 'proj-3', name: 'UI/UX Redesign', description: 'Improve user experience across all apps.', icon: 'Palette' },
    ];

    let idCounter = initialProjects.length + 1;

    const useProjects = () => {
      const [projects, setProjects] = usePersistentState('projects_v3', initialProjects);
      const [bookmarkedProjectIds, setBookmarkedProjectIds] = usePersistentState('projectBookmarks_v1', []);
      const { toast } = useToast();

      const addProject = useCallback((projectData) => {
        if (!projectData.name || !projectData.name.trim()) {
          toast({ title: "Creation Failed", description: "Project name cannot be empty.", variant: "destructive" });
          return null; 
        }
        const newProject = {
          id: `proj-${Date.now()}-${idCounter++}`,
          name: projectData.name.trim(),
          description: projectData.description || '',
          icon: projectData.icon || 'Package',
        };
        setProjects((prevProjects) => [...prevProjects, newProject]);
        toast({ title: "Project Created", description: `"${newProject.name}" has been added.` });
        return newProject; 
      }, [setProjects, toast]);

      const updateProject = useCallback((updatedProject) => {
        if (!updatedProject || !updatedProject.id || !updatedProject.name || !updatedProject.name.trim()) {
          toast({ title: "Update Failed", description: "Invalid project data or name.", variant: "destructive" });
          return;
        }
        setProjects((prevProjects) =>
          prevProjects.map((project) =>
            project.id === updatedProject.id ? { ...project, ...updatedProject } : project
          )
        );
        toast({ title: "Project Updated", description: `"${updatedProject.name}" details saved.` });
      }, [setProjects, toast]);

      const deleteProject = useCallback((projectId) => {
        let deletedProjectName = '';
        setProjects((prevProjects) => {
          const projectToDelete = prevProjects.find(p => p.id === projectId);
          deletedProjectName = projectToDelete?.name || '';
          return prevProjects.filter((project) => project.id !== projectId);
        });
        setBookmarkedProjectIds(prev => prev.filter(id => id !== projectId)); 
        if (deletedProjectName) {
          toast({ title: "Project Deleted", description: `"${deletedProjectName}" removed.`, variant: "destructive" });
        }
      }, [setProjects, setBookmarkedProjectIds, toast]);

      const toggleBookmark = useCallback((projectId) => {
        let isBookmarked = false;
        setBookmarkedProjectIds(prev => {
            const exists = prev.includes(projectId);
            isBookmarked = !exists;
            return exists ? prev.filter(id => id !== projectId) : [...prev, projectId];
        });
        const project = projects.find(p => p.id === projectId);
        if (project) {
            toast({ title: "Bookmark Updated", description: `"${project.name}" ${isBookmarked ? 'added to' : 'removed from'} bookmarks.` });
        }
      }, [projects, setBookmarkedProjectIds, toast]);

      useEffect(() => {
        idCounter = projects.length > 0 ? 
            Math.max(...projects.map(p => {
                const parts = p.id.split('-');
                const num = parseInt(parts[parts.length -1], 10);
                return isNaN(num) ? 0 : num;
            }), 0) + 1 
            : 1;
      }, [projects]);
      

      return {
        projects,
        bookmarkedProjectIds,
        addProject,
        updateProject,
        deleteProject,
        toggleBookmark,
      };
    };

    export default useProjects;
  