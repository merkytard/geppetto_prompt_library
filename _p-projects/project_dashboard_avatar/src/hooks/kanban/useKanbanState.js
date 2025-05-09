
    import usePersistentState from '@/hooks/usePersistentState';
    import { initialKanbanData, initialUsers } from '@/data/initialKanbanData';

    const useKanbanState = () => {
      const [columns, setColumns] = usePersistentState('kanbanData', initialKanbanData);
      const [users] = usePersistentState('kanbanUsers', initialUsers); // Users are mostly static for now

      return {
        columns,
        setColumns,
        users,
      };
    };

    export default useKanbanState;
  