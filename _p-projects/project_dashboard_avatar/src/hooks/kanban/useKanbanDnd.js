
    import { useState, useCallback } from 'react';
    import {
      DragOverlay,
      useSensors,
      useSensor,
      PointerSensor,
      KeyboardSensor,
      closestCenter,
      closestCorners
    } from '@dnd-kit/core';
    import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
    import { findColumn, findCard } from '@/lib/kanbanUtils';

    const useKanbanDnd = (columns, setColumns, handleEditCard) => {
      const [activeId, setActiveId] = useState(null);
      const [activeItemType, setActiveItemType] = useState(null);
      const [activeData, setActiveData] = useState(null);

      const sensors = useSensors(
        useSensor(PointerSensor, {
          activationConstraint: { distance: 8 },
        }),
        useSensor(KeyboardSensor, {
          coordinateGetter: sortableKeyboardCoordinates,
        })
      );

      const handleDragStart = useCallback((event) => {
        const { active } = event;
        const { id, data } = active;
        const type = data.current?.type;

        setActiveId(id);
        setActiveItemType(type);

        if (type === 'column') {
          const column = findColumn(columns, id);
          setActiveData(column);
        } else if (type === 'card') {
          const { card } = findCard(columns, id);
          setActiveData(card);
        }
      }, [columns]);

      const handleDragOver = useCallback((event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const activeId = active.id;
        const overId = over.id;
        const isActiveCard = active.data.current?.type === 'card';
        const isOverCard = over.data.current?.type === 'card';
        const isOverColumn = over.data.current?.type === 'column';

        if (!isActiveCard) return; // Only handle card dragging over other elements

        setColumns((prevColumns) => {
            let newColumns = [...prevColumns];
            const { card: activeCard, columnIndex: sourceColumnIndex, cardIndex: sourceCardIndex } = findCard(newColumns, activeId);

            if (!activeCard) return prevColumns; // Should not happen

            let targetColumnIndex = -1;
            let targetCardIndex = -1;

            if (isOverColumn) {
                // Dropping card onto a column
                targetColumnIndex = newColumns.findIndex(col => col.id === overId);
                if (targetColumnIndex !== -1) {
                    targetCardIndex = newColumns[targetColumnIndex].cards.length; // Add to the end
                }
            } else if (isOverCard) {
                // Dropping card onto another card
                const { columnIndex: overColumnIndex, cardIndex: overCardIndex } = findCard(newColumns, overId);
                targetColumnIndex = overColumnIndex;
                targetCardIndex = overCardIndex;
            }

            if (targetColumnIndex === -1) return prevColumns; // Invalid drop target

            // Remove card from source column
             newColumns[sourceColumnIndex].cards.splice(sourceCardIndex, 1);

             // If moving within the same column, adjust target index if needed
             if (sourceColumnIndex === targetColumnIndex && targetCardIndex > sourceCardIndex) {
                 targetCardIndex -= 1;
             }

             // Add card to target column at the correct position
             newColumns[targetColumnIndex].cards.splice(targetCardIndex, 0, activeCard);

            return newColumns;
        });


      }, [setColumns]);


       const handleDragEnd = useCallback((event) => {
         const { active, over } = event;
         setActiveId(null);
         setActiveItemType(null);
         setActiveData(null);

         if (!over) return; // Dropped outside of any droppable area

         const activeId = active.id;
         const overId = over.id;
         const isActiveColumn = active.data.current?.type === 'column';
         const isActiveCard = active.data.current?.type === 'card';

         if (activeId === overId && isActiveCard) return; // Card dropped on itself, no change

         setColumns((prevColumns) => {
           let newColumns = [...prevColumns];

           if (isActiveColumn) {
             // --- Column Drag End ---
             const oldIndex = newColumns.findIndex(col => col.id === activeId);
             const newIndex = newColumns.findIndex(col => col.id === overId);
             if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
               newColumns = arrayMove(newColumns, oldIndex, newIndex);
             }
           } else if (isActiveCard) {
             // --- Card Drag End ---
             // The state was already updated optimistically in handleDragOver.
             // Here, we might persist the final state or trigger API calls.
             // We also need to update the card's columnId if it moved columns.
             const { card, columnIndex: finalColumnIndex } = findCard(newColumns, activeId);
             if (card && newColumns[finalColumnIndex].id !== active.data.current?.columnId) {
                // Update card data only if moved to a different column
                 if(handleEditCard) {
                    handleEditCard(newColumns[finalColumnIndex].id, activeId, { /* You might update backend/state here if needed */ });
                 }
                 console.log(`Card ${activeId} moved to column ${newColumns[finalColumnIndex].id}`);
             }
           }
           return newColumns;
         });
       }, [setColumns, handleEditCard]);


      return {
        activeId,
        activeItemType,
        activeData,
        sensors,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
      };
    };

    export default useKanbanDnd;
  