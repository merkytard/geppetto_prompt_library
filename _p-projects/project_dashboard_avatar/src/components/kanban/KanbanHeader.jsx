
    import React from 'react';
    import { Button } from '@/components/ui/button';
    import { PlusCircle, Archive, Filter } from 'lucide-react';
    import {
      DropdownMenu,
      DropdownMenuContent,
      DropdownMenuRadioGroup,
      DropdownMenuRadioItem,
      DropdownMenuLabel,
      DropdownMenuSeparator,
      DropdownMenuTrigger,
    } from "@/components/ui/dropdown-menu";

    const KanbanHeader = ({
      onAddColumn,
      projects,
      selectedProjectId,
      onSelectProject,
      onToggleArchivedSidebar,
      archivedCount
    }) => {
      const selectedProjectName = projects.find(p => p.id === selectedProjectId)?.name || "Select Project";

      return (
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-2 mb-2 sm:mb-0">
            <h1 className="text-xl font-semibold text-foreground">Kanban Board</h1>
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
                <DropdownMenuRadioGroup value={selectedProjectId} onValueChange={onSelectProject}>
                  {projects.map((project) => (
                    <DropdownMenuRadioItem key={project.id} value={project.id}>
                      {project.name}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onToggleArchivedSidebar} className="text-xs sm:text-sm">
              <Archive className="h-4 w-4 mr-1.5" />
              Archived ({archivedCount})
            </Button>
            <Button size="sm" onClick={onAddColumn} className="gold-button text-xs sm:text-sm">
              <PlusCircle className="h-4 w-4 mr-1.5" />
              Add Column
            </Button>
          </div>
        </div>
      );
    };

    export default KanbanHeader;
  