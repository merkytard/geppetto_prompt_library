
    import React, { useState, useMemo } from 'react';
    import { ScrollArea } from '@/components/ui/scroll-area';
    import KanbanCard from '@/components/KanbanCard'; 
    import EditCardDialog from '@/components/EditCardDialog'; 
    import { Input } from '@/components/ui/input';
    import { Search, CheckCircle } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { useToast } from '@/components/ui/use-toast';

    const JiraTaskList = ({
        columns, users, selectedProjectId, projects, 
        onUpdateCard, onDeleteCard, onAssignUser, onChangeCardColor, 
        onLinkToNode, onArchiveCard, onSetReminder, onCompleteCard, 
    }) => {
        const [editingCard, setEditingCard] = useState(null);
        const [searchTerm, setSearchTerm] = useState('');
        const { toast } = useToast();

        const handleEditClick = (card) => setEditingCard(card);
        const handleCloseDialog = () => setEditingCard(null);

        const handleSaveCard = (cardId, updatedData) => {
            const cardToUpdate = columns.flatMap(col => col.cards).find(c => c.id === cardId);
            if (onUpdateCard && cardToUpdate) {
                onUpdateCard(cardToUpdate.columnId, cardId, updatedData);
            }
            handleCloseDialog();
        };

        const handleDeleteCardWrapper = (cardId) => {
            const cardToDelete = columns.flatMap(col => col.cards).find(c => c.id === cardId);
            if (onDeleteCard && cardToDelete) {
                onDeleteCard(cardToDelete.columnId, cardId);
            }
            handleCloseDialog();
        };
        
        const handleArchiveCardWrapper = (columnId, cardId) => {
            if(onArchiveCard) onArchiveCard(columnId, cardId);
        };

        const handleCompleteCardWrapper = (columnId, cardId) => {
            if (onCompleteCard) {
                const card = columns.flatMap(col => col.cards).find(c => c.id === cardId);
                onCompleteCard(columnId, cardId); 
                // Toast is handled by useGamification hook via useJiraData
            }
        };

        const filteredCards = useMemo(() => {
            const allCards = columns.flatMap(col => col.cards.map(card => ({ ...card, columnId: col.id }))); 
            return allCards.filter(card => {
                const projectMatch = selectedProjectId === 'all' || card.projectId === selectedProjectId;
                const searchMatch = searchTerm === '' ||
                                    card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    card.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    card.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
                return projectMatch && searchMatch && !card.isArchived; 
            });
        }, [columns, selectedProjectId, searchTerm]);

        const availableTags = useMemo(() => {
            const allTags = new Set(columns.flatMap(col => col.cards.flatMap(card => card.tags || [])));
            return Array.from(allTags);
        }, [columns]);

        const getProjectName = (projectId) => {
            if (!projects || !projectId) return '';
            const project = projects.find(p => p.id === projectId);
            return project ? project.name : 'Unknown';
        };

        const cardVariants = {
            initial: { opacity: 0, y: 20, scale: 0.95 },
            animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
            exit: { opacity: 0, x: -30, scale: 0.9, transition: { duration: 0.2, ease: "easeIn" } },
            completed: { opacity: 0.5, x: "100%", transition: { duration: 0.5, ease: "easeInOut" } }
        };

        return (
            <>
                <div className="p-4 md:p-6 border rounded-lg bg-card text-card-foreground h-full flex flex-col">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 flex-shrink-0">
                         <h2 className="text-lg md:text-xl font-semibold">
                            Tasks for {selectedProjectId === 'all' ? 'All Projects' : `Project: ${getProjectName(selectedProjectId)}`}
                         </h2>
                         <div className="relative w-full sm:w-64">
                            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search tasks..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8 h-9 text-xs sm:text-sm"
                            />
                        </div>
                    </div>

                    <ScrollArea className="flex-grow pr-2">
                        <motion.div layout className="space-y-3">
                            <AnimatePresence mode="popLayout">
                                {filteredCards.map(card => (
                                    <motion.div
                                        key={card.id}
                                        layout
                                        variants={cardVariants}
                                        initial="initial"
                                        animate="animate"
                                        exit="exit"
                                        custom={card.status === 'COMPLETED'}
                                    >
                                        <KanbanCard
                                            card={card}
                                            columnId={card.columnId} 
                                            users={users}
                                            onEdit={handleEditClick} 
                                            onAssignUser={(colId, cardId, userId) => onAssignUser(card.columnId, cardId, userId)}
                                            onChangeColor={onChangeCardColor}
                                            onLinkToNode={(cardId, nodeId) => onLinkToNode(cardId, nodeId)} 
                                            onArchive={handleArchiveCardWrapper} 
                                            onSetReminder={(colId, cardId, settings) => onSetReminder(card.columnId, cardId, settings)}
                                            isSelected={false} 
                                            isOverlay={false} 
                                            onCompleteCard={handleCompleteCardWrapper} 
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {filteredCards.length === 0 && (
                                <p className="text-muted-foreground text-center py-4">
                                    {searchTerm ? 'No tasks match your search.' : 'No tasks found for this project.'}
                                </p>
                            )}
                        </motion.div>
                    </ScrollArea>
                </div>

                {editingCard && (
                    <EditCardDialog
                        isOpen={!!editingCard}
                        onOpenChange={handleCloseDialog}
                        cardData={editingCard}
                        onSave={handleSaveCard}
                        onDelete={handleDeleteCardWrapper}
                        availableTags={availableTags}
                        users={users}
                        columnId={editingCard.columnId} 
                        onAssignUser={onAssignUser}
                        onChangeColor={onChangeCardColor}
                        onLinkToNode={onLinkToNode}
                        onSetReminder={onSetReminder}
                    />
                )}
            </>
        );
    };

    export default JiraTaskList;
  