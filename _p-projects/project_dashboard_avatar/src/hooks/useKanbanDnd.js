
import { useState, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { moveColumn, moveCardWithinColumn, moveCardBetweenColumns } from '@/lib/kanbanUtils';

const useKanbanDnd = (setColumns) => {
  const { toast } = useToast();
  const [activeId, setActiveId] = useState(null);
  const [activeItemType, setActiveItemType] = useState(null);
  const [activeData, setActiveData] = useState(null);

  const handleDragStart = useCallback((event) => {
    const { active } = event;
    setActiveId(active.id);
    const type = active.data.current?.type;
    setActiveItemType(type);

    if (type === 'Column') {
      setActiveData(active.data.current.column);
    } else if (type === 'Card') {
      setActiveData(active.data.current.card);
    } else {
      setActiveData(null);
    }
  }, []);

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;

    const resetState = () => {
      setActiveId(null);
      setActiveData(null);
      setActiveItemType(null);
    };

    if (!over || active.id === over.id) {
      resetState();
      return;
    }

    const activeId = active.id;
    const overId = over.id;
    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    setColumns((currentColumns) => {
      if (activeType === 'Column' && overType === 'Column') {
        const { newColumns, movedColumn } = moveColumn(currentColumns, activeId, overId);
        if (movedColumn) {
          toast({ title: "Column moved", description: `Column "${movedColumn.title}" moved.` });
        }
        return newColumns;
      }

      if (activeType === 'Card') {
        const sourceColumnId = active.data.current?.sortable?.containerId;
        const destinationColumnId = over.data.current?.sortable?.containerId || overId;
        const isOverColumn = overType === 'Column';

        if (sourceColumnId === destinationColumnId || (isOverColumn && sourceColumnId === overId)) {
          const { newColumns, movedCard } = moveCardWithinColumn(currentColumns, sourceColumnId, activeId, overId);
          if (movedCard) {
            toast({ title: "Card reordered", description: `Card "${movedCard.title}" reordered.` });
          }
          return newColumns;
        } else {
          const finalDestinationColumnId = isOverColumn ? overId : destinationColumnId;
          const { newColumns, movedCard, destinationColumnTitle } = moveCardBetweenColumns(currentColumns, sourceColumnId, finalDestinationColumnId, activeId, isOverColumn ? null : overId);
          if (movedCard && destinationColumnTitle) {
            toast({ title: "Card moved", description: `Card "${movedCard.title}" moved to "${destinationColumnTitle}".` });
          }
          return newColumns;
        }
      }
      return currentColumns; // Return unchanged state if no action taken
    });

    resetState();
  }, [toast, setColumns]);

  return {
    activeId,
    activeItemType,
    activeData,
    handleDragStart,
    handleDragEnd,
  };
};

export default useKanbanDnd;
