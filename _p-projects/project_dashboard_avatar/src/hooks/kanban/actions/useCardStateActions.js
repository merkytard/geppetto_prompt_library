
    import { useCallback } from 'react';
    import { useToast } from "@/components/ui/use-toast";
    import { updateColumnsOnArchiveCard, updateColumnsOnSetReminder } from '@/lib/kanbanActionHelpers';

    const useCardStateActions = (setColumns, setArchivedCards) => {
        const { toast } = useToast();

        const handleArchiveCard = useCallback((columnId, cardId) => {
             setColumns(prevColumns => {
                 const { updatedColumns, cardTitle, archivedCard } = updateColumnsOnArchiveCard(columnId, cardId)(prevColumns);
                 if (cardTitle && archivedCard) {
                     setArchivedCards(prevArchived => [...prevArchived, archivedCard]);
                     toast({ title: "Card Archived", description: `Card "${cardTitle}" moved to archive.` });
                 } else if (cardTitle) {
                     toast({ title: "Archive Failed", description: `Could not archive card "${cardTitle}". Card not found or already processed.`, variant: "destructive" });
                 }
                 return updatedColumns;
             });
        }, [setColumns, setArchivedCards, toast]);

        const handleSetReminder = useCallback((columnId, cardId, settings) => {
             setColumns(prevColumns => {
                 const { updatedColumns, cardTitle } = updateColumnsOnSetReminder(columnId, cardId, settings)(prevColumns);
                 if (cardTitle) {
                     const freqLabel = settings.frequency === 'none' ? 'None' : settings.frequency.replace('_', ' ');
                     toast({ title: "Reminder Set", description: `Reminder for "${cardTitle}" set to: ${freqLabel}.` });
                     if (settings.frequency !== 'none') {
                         console.log(`Mock scheduling reminder for ${cardId} with frequency ${settings.frequency}`);
                     }
                 }
                return updatedColumns;
             });
        }, [setColumns, toast]);

        return { handleArchiveCard, handleSetReminder };
    };

    export default useCardStateActions;
  