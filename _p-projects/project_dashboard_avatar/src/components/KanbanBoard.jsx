
    import React from "react";
    import useKanbanData from "@/hooks/useKanbanData";
    import useFilteredKanbanData from "@/hooks/kanban/useFilteredKanbanData";
    import KanbanContainer from "@/components/kanban/KanbanContainer";
    import KanbanColumnList from "@/components/kanban/KanbanColumnList";
    import AddColumnButton from "@/components/kanban/AddColumnButton";

    const KanbanBoard = ({ searchTerm = '', userFilter = 'all', tagFilter = 'all', projectFilter = 'all' }) => {
      const kanbanProps = useKanbanData();

      // Use the dedicated hook for filtering
      const filteredColumns = useFilteredKanbanData(kanbanProps.columns, searchTerm, userFilter, tagFilter, projectFilter);

      return (
        <KanbanContainer {...kanbanProps}>
          <div className="flex gap-6 overflow-x-auto pb-4 pt-2 min-h-[calc(100vh-280px)] items-start">
            <KanbanColumnList
               {...kanbanProps}
               columns={filteredColumns}
            />
            <AddColumnButton onAddColumn={kanbanProps.handleAddColumn} />
          </div>
        </KanbanContainer>
      );
    };

    export default KanbanBoard;
  