
    import React, { useState, useEffect } from 'react';
    import AppCard from '@/components/AppCard';
    import useGooglePlayApps from '@/hooks/useGooglePlayApps';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { Loader2, LayoutGrid, List, Search, Filter, X } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';
    import usePersistentState from '@/hooks/usePersistentState';
    import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from '@/components/ui/sheet'; // Added Sheet

    const BoardPage = () => {
      const { apps: allApps, loading } = useGooglePlayApps();
      const [searchTerm, setSearchTerm] = useState('');
      const [selectedCategory, setSelectedCategory] = useState('all');
      const [viewMode, setViewMode] = usePersistentState('boardViewMode', 'grid'); // 'grid' or 'list'
      const [selectedApp, setSelectedApp] = useState(null);
      const [workingOnAppId, setWorkingOnAppId] = usePersistentState('workingOnAppId', null);
      const [isSheetOpen, setIsSheetOpen] = useState(false);


      const categories = React.useMemo(() => {
        if (!allApps) return [];
        const uniqueCategories = new Set(allApps.map(app => app.category).filter(Boolean));
        return ['all', ...Array.from(uniqueCategories)];
      }, [allApps]);

      const filteredApps = React.useMemo(() => {
        if (!allApps) return [];
        return allApps.filter(app => {
          const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                app.packageName.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory;
          return matchesSearch && matchesCategory;
        });
      }, [allApps, searchTerm, selectedCategory]);

      const handleSelectApp = (app) => {
        setSelectedApp(app);
        setIsSheetOpen(true);
      };

      const handleSetWorkingOn = (appId) => {
        setWorkingOnAppId(appId);
        // Optionally close sheet or update UI
      };
      
      const closeSheet = () => {
        setIsSheetOpen(false);
        setSelectedApp(null);
      }


      if (loading) {
        return (
          <div className="flex flex-col items-center justify-center h-full min-h-screen bg-background p-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="ml-4 text-lg text-muted-foreground mt-4">Loading Applications...</p>
          </div>
        );
      }

      return (
        <div className="container mx-auto py-8 px-4 md:px-6">
          <header className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-destructive">
                  Application Portfolio
                </h1>
                <p className="text-muted-foreground mt-1 text-sm md:text-base">
                  Overview of your Google Play applications.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('grid')} title="Grid View">
                  <LayoutGrid className="h-5 w-5" />
                </Button>
                <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('list')} title="List View">
                  <List className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search apps..."
                  className="pl-10 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-muted-foreground hidden sm:block" />
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </header>

          {filteredApps.length === 0 && !loading && (
            <div className="text-center py-12">
              <img  alt="No applications found illustration" class="mx-auto h-40 w-40 text-muted-foreground opacity-50" src="https://images.unsplash.com/photo-1696744404432-d829841194f4" />
              <h3 className="mt-4 text-xl font-semibold">No Applications Found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
            </div>
          )}

          <AnimatePresence>
            <motion.div
              key={viewMode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6'
                  : 'space-y-4'
              }
            >
              {filteredApps.map(app => (
                <motion.div
                  key={app.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className={viewMode === 'list' ? 'w-full' : ''}
                >
                  <AppCard
                    app={app}
                    onSelect={() => handleSelectApp(app)}
                    isSelected={selectedApp?.id === app.id}
                    isWorkingOn={workingOnAppId === app.id}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetContent className="w-full sm:max-w-lg p-0 overflow-y-auto">
              {selectedApp && (
                <>
                  <SheetHeader className="p-6 border-b sticky top-0 bg-background z-10">
                    <div className="flex justify-between items-center">
                      <SheetTitle className="text-2xl font-semibold">{selectedApp.name}</SheetTitle>
                      <SheetClose asChild>
                        <Button variant="ghost" size="icon" onClick={closeSheet}>
                          <X className="h-5 w-5" />
                        </Button>
                      </SheetClose>
                    </div>
                    <SheetDescription>{selectedApp.packageName}</SheetDescription>
                  </SheetHeader>
                  <div className="p-6 space-y-4">
                    <img  src={selectedApp.iconUrl} alt={selectedApp.name} class="w-24 h-24 rounded-lg mx-auto mb-4 border shadow-md" src="https://images.unsplash.com/photo-1588237977332-6d680670f1db" />
                    <p className="text-sm text-muted-foreground">{selectedApp.description}</p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm border-t pt-4">
                        <p><strong>Status:</strong></p> <p><span className={`px-2 py-0.5 rounded-full text-xs ${selectedApp.releaseStatus?.toLowerCase().includes('published') ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{selectedApp.releaseStatus}</span></p>
                        <p><strong>Category:</strong></p> <p>{selectedApp.category}</p>
                        <p><strong>Rating:</strong></p> <p>{selectedApp.rating || 'N/A'}</p>
                        <p><strong>Version:</strong></p> <p>{selectedApp.currentVersion}</p>
                        <p><strong>Installs:</strong></p> <p>{selectedApp.installs}</p>
                        <p><strong>Last Updated:</strong></p> <p>{selectedApp.lastUpdated}</p>
                    </div>
                    {selectedApp.lastTestUrl && (
                        <a href={selectedApp.lastTestUrl} target="_blank" rel="noopener noreferrer" className="mt-6 block">
                            <Button className="w-full bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 text-white">View Test Details</Button>
                        </a>
                    )}
                    <Button 
                        variant={workingOnAppId === selectedApp.id ? "secondary" : "default"}
                        className="w-full mt-3"
                        onClick={() => handleSetWorkingOn(selectedApp.id)}
                    >
                        {workingOnAppId === selectedApp.id ? "Stop Working On This" : "Work On This App"}
                    </Button>
                  </div>
                </>
              )}
            </SheetContent>
          </Sheet>
        </div>
      );
    };

    export default BoardPage;
  