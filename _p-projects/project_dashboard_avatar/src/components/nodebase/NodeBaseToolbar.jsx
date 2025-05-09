
    import React, { useState, useMemo } from 'react';
    import { Button } from '@/components/ui/button';
    import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import { Label } from "@/components/ui/label";
    import { Plus, Trash2, Paintbrush, Group, Link2, FolderPlus, FolderMinus, FolderCog, ListTree, Undo, Redo, BookmarkPlus } from 'lucide-react';
    import { nodeColors } from '@/data/icons';
    import AddWallDialog from '@/components/nodebase/dialogs/AddWallDialog';
    import ManageWallDialog from '@/components/nodebase/dialogs/ManageWallDialog';

    const NodeBaseToolbar = ({
        onAddNode,
        selectedNodesCount,
        onChangeColor,
        onGroupNodes,
        onDeleteNodes,
        onOpenLinkDialog,
        walls,
        currentWallId,
        onSelectWall,
        onAddWall,
        onDeleteWall,
        onRenameWall,
        onUpdateWallProject,
        projects,
        onUndo,
        onRedo,
        canUndo,
        canRedo,
        addSelectedNodesToBookmarks
    }) => {
        const [isAddWallDialogOpen, setIsAddWallDialogOpen] = useState(false);
        const [isManageWallDialogOpen, setIsManageWallDialogOpen] = useState(false);
        const [wallToManage, setWallToManage] = useState(null);

        const openManageWallDialog = (wallId) => {
            const wall = walls.find(w => w.id === wallId);
            if (wall) {
                setWallToManage(wall);
                setIsManageWallDialogOpen(true);
            }
        };
        
        const handleSaveManagedWall = (wallId, newName, newProjectId) => {
            if (onRenameWall) onRenameWall(wallId, newName);
            if (onUpdateWallProject) onUpdateWallProject(wallId, newProjectId);
        };

        const currentWall = useMemo(() => walls.find(w => w.id === currentWallId), [walls, currentWallId]);
        const currentProjectName = useMemo(() => {
            if (!currentWall || !projects) return 'N/A';
            if (currentWall.projectId === 'global') return 'Global';
            const project = projects.find(p => p.id === currentWall.projectId);
            return project ? project.name : 'N/A';
        }, [currentWall, projects]);

        return (
            <div className="p-3 space-y-3 h-full overflow-y-auto">
                {/* Wall Management */}
                <div className="space-y-1">
                    <Label className="text-xs font-semibold text-muted-foreground px-1">Current Wall</Label>
                    <div className="flex items-center gap-1">
                        <Select value={currentWallId} onValueChange={onSelectWall}>
                            <SelectTrigger className="h-8 text-xs flex-grow truncate">
                                <SelectValue placeholder="Select Wall" />
                            </SelectTrigger>
                            <SelectContent>
                                {walls.map(wall => {
                                    const projectName = projects.find(p => p.id === wall.projectId)?.name || (wall.projectId === 'global' ? 'Global' : '');
                                    return (
                                        <SelectItem key={wall.id} value={wall.id} className="text-xs">
                                            {wall.name} {projectName ? `(${projectName})` : ''}
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                                    <ListTree className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setIsAddWallDialogOpen(true)} className="text-xs">
                                    <FolderPlus className="h-3.5 w-3.5 mr-2" /> Add New Wall
                                </DropdownMenuItem>
                                {currentWallId && (
                                    <DropdownMenuItem onClick={() => openManageWallDialog(currentWallId)} className="text-xs">
                                        <FolderCog className="h-3.5 w-3.5 mr-2" /> Manage Current Wall
                                    </DropdownMenuItem>
                                )}
                                {currentWallId && currentWallId !== 'default' && walls.length > 1 && (
                                    <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => onDeleteWall(currentWallId)} className="text-xs text-destructive focus:text-destructive focus:bg-destructive/10">
                                            <FolderMinus className="h-3.5 w-3.5 mr-2" /> Delete Current Wall
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    {currentWall && (
                        <p className="text-[10px] text-muted-foreground px-1 truncate">
                            Project: {currentProjectName}
                        </p>
                    )}
                </div>

                {/* Node Creation */}
                <div className="space-y-1 pt-2 border-t">
                    <Label className="text-xs font-semibold text-muted-foreground px-1">Add Node</Label>
                    <div className="grid grid-cols-2 gap-1.5">
                        <Button variant="outline" size="sm" className="text-xs h-8" onClick={() => onAddNode('textNode')}>Text</Button>
                        <Button variant="outline" size="sm" className="text-xs h-8" onClick={() => onAddNode('imageNode')}>Image</Button>
                        <Button variant="outline" size="sm" className="text-xs h-8" onClick={() => onAddNode('detailedNode')}>Detailed</Button>
                        <Button variant="outline" size="sm" className="text-xs h-8" onClick={() => onAddNode('outputNode')}>Task Output</Button>
                    </div>
                </div>
                
                {/* View & History Actions */}
                <div className="space-y-1 pt-2 border-t">
                    <Label className="text-xs font-semibold text-muted-foreground px-1">View & History</Label>
                    <div className="grid grid-cols-2 gap-1.5">
                        <Button variant="outline" size="sm" className="text-xs h-8" onClick={onUndo} disabled={!canUndo}><Undo className="h-3.5 w-3.5 mr-1.5" />Undo</Button>
                        <Button variant="outline" size="sm" className="text-xs h-8" onClick={onRedo} disabled={!canRedo}><Redo className="h-3.5 w-3.5 mr-1.5" />Redo</Button>
                    </div>
                </div>

                {/* Selected Node Actions */}
                {selectedNodesCount > 0 && (
                    <div className="space-y-1 pt-2 border-t">
                        <Label className="text-xs font-semibold text-muted-foreground px-1">Selected ({selectedNodesCount})</Label>
                        <div className="flex flex-col space-y-1.5">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="text-xs h-8 w-full justify-start">
                                        <Paintbrush className="h-3.5 w-3.5 mr-2" /> Change Color
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>Select Color</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <div className="grid grid-cols-5 gap-1 p-1">
                                        {nodeColors.map(color => (
                                            <DropdownMenuItem
                                                key={color.value}
                                                className={`h-6 w-6 p-0 rounded-full focus:ring-2 focus:ring-ring focus:ring-offset-1 ${color.value}`}
                                                onClick={() => onChangeColor(color.value)}
                                                style={{ backgroundColor: color.value.startsWith('bg-') ? undefined : color.value }}
                                            />
                                        ))}
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Button variant="outline" size="sm" className="text-xs h-8 w-full justify-start" onClick={onGroupNodes}>
                                <Group className="h-3.5 w-3.5 mr-2" /> Group Nodes
                            </Button>

                            {selectedNodesCount === 1 && onOpenLinkDialog && (
                                <Button variant="outline" size="sm" className="text-xs h-8 w-full justify-start" onClick={onOpenLinkDialog}>
                                    <Link2 className="h-3.5 w-3.5 mr-2" /> Link Task...
                                </Button>
                            )}
                            
                            {addSelectedNodesToBookmarks && (
                                <Button variant="outline" size="sm" className="text-xs h-8 w-full justify-start" onClick={addSelectedNodesToBookmarks}>
                                    <BookmarkPlus className="h-3.5 w-3.5 mr-2" /> Add to Bookmarks
                                </Button>
                            )}

                            <Button variant="destructive" size="sm" className="text-xs h-8 w-full justify-start" onClick={onDeleteNodes}>
                                <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete Selected
                            </Button>
                        </div>
                    </div>
                )}

                <AddWallDialog
                    isOpen={isAddWallDialogOpen}
                    onOpenChange={setIsAddWallDialogOpen}
                    onAddWall={onAddWall}
                    projects={projects}
                />

                 <ManageWallDialog
                    isOpen={isManageWallDialogOpen}
                    onOpenChange={setIsManageWallDialogOpen}
                    wallData={wallToManage}
                    onSave={handleSaveManagedWall}
                    projects={projects}
                />
            </div>
        );
    };

    export default NodeBaseToolbar;
  