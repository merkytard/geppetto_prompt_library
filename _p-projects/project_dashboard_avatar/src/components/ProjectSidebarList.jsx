
    import React from 'react';
    import { ScrollArea } from "@/components/ui/scroll-area";
    import { Button } from "@/components/ui/button";
    import { Edit, Trash2, Star, HelpCircle } from 'lucide-react'; // Added HelpCircle for edit trigger
    import { cn } from '@/lib/utils';
    import { getIconComponent } from '@/data/icons';
    import { motion, AnimatePresence } from 'framer-motion';

    const ProjectSidebarList = ({
      projects,
      selectedProject,
      onSelectProject,
      onEditProject,
      onDeleteProject,
      bookmarkedIds,
      onToggleBookmark
    }) => {

      const handleEditClick = (e, project) => {
        e.stopPropagation();
        onEditProject(project);
      };

      const handleDeleteClick = (e, projectId) => {
        e.stopPropagation();
        onDeleteProject(projectId);
      };

       const handleBookmarkToggle = (e, projectId) => {
          e.stopPropagation();
          onToggleBookmark(projectId);
       }

      return (
        <ScrollArea className="h-full">
          <AnimatePresence>
            {projects.length > 0 ? (
              projects.map((project) => {
                const IconComponent = getIconComponent(project.icon);
                const isSelected = selectedProject?.id === project.id;
                const isBookmarked = bookmarkedIds.includes(project.id);

                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "flex items-center justify-between p-3 cursor-pointer border-b last:border-b-0",
                      isSelected ? "bg-primary/10 dark:bg-primary/20" : "hover:bg-accent/50 dark:hover:bg-accent/70"
                    )}
                    onClick={() => onSelectProject(project)}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <IconComponent className={cn("h-4 w-4 flex-shrink-0", isSelected ? "text-primary" : "text-muted-foreground")} />
                      <span className="text-sm font-medium truncate flex-grow">{project.name}</span>
                    </div>
                    <div className="flex items-center gap-0.5 flex-shrink-0 ml-2">
                       <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => handleBookmarkToggle(e, project.id)} title={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}>
                          <Star className={cn("h-3.5 w-3.5", isBookmarked ? "fill-yellow-400 text-yellow-500" : "text-muted-foreground")} />
                       </Button>
                       {/* Edit Button */}
                       <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => handleEditClick(e, project)} title="Edit Project">
                         <Edit className="h-3.5 w-3.5 text-muted-foreground hover:text-primary" />
                       </Button>
                       <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => handleDeleteClick(e, project.id)} title="Delete Project">
                         <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                       </Button>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No projects found. Create one to get started!
              </div>
            )}
          </AnimatePresence>
        </ScrollArea>
      );
    };

    export default ProjectSidebarList;
  