
import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import KanbanDragOverlay from "@/components/KanbanDragOverlay";

const KanbanContainer = ({
  children,
  activeId,
  activeItemType,
  activeData,
  handleDragStart,
  handleDragEnd,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div className="h-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {children}
        <KanbanDragOverlay
          activeId={activeId}
          activeItemType={activeItemType}
          activeData={activeData}
        />
      </DndContext>
    </div>
  );
};

export default KanbanContainer;
