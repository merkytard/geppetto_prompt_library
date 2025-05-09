
    import React from 'react';
    import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from '@/components/ui/sheet';
    import { Button } from '@/components/ui/button';
    import KanbanCard from '@/components/KanbanCard'; // Re-use KanbanCard for display
    import { ScrollArea } from '@/components/ui/scroll-area';
    import { ArchiveRestore, X } from 'lucide-react';

    const ArchivedTasksSidebar = ({ isOpen, onClose, archivedCards, onUnarchiveCard, users }) => {
      return (
        <Sheet open={isOpen} onOpenChange={onClose}>
          <SheetContent className="w-full sm:max-w-md flex flex-col">
            <SheetHeader className="p-4 border-b">
              <div className="flex justify-between items-center">
                <SheetTitle>Archived Tasks</SheetTitle>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon">
                    <X className="h-5 w-5" />
                  </Button>
                </SheetClose>
              </div>
              <SheetDescription>
                Tasks that have been archived. You can restore them here.
              </SheetDescription>
            </SheetHeader>
            
            <ScrollArea className="flex-grow p-4">
              {archivedCards && archivedCards.length > 0 ? (
                <div className="space-y-3">
                  {archivedCards.map(card => (
                    <div key={card.id} className="relative group">
                      <KanbanCard
                        card={{ ...card, isArchived: true }} // Pass isArchived to prevent drag/sort
                        columnId={card.columnId || 'archived'} // Provide a dummy columnId
                        users={users}
                        onEdit={() => {}} // No edit for archived cards directly here
                        onAssignUser={() => {}}
                        onChangeColor={() => {}}
                        onLinkToNode={() => {}}
                        onArchive={() => {}} // No archive again
                        onSetReminder={() => {}}
                        onCompleteCard={() => {}}
                        isSelected={false}
                        isOverlay={false}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background text-xs"
                        onClick={() => onUnarchiveCard(card.columnId, card.id)}
                        title="Unarchive Task"
                      >
                        <ArchiveRestore className="h-3.5 w-3.5 mr-1" />
                        Restore
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-10">No archived tasks.</p>
              )}
            </ScrollArea>
            <div className="p-4 border-t">
                <Button variant="outline" className="w-full" onClick={onClose}>Close</Button>
            </div>
          </SheetContent>
        </Sheet>
      );
    };

    export default ArchivedTasksSidebar;
  