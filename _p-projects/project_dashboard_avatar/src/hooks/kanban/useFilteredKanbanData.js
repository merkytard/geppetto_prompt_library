
    import { useMemo } from "react";

    const useFilteredKanbanData = (columns, searchTerm = '', userFilter = 'all', tagFilter = 'all', projectFilter = 'all') => {

      const filteredColumns = useMemo(() => {
        // Check if any filter is active
        const noFilters = !searchTerm && userFilter === 'all' && tagFilter === 'all' && projectFilter === 'all';

        if (noFilters) {
          return columns; // Return original columns if no filters are applied
        }

        // Apply filters
        return columns.map(column => ({
          ...column,
          cards: column.cards.filter(card => {
            // Project Filter (Assuming card has a projectId property)
            const projectMatch = projectFilter === 'all' || card.projectId === projectFilter;

            // Search Filter
            const searchMatch = searchTerm ? (
              card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (card.description && card.description.toLowerCase().includes(searchTerm.toLowerCase()))
            ) : true;

            // User Filter
            const userMatch = userFilter === 'all' || (card.assignedUserIds && card.assignedUserIds.includes(userFilter));

            // Tag Filter
            const tagMatch = tagFilter === 'all' || (card.tags && card.tags.includes(tagFilter));

            // Card must match all active filters
            return projectMatch && searchMatch && userMatch && tagMatch;
          })
        }));
      }, [columns, searchTerm, userFilter, tagFilter, projectFilter]);

      return filteredColumns;
    };

    export default useFilteredKanbanData;
  