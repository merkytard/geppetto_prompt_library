
    import React from 'react';
    import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
    import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
    import { Button } from '@/components/ui/button';
    import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Import Avatar components
    import { Package, LayoutDashboard, Plus, Users } from 'lucide-react'; // Added Users icon
    import { cn } from '@/lib/utils';
    import { getIconComponent } from '@/data/icons';

    // Mock Data - Replace with actual state/props later
    const mockProjects = [
        { id: 'proj1', name: 'Website Redesign', icon: 'Package' },
        { id: 'proj2', name: 'Mobile App Launch', icon: 'Smartphone' },
        { id: 'proj3', name: 'Marketing Campaign Q3', icon: 'Megaphone' },
    ];

    const mockWalls = [
        { id: 'wall1', name: 'Main Brainstorm', icon: 'Brain' },
        { id: 'wall2', name: 'User Flow Ideas', icon: 'Workflow' },
        { id: 'wall3', name: 'Competitor Analysis', icon: 'ClipboardList' },
        { id: 'wall4', name: 'Moodboard', icon: 'Image' },
    ];

    // Mock People Data (assuming Notion connection brings this)
    const mockPeople = [
       { id: 'user1', name: 'Alice Johnson', avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde' },
       { id: 'user2', name: 'Bob Williams', avatarUrl: 'https://images.unsplash.com/photo-1527982988747-a5ac01c58cbe' },
       { id: 'user3', name: 'Charlie Brown', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e' },
       { id: 'user4', name: 'Diana Davis', avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956' },
       { id: 'user5', name: 'Ethan Garcia', avatarUrl: null }, // Example with fallback
    ];


    const SubNavBar = ({ currentView }) => { // currentView can be 'kanban' or 'nodebase' or 'projects'
        const [activeProjectId, setActiveProjectId] = React.useState(mockProjects[0]?.id);
        const [activeWallId, setActiveWallId] = React.useState(mockWalls[0]?.id);
        const [activeTab, setActiveTab] = React.useState('projects'); // Default tab

        const handleAddProject = () => alert('Add New Project (Not Implemented)');
        const handleAddWall = () => alert('Add New Wall (Not Implemented)');
        const handleInvitePeople = () => alert('Invite People (Not Implemented - Connect Notion in Settings)');

        const renderProjectList = (items, activeId, setActiveId, type) => (
            <ScrollArea className="w-full whitespace-nowrap rounded-md">
                 <div className="flex w-max space-x-3 p-2 items-center"> {/* Added items-center */}
                    {items.map(item => {
                        const IconComp = getIconComponent(item.icon);
                        const isActive = item.id === activeId;
                        return (
                            <Button
                                key={item.id}
                                variant={isActive ? "secondary" : "ghost"}
                                className={cn("h-8 px-3 text-xs", isActive ? "shadow-inner" : "")}
                                onClick={() => setActiveId(item.id)}
                            >
                                <IconComp className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" /> {/* Added flex-shrink-0 */}
                                <span className="truncate">{item.name}</span>
                            </Button>
                        );
                    })}
                     <Button variant="outline" size="sm" className="h-8 px-2 ml-2 gold-button flex-shrink-0" onClick={type === 'project' ? handleAddProject : handleAddWall}>
                         <Plus className="h-3.5 w-3.5" />
                         <span className="sr-only">Add {type === 'project' ? 'Project' : 'Wall'}</span>
                     </Button>
                </div>
                 <ScrollBar orientation="horizontal" />
            </ScrollArea>
        );

        const renderPeopleList = (items) => (
           <ScrollArea className="w-full whitespace-nowrap rounded-md">
              <div className="flex w-max space-x-3 p-2 items-center">
                 {items.map(person => (
                   <div key={person.id} className="flex flex-col items-center gap-1">
                      <Avatar className="h-7 w-7 border-2 border-transparent hover:border-primary transition-colors">
                        <AvatarImage src={person.avatarUrl || ''} alt={person.name} />
                        <AvatarFallback className="text-xs">
                            {person.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                     </Avatar>
                     <span className="text-[10px] text-muted-foreground truncate max-w-[50px]" title={person.name}>{person.name.split(' ')[0]}</span>
                   </div>
                 ))}
                 <Button variant="outline" size="sm" className="h-8 px-2 ml-2 gold-button flex-shrink-0" onClick={handleInvitePeople}>
                     <Plus className="h-3.5 w-3.5" />
                     <span className="sr-only">Invite People</span>
                 </Button>
              </div>
              <ScrollBar orientation="horizontal" />
           </ScrollArea>
        );


        return (
            <div className="mb-4 md:mb-6 border-b">
                 <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    {/* Adjust grid columns based on view */}
                    <TabsList className={cn("grid w-full h-9", currentView === 'nodebase' ? "grid-cols-3" : "grid-cols-2")}>
                        <TabsTrigger value="projects" className="text-xs px-2 py-1"> <Package className="h-3.5 w-3.5 mr-1.5"/> Projects ({mockProjects.length})</TabsTrigger>

                        {/* Specific Tabs per View */}
                        {currentView === 'nodebase' && (
                            <TabsTrigger value="walls" className="text-xs px-2 py-1"> <LayoutDashboard className="h-3.5 w-3.5 mr-1.5"/> Walls ({mockWalls.length})</TabsTrigger>
                        )}
                        {currentView !== 'nodebase' && ( // Show disabled Walls for Kanban/Projects
                           <TabsTrigger value="walls" className="text-xs px-2 py-1 disabled cursor-not-allowed opacity-50"> <LayoutDashboard className="h-3.5 w-3.5 mr-1.5"/> Walls (N/A)</TabsTrigger>
                        )}

                        <TabsTrigger value="people" className="text-xs px-2 py-1"> <Users className="h-3.5 w-3.5 mr-1.5"/> People ({mockPeople.length})</TabsTrigger>

                    </TabsList>

                    {/* Tab Contents */}
                    <TabsContent value="projects" className="mt-0 border-t -mx-4 md:-mx-8 px-4 md:px-8 bg-muted/30">
                        {renderProjectList(mockProjects, activeProjectId, setActiveProjectId, 'project')}
                    </TabsContent>

                    {currentView === 'nodebase' && (
                        <TabsContent value="walls" className="mt-0 border-t -mx-4 md:-mx-8 px-4 md:px-8 bg-muted/30">
                             {renderProjectList(mockWalls, activeWallId, setActiveWallId, 'wall')}
                        </TabsContent>
                    )}

                     <TabsContent value="people" className="mt-0 border-t -mx-4 md:-mx-8 px-4 md:px-8 bg-muted/30">
                         {renderPeopleList(mockPeople)}
                     </TabsContent>

                </Tabs>
            </div>
        );
    };

    export default SubNavBar;
  