
    import React, { useState } from 'react';
    import { DndContext } from '@dnd-kit/core';
    import KanbanBoard from '@/components/kanban/KanbanBoard';
    import KanbanHeader from '@/components/kanban/KanbanHeader'; // Corrected import
    import ArchivedTasksSidebar from '@/components/kanban/ArchivedTasksSidebar'; // Corrected import
    import useKanbanData from '@/hooks/useKanbanData';
    import { Button } from '@/components/ui/button';
    import { Archive } from 'lucide-react';

    const KanbanPage = () => {
        const {
            columns,
            users,
            tags,
            archivedCards,
            selectedProjectId,
            setSelectedProjectId,
            projects,
            handleDragEnd,
            handleAddColumn,
            handleUpdateColumnTitle,
            handleDeleteColumn,
            handleAddCard,
            handleEditCard,
            handleDeleteCard,
            handleAssignUser,
            handleChangeCardColor,
            handleLinkNode,
            handleAddTag,
            handleRemoveTag,
            handleArchiveCard,
            handleUnarchiveCard,
            handleSetReminder,
            handleCompleteCard, 
        } = useKanbanData();

        const [isArchivedSidebarOpen, setIsArchivedSidebarOpen] = useState(false);

        const toggleArchivedSidebar = () => setIsArchivedSidebarOpen(!isArchivedSidebarOpen);

        return (
            <DndContext onDragEnd={handleDragEnd}>
                <div className="flex flex-col h-full max-h-[calc(100vh-var(--header-height,64px))]">
                    <KanbanHeader
                        onAddColumn={handleAddColumn}
                        projects={projects}
                        selectedProjectId={selectedProjectId}
                        onSelectProject={setSelectedProjectId}
                        onToggleArchivedSidebar={toggleArchivedSidebar}
                        archivedCount={archivedCards.length}
                    />
                    <KanbanBoard
                        columns={columns}
                        users={users}
                        tags={tags}
                        selectedProjectId={selectedProjectId}
                        onUpdateColumnTitle={handleUpdateColumnTitle}
                        onDeleteColumn={handleDeleteColumn}
                        onAddCard={handleAddCard}
                        onEditCard={handleEditCard}
                        onDeleteCard={handleDeleteCard}
                        onAssignUser={handleAssignUser}
                        onChangeCardColor={handleChangeCardColor}
                        onLinkToNode={handleLinkNode}
                        onAddTag={handleAddTag}
                        onRemoveTag={handleRemoveTag}
                        onArchiveCard={handleArchiveCard}
                        onSetReminder={handleSetReminder}
                        onCompleteCard={handleCompleteCard} 
                    />
                    <ArchivedTasksSidebar
                        isOpen={isArchivedSidebarOpen}
                        onClose={toggleArchivedSidebar}
                        archivedCards={archivedCards}
                        onUnarchiveCard={handleUnarchiveCard}
                        users={users}
                    />
                     <Button 
                        variant="outline" 
                        size="icon" 
                        className="fixed bottom-6 right-6 lg:hidden z-50 rounded-full shadow-lg"
                        onClick={toggleArchivedSidebar}
                        aria-label="Toggle archived tasks"
                    >
                        <Archive className="h-5 w-5" />
                        {archivedCards.length > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">
                                {archivedCards.length}
                            </span>
                        )}
                    </Button>
                </div>
            </DndContext>
        );
    };

    export default KanbanPage;
  