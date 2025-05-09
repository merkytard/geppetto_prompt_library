
    import React from 'react';
    import { Button } from '@/components/ui/button';
    import { ScrollArea } from '@/components/ui/scroll-area';
    import { Input } from '@/components/ui/input';
    import { cn } from '@/lib/utils';
    import { getIconComponent } from '@/data/icons';
    import { FolderOpen, Search, Bookmark, Trash2 } from 'lucide-react';

    const SimpleTreeItem = ({ nodeId, label, children, onClick, isSelected, icon: Icon }) => (
        <div className="ml-4">
            <div 
                onClick={onClick} 
                className={cn(
                    "flex items-center p-1.5 rounded-md cursor-pointer hover:bg-muted",
                    isSelected && "bg-primary/10 text-primary"
                )}
            >
                {Icon && <Icon className="h-4 w-4 mr-2 flex-shrink-0" />}
                <span className="text-xs truncate">{label}</span>
            </div>
            {children && <div className="ml-4 border-l border-dashed pl-2">{children}</div>}
        </div>
    );


    const NodeHierarchyPanel = ({
        nodes,
        selectedNodes,
        onNodeSelect, 
        bookmarkedNodes,
        onBookmarkSelect,
        removeBookmark,
        onAddSelectedToBookmarks,
        onAddNode,
        onChangeColor,
        onGroupNodes,
        onDeleteNodes,
        onOpenLinkDialog,
        onUngroupNodes
    }) => {
        const [searchTerm, setSearchTerm] = React.useState('');

        const filteredNodes = React.useMemo(() => {
            if (!searchTerm) return nodes;
            return nodes.filter(node =>
                node.data.label?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                node.data.details?.some(detail => detail.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }, [nodes, searchTerm]);

        const renderNodeTree = (nodeList, parentId = null) => {
            return nodeList
                .filter(node => (node.data.parentId || null) === parentId)
                .map(node => {
                    const NodeIcon = getIconComponent(node.data.icon) || FolderOpen;
                    const children = renderNodeTree(nodeList, node.id);
                    return (
                        <SimpleTreeItem
                            key={node.id}
                            nodeId={node.id}
                            label={node.data.label || `Node ${node.id.substring(0, 5)}`}
                            onClick={() => onNodeSelect && onNodeSelect(node.id)}
                            isSelected={selectedNodes.some(sn => sn.id === node.id)}
                            icon={NodeIcon}
                        >
                            {children}
                        </SimpleTreeItem>
                    );
                });
        };
        
        const selectedNodeIds = selectedNodes.map(n => n.id);

        return (
            <div className="p-3 space-y-3 h-full flex flex-col">
                <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search nodes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 text-xs h-8"
                    />
                </div>

                {bookmarkedNodes && bookmarkedNodes.length > 0 && (
                    <div className="pt-2 border-t">
                        <h3 className="text-xs font-semibold text-muted-foreground px-1 mb-1.5 flex items-center">
                            <Bookmark className="h-3.5 w-3.5 mr-1.5" /> Bookmarks ({bookmarkedNodes.length})
                        </h3>
                        <ScrollArea className="h-auto max-h-48">
                            <div className="space-y-0.5">
                                {bookmarkedNodes.map(node => {
                                    const NodeIcon = getIconComponent(node.data.icon) || FolderOpen;
                                    return (
                                        <div
                                            key={`bookmark-${node.id}`}
                                            className={cn(
                                                "flex items-center justify-between p-1.5 rounded-md cursor-pointer hover:bg-muted group",
                                                selectedNodeIds.includes(node.id) && "bg-primary/10 text-primary"
                                            )}
                                            onClick={() => onBookmarkSelect && onBookmarkSelect(node.id)}
                                        >
                                            <div className="flex items-center truncate">
                                                <NodeIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                                                <span className="text-xs truncate">{node.data.label || `Node ${node.id.substring(0,5)}`}</span>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={(e) => { e.stopPropagation(); removeBookmark && removeBookmark(node.id); }}
                                            >
                                                <Trash2 className="h-3 w-3 text-destructive" />
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>
                        </ScrollArea>
                    </div>
                )}
                
                 {selectedNodes.length > 0 && onAddSelectedToBookmarks && (
                    <Button variant="outline" size="sm" className="w-full text-xs h-8 mt-1" onClick={onAddSelectedToBookmarks}>
                        <Bookmark className="h-3.5 w-3.5 mr-1.5" /> Add Selected to Bookmarks
                    </Button>
                )}

                <div className="pt-2 border-t flex-grow overflow-hidden">
                    <h3 className="text-xs font-semibold text-muted-foreground px-1 mb-1.5">Node Hierarchy</h3>
                    <ScrollArea className="h-full pb-12"> 
                        {filteredNodes.length > 0 ? (
                            renderNodeTree(filteredNodes)
                        ) : (
                            <p className="text-xs text-muted-foreground p-2 text-center">
                                {searchTerm ? 'No nodes match your search.' : 'No nodes on this wall yet.'}
                            </p>
                        )}
                    </ScrollArea>
                </div>
            </div>
        );
    };

    export default NodeHierarchyPanel;
  