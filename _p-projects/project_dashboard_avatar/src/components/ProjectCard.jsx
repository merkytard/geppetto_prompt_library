
    import React from 'react';
    import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
    import { Button } from "@/components/ui/button";
    import { Edit, Trash2, Share2, Bookmark, Star } from 'lucide-react';
    import { getIconComponent } from '@/data/icons';
    import { motion } from 'framer-motion';
    import { cn } from '@/lib/utils';

    const ProjectCard = ({ project, onEdit, onDelete, isBookmarked, onToggleBookmark }) => {
      const IconComponent = getIconComponent(project.icon);

      const handleViewInNodeBase = (e) => {
        e.stopPropagation(); // Prevent card click through
        alert(`Navigate to NodeBase for project ${project.id} (WIP)`);
      };

      const handleEdit = (e) => {
          e.stopPropagation();
          onEdit(project);
      }

      const handleDelete = (e) => {
          e.stopPropagation();
          onDelete(project.id);
      }

      const handleBookmarkToggle = (e) => {
          e.stopPropagation();
          onToggleBookmark(project.id);
      }

      return (
        <motion.div
          layout
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="h-full cursor-pointer"
          onClick={() => console.log("Navigate to project details view for", project.id)} // Placeholder navigation
        >
          <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between mb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                      <IconComponent className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="line-clamp-1 break-all">{project.name}</span>
                  </CardTitle>
                  {/* Bookmark Button */}
                  <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0" onClick={handleBookmarkToggle} title={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}>
                     <Star className={cn("h-4 w-4", isBookmarked ? "fill-yellow-400 text-yellow-500" : "text-muted-foreground")} />
                  </Button>
              </div>
              <CardDescription className="text-xs line-clamp-3 min-h-[3em]">{project.description || "No description provided."}</CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto pt-3 flex justify-between items-center">
               {/* View in NodeBase Button */}
               <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleViewInNodeBase} title="View in NodeBase">
                  <Share2 className="h-4 w-4 text-muted-foreground hover:text-primary" />
               </Button>
               {/* Action Buttons */}
               <div className="flex justify-end gap-1.5">
                 <Button variant="outline" size="sm" className="h-7 px-2 py-1 text-xs" onClick={handleEdit}>
                   <Edit className="h-3 w-3 mr-1" /> Edit
                 </Button>
                 <Button variant="outline" size="sm" className="h-7 px-2 py-1 text-xs text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleDelete}>
                   <Trash2 className="h-3 w-3 mr-1" /> Delete
                 </Button>
               </div>
            </CardFooter>
          </Card>
        </motion.div>
      );
    };

    export default ProjectCard;
  