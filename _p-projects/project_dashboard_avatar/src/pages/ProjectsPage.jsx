
    import React, { useState, useEffect, useMemo } from 'react';
    import useProjects from '@/hooks/useProjects';
    import ProjectSidebarList from '@/components/ProjectSidebarList';
    import ProjectDetailView from '@/components/ProjectDetailView';
    import ProjectDialog from '@/components/ProjectDialog';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import { Plus, Search, Bookmark, LayoutGrid, List, PieChart, BarChart2 } from 'lucide-react'; // Added chart icons
    import ProjectCard from '@/components/ProjectCard';
    import { AnimatePresence, motion } from 'framer-motion';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'; // Added Card components

    // Placeholder for Yearly Overview Component
    const ProjectYearlyOverview = ({ projects }) => {
        // Mock data generation for charts
        const yearlyData = useMemo(() => {
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            return months.map((month, index) => ({
                name: month,
                projects: Math.floor(Math.random() * 5) + 1, // Mock number of active projects
                tasksCompleted: Math.floor(Math.random() * 50) + 10, // Mock tasks completed
            }));
        }, []);

        const projectDistribution = useMemo(() => {
            // Simple mock distribution
            const types = ['Web App', 'Mobile App', 'API', 'Research', 'Marketing'];
            return types.map(type => ({
                name: type,
                value: Math.floor(Math.random() * projects.length / 3) + 1
            }));
        }, [projects]);


        return (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Yearly Project Overview</CardTitle>
                        <CardDescription>Summary of project activity throughout the year.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Placeholder Pie Chart */}
                        <div className="border rounded-lg p-4 flex flex-col items-center justify-center min-h-[250px] bg-muted/30">
                            <PieChart className="h-16 w-16 text-primary/50 mb-4" />
                            <h4 className="font-semibold mb-2">Project Type Distribution (Mock)</h4>
                            <div className="text-xs text-muted-foreground space-y-1 text-center">
                                {projectDistribution.map(item => (
                                    <p key={item.name}>{item.name}: {item.value}</p>
                                ))}
                            </div>
                        </div>
                        {/* Placeholder Bar Chart */}
                        <div className="border rounded-lg p-4 flex flex-col items-center justify-center min-h-[250px] bg-muted/30">
                            <BarChart2 className="h-16 w-16 text-primary/50 mb-4" />
                             <h4 className="font-semibold mb-2">Monthly Task Completion (Mock)</h4>
                             <div className="text-xs text-muted-foreground space-y-1 text-center">
                                 {yearlyData.slice(0, 6).map(item => ( // Show first 6 months for brevity
                                     <p key={item.name}>{item.name}: {item.tasksCompleted} tasks</p>
                                 ))}
                                 <p>...</p>
                             </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        );
    };


    const ProjectsPage = () => {
      const { projects, addProject, updateProject, deleteProject, bookmarkedProjectIds, toggleBookmark } = useProjects();
      const [selectedProject, setSelectedProject] = useState(null);
      const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
      const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
      const [projectToEdit, setProjectToEdit] = useState(null);
      const [searchTerm, setSearchTerm] = useState('');
      const [filter, setFilter] = useState('all'); // 'all', 'bookmarked'
      const [viewMode, setViewMode] = useState('list'); // 'list', 'grid', 'overview'
      const [mainView, setMainView] = useState('detail'); // 'detail', 'yearly' - for list view's right panel

      // Filter projects based on search and filter criteria
      const filteredProjects = useMemo(() => {
        return projects
          .filter(project => {
            const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesFilter = filter === 'all' || (filter === 'bookmarked' && bookmarkedProjectIds.includes(project.id));
            return matchesSearch && matchesFilter;
          })
          .sort((a, b) => {
            const aIsBookmarked = bookmarkedProjectIds.includes(a.id);
            const bIsBookmarked = bookmarkedProjectIds.includes(b.id);
            if (aIsBookmarked !== bIsBookmarked) {
              return aIsBookmarked ? -1 : 1;
            }
            return a.name.localeCompare(b.name);
          });
      }, [projects, searchTerm, filter, bookmarkedProjectIds]);

      // Select first project logic or update selected if it's filtered out
      useEffect(() => {
          if (viewMode === 'list') {
              if (selectedProject && !filteredProjects.find(p => p.id === selectedProject.id)) {
                  setSelectedProject(filteredProjects.length > 0 ? filteredProjects[0] : null);
              } else if (!selectedProject && filteredProjects.length > 0) {
                  setSelectedProject(filteredProjects[0]);
              } else if (filteredProjects.length === 0) {
                   setSelectedProject(null);
              }
          }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [filteredProjects, selectedProject?.id, viewMode]);


      const handleSelectProject = (project) => {
        setSelectedProject(project);
        setMainView('detail'); // Switch back to detail view when a project is selected
      };

      const handleAddClick = () => {
        setProjectToEdit(null);
        setIsAddDialogOpen(true);
      };

      const handleEditClick = (project) => {
        setProjectToEdit(project);
        setIsEditDialogOpen(true);
      };

      const handleDeleteClick = (projectId) => {
        const projectToDelete = projects.find(p => p.id === projectId);
        if (window.confirm(`Are you sure you want to delete project "${projectToDelete?.name || 'this project'}"?`)) {
          deleteProject(projectId);
          if (selectedProject?.id === projectId) {
               setSelectedProject(filteredProjects.length > 1 ? filteredProjects[0] : null);
          }
        }
      };

      const handleSaveProject = (projectData) => {
        if (projectToEdit) {
          updateProject({ ...projectToEdit, ...projectData });
          if (selectedProject && selectedProject.id === projectToEdit.id) {
            setSelectedProject({ ...projectToEdit, ...projectData });
          }
          setProjectToEdit(null);
          setIsEditDialogOpen(false);
        } else {
          const newProject = addProject(projectData);
          if (newProject && viewMode === 'list') {
             setSelectedProject(newProject);
             setMainView('detail'); // Ensure detail view is shown for new project
          }
          setIsAddDialogOpen(false);
        }
      };

      return (
        <div className="flex flex-col h-full">
          {/* Header & Controls */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 mb-3 md:mb-4">
             <h1 className="text-2xl md:text-3xl font-bold text-primary whitespace-nowrap">Projects</h1>
             <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                 <div className="relative flex-grow md:flex-grow-0">
                     <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                     <Input
                        type="search"
                        placeholder="Search projects..."
                        className="pl-8 w-full md:w-[200px] lg:w-[250px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                     />
                 </div>
                 <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-full md:w-auto min-w-[120px] text-xs md:text-sm">
                        <div className="flex items-center gap-1">
                            {filter === 'bookmarked' ? <Bookmark className="h-3.5 w-3.5" /> : null}
                            <SelectValue placeholder="Filter" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Projects</SelectItem>
                        <SelectItem value="bookmarked">
                            <span className="flex items-center gap-1"> <Bookmark className="h-3.5 w-3.5"/> Bookmarked</span>
                        </SelectItem>
                    </SelectContent>
                 </Select>
                  <div className="flex items-center border rounded-md p-0.5 bg-muted">
                      <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="sm" className="h-8 px-2" onClick={() => setViewMode('list')} title="List View"> <List className="h-4 w-4"/> </Button>
                      <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="sm" className="h-8 px-2" onClick={() => setViewMode('grid')} title="Grid View"> <LayoutGrid className="h-4 w-4"/> </Button>
                      <Button variant={viewMode === 'overview' ? 'secondary' : 'ghost'} size="sm" className="h-8 px-2" onClick={() => setViewMode('overview')} title="Yearly Overview"> <PieChart className="h-4 w-4"/> </Button>
                  </div>
                 <Button onClick={handleAddClick} className="gold-button">
                   <Plus className="h-4 w-4 mr-2" /> New Project
                 </Button>
             </div>
          </div>

          {/* Main Content Area */}
          <div className={`flex-grow ${viewMode === 'list' ? 'grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6' : ''} h-[calc(100%-100px)] md:h-[calc(100%-120px)] mt-4`}>

            {/* List View Layout */}
            {viewMode === 'list' && (
                <>
                    {/* Sidebar Project List */}
                    <div className="md:col-span-3 lg:col-span-3 border rounded-lg overflow-hidden bg-card">
                      <ProjectSidebarList
                        projects={filteredProjects}
                        selectedProject={selectedProject}
                        onSelectProject={handleSelectProject}
                        onEditProject={handleEditClick}
                        onDeleteProject={handleDeleteClick}
                        bookmarkedIds={bookmarkedProjectIds}
                        onToggleBookmark={toggleBookmark}
                      />
                    </div>

                    {/* Main Content Area (Project Details or Yearly Overview) */}
                    <div className="md:col-span-9 lg:col-span-9 border rounded-lg overflow-auto bg-card p-4 md:p-6">
                       {/* Add toggle for detail vs yearly view */}
                       <div className="flex justify-end mb-4">
                           <Button variant={mainView === 'detail' ? 'secondary' : 'ghost'} size="sm" onClick={() => setMainView('detail')} disabled={!selectedProject}>Project Detail</Button>
                           <Button variant={mainView === 'yearly' ? 'secondary' : 'ghost'} size="sm" onClick={() => setMainView('yearly')}>Yearly Overview</Button>
                       </div>

                       {mainView === 'detail' && selectedProject && (
                           <ProjectDetailView project={selectedProject} />
                       )}
                       {mainView === 'yearly' && (
                           <ProjectYearlyOverview projects={projects} />
                       )}
                       {mainView === 'detail' && !selectedProject && (
                           <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                             <p className="text-lg mb-2">No Project Selected or Found</p>
                             <p className="text-sm mb-4">Select a project from the list, adjust filters, or create a new one.</p>
                              <Button variant="outline" size="sm" onClick={handleAddClick}> <Plus className="h-4 w-4 mr-2" /> Create Project </Button>
                           </div>
                       )}
                    </div>
                </>
            )}

             {/* Grid View Layout */}
              {viewMode === 'grid' && (
                  <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 overflow-y-auto pr-2 pb-4">
                      <AnimatePresence>
                          {filteredProjects.length > 0 ? (
                              filteredProjects.map(project => (
                                  <ProjectCard
                                      key={project.id}
                                      project={project}
                                      onEdit={handleEditClick}
                                      onDelete={handleDeleteClick}
                                      isBookmarked={bookmarkedProjectIds.includes(project.id)}
                                      onToggleBookmark={toggleBookmark}
                                  />
                              ))
                          ) : (
                              <div className="col-span-full text-center text-muted-foreground py-10">
                                  No projects match your search or filter criteria.
                              </div>
                          )}
                      </AnimatePresence>
                  </motion.div>
              )}

              {/* Overview View Layout */}
              {viewMode === 'overview' && (
                  <div className="overflow-y-auto pr-2 pb-4 p-4 md:p-6 border rounded-lg bg-card">
                      <ProjectYearlyOverview projects={projects} />
                  </div>
              )}
          </div>

          {/* Add Dialog */}
          <ProjectDialog
             isOpen={isAddDialogOpen}
             onOpenChange={setIsAddDialogOpen}
             onSave={handleSaveProject}
             project={null}
             dialogTitle="Create New Project"
             dialogDescription="Enter the details for your new project."
          />

          {/* Edit Dialog */}
          {projectToEdit && (
             <ProjectDialog
               isOpen={isEditDialogOpen}
               onOpenChange={setIsEditDialogOpen}
               onSave={handleSaveProject}
               project={projectToEdit}
               dialogTitle="Edit Project"
               dialogDescription="Update the details for this project."
             />
          )}
        </div>
      );
    };

    export default ProjectsPage;
  