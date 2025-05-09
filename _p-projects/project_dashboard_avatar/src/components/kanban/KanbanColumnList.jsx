
    import React from 'react';
    import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
    import KanbanColumn from '@/components/KanbanColumn';

    const KanbanColumnList = ({
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
        return (
            <SortableContext items={columns.map(col => col.id)} strategy={horizontalListSortingStrategy}>
                {columns.map(column => (
                    <KanbanColumn
                        key={column.id}
                        column={column}
                        users={users}
                        tags={tags}
                        selectedProjectId={selectedProjectId}
                        onUpdateTitle={onUpdateColumnTitle}
                        onDelete={onDeleteColumn}
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
                ))}
            </SortableContext>
        );
    };

    export default KanbanColumnList;
  