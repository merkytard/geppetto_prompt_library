
    export const initialKanbanData = [
      {
        id: 'col-1',
        title: 'To Do',
        cards: [
          { id: 'card-1', title: 'Implement User Authentication', description: 'Set up login and registration using Supabase.', tags: ['auth', 'backend'], assignedUserIds: ['user-1'], color: 'bg-card', linkedNodeId: null, dueDate: '2025-05-15', estimatedTime: 8, actualTime: 0, isArchived: false, reminderSettings: { frequency: 'none' }, type: 'TASK', projectId: 'proj-1' },
          { id: 'card-2', title: 'Design Landing Page', description: 'Create mockups for the main landing page.', tags: ['design', 'ui'], assignedUserIds: ['user-2'], color: 'bg-blue-100 dark:bg-blue-900/30', linkedNodeId: null, dueDate: '2025-05-10', estimatedTime: 12, actualTime: 0, isArchived: false, reminderSettings: { frequency: 'none' }, type: 'TASK', projectId: 'proj-1' },
        ],
      },
      {
        id: 'col-2',
        title: 'In Progress',
        cards: [
          { id: 'card-3', title: 'Develop Kanban Board UI', description: 'Build the draggable Kanban interface.', tags: ['frontend', 'ui'], assignedUserIds: ['user-1', 'user-3'], color: 'bg-card', linkedNodeId: 'node_0', dueDate: '2025-05-20', estimatedTime: 16, actualTime: 4, isArchived: false, reminderSettings: { frequency: 'none' }, type: 'FEATURE', projectId: 'proj-2' },
        ],
      },
      {
        id: 'col-3',
        title: 'Done',
        cards: [
          { id: 'card-4', title: 'Setup Project Structure', description: 'Initialize Vite, React, Tailwind.', tags: ['setup'], assignedUserIds: ['user-1'], color: 'bg-green-100 dark:bg-green-900/30', linkedNodeId: null, dueDate: '2025-05-01', estimatedTime: 4, actualTime: 4, isArchived: true, reminderSettings: { frequency: 'none' }, type: 'BUG', projectId: 'proj-1' },
        ],
      },
    ];

    export const initialUsers = [
       { id: 'user-1', name: 'Alice', avatarUrl: 'https://ui.shadcn.com/avatars/01.png' },
       { id: 'user-2', name: 'Bob', avatarUrl: 'https://ui.shadcn.com/avatars/02.png' },
       { id: 'user-3', name: 'Charlie', avatarUrl: 'https://ui.shadcn.com/avatars/03.png' },
    ];

    // Derive initial tags from the initial data
    const allTags = initialKanbanData.flatMap(col => col.cards.flatMap(card => card.tags || []));
    export const initialTags = [...new Set(allTags)];
  