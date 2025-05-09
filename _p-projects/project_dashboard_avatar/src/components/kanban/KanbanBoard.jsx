
    import React from 'react';
    import KanbanColumnList from '@/components/kanban/KanbanColumnList';
    import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

    const KanbanBoard = ({
        columns,
        users,
        tags,
        selectedProjectId,
        onUpdateColumnTitle,
        onDeleteColumn,
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
        if (!columns || columns.length === 0) {
            return (
                <div className="flex-grow flex items-center justify-center p-4 text-center">
                    <p className="text-muted-foreground">
                        No columns found for this project. <br/>
                        Add a new column to get started.
                    </p>
                </div>
            );
        }
        
        return (
            <ScrollArea className="flex-grow w-full whitespace-nowrap">
                <div className="flex gap-4 p-4 h-full min-h-[calc(100%-4rem)]"> {/* Adjust min-h if needed */}
                    <KanbanColumnList
                        columns={columns}
                        users={users}
                        tags={tags}
                        selectedProjectId={selectedProjectId}
                        onUpdateColumnTitle={onUpdateColumnTitle}
                        onDeleteColumn={onDeleteColumn}
                        onAddCard={onAddCard}
                        onEditCard={onEditCard}
                        onDeleteCard={onDeleteCard}
                        onAssignUser={onAssignUser}
                        onChangeCardColor={onChangeCardColor}
                        onLinkToNode={onLinkToNode}
                        onAddTag={onAddTag}
                        onRemoveTag={onRemoveTag}
                        onArchiveCard={onArchiveCard}
                        onSetReminder={onSetReminder}
                        onCompleteCard={onCompleteCard} // Pass it down
                    />
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        );
    };

    export default KanbanBoard;
  