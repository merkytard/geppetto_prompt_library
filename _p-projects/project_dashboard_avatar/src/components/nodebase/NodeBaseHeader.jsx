
    import React from 'react';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import { Button } from '@/components/ui/button';
    import { Folder, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

    const NodeBaseHeader = ({
        projectFilter,
        onProjectFilterChange,
        projects,
        isSidebarOpen,
        onToggleSidebar,
    }) => {
        return (
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 mb-3 md:mb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-primary whitespace-nowrap">Node Base</h1>
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    {/* Project Filter */}
                    <Select value={projectFilter} onValueChange={onProjectFilterChange}>
                        <SelectTrigger className="w-full md:w-auto min-w-[180px] text-xs md:text-sm h-9">
                            <div className="flex items-center gap-1"> <Folder className="h-3.5 w-3.5" /> <SelectValue placeholder="Filter by Project" /> </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Projects / Global</SelectItem>
                            {projects.map(project => (
                               <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {/* Sidebar Toggle Button */}
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={onToggleSidebar}
                        title={isSidebarOpen ? "Hide Sidebars" : "Show Sidebars"}
                        className="h-9 w-9"
                    >
                        {isSidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
                    </Button>
                </div>
            </div>
        );
    };

    export default NodeBaseHeader;
  