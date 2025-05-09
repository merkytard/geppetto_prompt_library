
import React from 'react';
import { DragOverlay } from "@dnd-kit/core";

const KanbanDragOverlay = ({ activeId, activeItemType, activeData }) => {
  if (!activeId || !activeItemType || !activeData) return null;

  return (
    <DragOverlay>
      {activeItemType === 'Column' && (
        <div className="kanban-column opacity-80 shadow-xl cursor-grabbing">
          <div className="column-header">
            <h3 className="column-title">{activeData.title}</h3>
          </div>
          <div className="column-content">
            {activeData.cards?.map(card => (
              <div key={card.id} className="kanban-card opacity-50">
                <h4 className="font-medium text-sm">{card.title}</h4>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeItemType === 'Card' && (
        <div className="kanban-card opacity-90 bg-primary/5 border border-primary/30 shadow-lg w-[280px] cursor-grabbing scale-105">
          <h4 className="font-medium text-sm">{activeData.title}</h4>
          {activeData.description && (
            <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
              {activeData.description}
            </p>
          )}
          {activeData.labels && activeData.labels.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {activeData.labels.map(label => (
                <span
                  key={label}
                  className="px-1.5 py-0.5 rounded-full text-[10px] bg-primary/10 text-primary font-medium"
                >
                  {label}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </DragOverlay>
  );
};

export default KanbanDragOverlay;
