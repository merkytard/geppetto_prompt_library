
    import React, { useState, useRef } from 'react';
    import { useSortable } from '@dnd-kit/sortable';
    import { CSS } from '@dnd-kit/utilities';
    import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
    import KanbanCard from '@/components/KanbanCard';
    import AddCardDialog from '@/components/AddCardDialog';
    import { Button } from '@/components/ui/button';
    import { GripVertical, PlusCircle, Trash2, Edit3 } from 'lucide-react';
    import { Input } from '@/components/ui/input';
    import { cn } from '@/lib/utils';
    import { motion, AnimatePresence } from 'framer-motion';
    import {
        DropdownMenu,
        DropdownMenuContent,
        DropdownMenuItem,
        DropdownMenuSeparator,
        DropdownMenuTrigger,
    } from "@/components/ui/dropdown-menu";

    const KanbanColumn = ({
        column,
        users,
        tags,
        selectedProjectId,
        onUpdateTitle,
        onDelete,
        onAddCard,
        onEditCard,
        onDeleteCard,
        onAssignUser,
        onChangeCardColor,
        onLinkToNode,
        onAddTag,
        onRemoveTag,
        onArchiveCard,
        onSetReminder,
        onCompleteCard, // Ensure this is received
    }) => {
        const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
            id: column.id,
            data: { type: 'COLUMN', column },
        });

        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
            opacity: isDragging ? 0.7 : 1,
        };

        const [isAddCardDialogOpen, setIsAddCardDialogOpen] = useState(false);
        const [isEditingTitle, setIsEditingTitle] = useState(false);
        const [newTitle, setNewTitle] = useState(column.title);
        const titleInputRef = useRef(null);

        const handleTitleChange = (e) => setNewTitle(e.target.value);

        const handleTitleSave = () => {
            if (newTitle.trim() && newTitle.trim() !== column.title) {
                onUpdateTitle(column.id, newTitle.trim());
            }
            setIsEditingTitle(false);
        };

        const handleTitleKeyDown = (e) => {
            if (e.key === 'Enter') handleTitleSave();
            if (e.key === 'Escape') {
                setNewTitle(column.title);
                setIsEditingTitle(false);
            }
        };

        const handleEditTitleClick = () => {
            setIsEditingTitle(true);
            setTimeout(() => titleInputRef.current?.focus(), 0);
        };

        return (
            <div
                ref={setNodeRef}
                style={style}
                className={cn(
                    "flex flex-col w-72 md:w-80 max-h-full rounded-lg shadow-md bg-card/60 dark:bg-slate-800/50 backdrop-blur-sm overflow-hidden flex-shrink-0",
                    isDragging && "ring-2 ring-primary"
                )}
            >
                <div
                    {...attributes}
                    {...listeners}
                    className="flex items-center justify-between p-3 bg-muted/40 dark:bg-slate-700/30 cursor-grab active:cursor-grabbing border-b border-border/50"
                >
                    {isEditingTitle ? (
                        <Input
                            ref={titleInputRef}
                            value={newTitle}
                            onChange={handleTitleChange}
                            onBlur={handleTitleSave}
                            onKeyDown={handleTitleKeyDown}
                            className="h-8 text-sm font-semibold flex-grow mr-2 bg-background"
                        />
                    ) : (
                        <h3 className="text-sm font-semibold text-card-foreground truncate" onClick={handleEditTitleClick}>
                            {column.title} ({column.cards.length})
                        </h3>
                    )}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={handleEditTitleClick}>
                                <Edit3 className="mr-2 h-3.5 w-3.5" /> Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setIsAddCardDialogOpen(true)}>
                                <PlusCircle className="mr-2 h-3.5 w-3.5" /> Add Card
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => onDelete(column.id)}
                                className="text-destructive focus:text-destructive focus:bg-destructive/10"
                                disabled={column.cards.length > 0}
                            >
                                <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete Column
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="flex-grow overflow-y-auto p-3 space-y-3 no-scrollbar">
                    <SortableContext items={column.cards.map(card => card.id)} strategy={verticalListSortingStrategy}>
                        <AnimatePresence>
                            {column.cards.map(card => (
                                !card.isArchived && ( // Ensure archived cards are not rendered here
                                    <KanbanCard
                                        key={card.id}
                                        card={card}
                                        columnId={column.id}
                                        users={users}
                                        onEdit={(clickedCard) => onEditCard(column.id, clickedCard.id, clickedCard)}
                                        onAssignUser={onAssignUser}
                                        onChangeColor={onChangeCardColor}
                                        onLinkToNode={onLinkToNode}
                                        onArchive={onArchiveCard}
                                        onSetReminder={onSetReminder}
                                        onCompleteCard={onCompleteCard} // Pass it down
                                    />
                                )
                            ))}
                        </AnimatePresence>
                    </SortableContext>
                    {column.cards.filter(c => !c.isArchived).length === 0 && (
                        <p className="text-xs text-muted-foreground text-center py-4">No tasks in this column.</p>
                    )}
                </div>

                <Button
                    variant="ghost"
                    className="w-full justify-start p-3 mt-auto border-t border-border/50 text-xs text-muted-foreground hover:bg-muted/50 dark:hover:bg-slate-700/50"
                    onClick={() => setIsAddCardDialogOpen(true)}
                >
                    <PlusCircle className="h-4 w-4 mr-2" /> Add card
                </Button>

                <AddCardDialog
                    isOpen={isAddCardDialogOpen}
                    onOpenChange={setIsAddCardDialogOpen}
                    columnId={column.id}
                    onAddCard={onAddCard}
                    availableTags={tags}
                    users={users}
                    selectedProjectId={selectedProjectId}
                />
            </div>
        );
    };

    export default KanbanColumn;

  