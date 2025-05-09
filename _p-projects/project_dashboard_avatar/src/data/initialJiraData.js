
    export const initialProjectsData = [
      { id: 'jira-proj-1', name: 'Phoenix Initiative', description: 'Core platform development for next-gen features.', icon: 'Flame', color: 'bg-red-500' },
      { id: 'jira-proj-2', name: 'Odyssey Mobile App', description: 'Cross-platform mobile application development.', icon: 'Smartphone', color: 'bg-blue-500' },
      { id: 'jira-proj-3', name: 'Quantum Leap AI', description: 'Research and development for AI integration.', icon: 'Brain', color: 'bg-purple-500' },
    ];
    
    export const initialUsersData = [
      { id: 'user-1', name: 'Alice Wonderland', avatarUrl: 'https://i.pravatar.cc/150?u=alice' },
      { id: 'user-2', name: 'Bob The Builder', avatarUrl: 'https://i.pravatar.cc/150?u=bob' },
      { id: 'user-3', name: 'Charlie Chaplin', avatarUrl: 'https://i.pravatar.cc/150?u=charlie' },
      { id: 'user-4', name: 'Diana Prince', avatarUrl: 'https://i.pravatar.cc/150?u=diana' },
    ];
    
    export const initialTagsData = [
      { id: 'tag-1', name: 'Frontend', color: 'bg-sky-500' },
      { id: 'tag-2', name: 'Backend', color: 'bg-amber-500' },
      { id: 'tag-3', name: 'UI/UX', color: 'bg-rose-500' },
      { id: 'tag-4', name: 'Bug', color: 'bg-red-600' },
      { id: 'tag-5', name: 'Feature', color: 'bg-green-500' },
      { id: 'tag-6', name: 'Documentation', color: 'bg-gray-500' },
    ];
    
    export const initialColumnsData = [
      {
        id: 'col-jira-1',
        title: 'To Do',
        cards: [
          { id: 'task-jira-1', title: 'Setup Jira board structure', description: 'Define columns, workflows, and issue types.', assignedUserIds: ['user-1'], tags: ['Setup', 'Backend'], priority: 'High', dueDate: '2025-05-10', projectId: 'jira-proj-1', type: 'TASK', color: 'bg-card' },
          { id: 'task-jira-2', title: 'Design user authentication flow', description: 'Create wireframes and mockups for login and registration.', assignedUserIds: ['user-3'], tags: ['UI/UX', 'Frontend'], priority: 'Medium', dueDate: '2025-05-12', projectId: 'jira-proj-2', type: 'TASK', color: 'bg-card' },
        ],
      },
      {
        id: 'col-jira-2',
        title: 'In Progress',
        cards: [
          { id: 'task-jira-3', title: 'Develop API endpoints for user profiles', description: 'Implement CRUD operations for user data.', assignedUserIds: ['user-2'], tags: ['Backend', 'API'], priority: 'High', dueDate: '2025-05-15', projectId: 'jira-proj-1', type: 'TASK', color: 'bg-card' },
        ],
      },
      {
        id: 'col-jira-3',
        title: 'In Review',
        cards: [
          { id: 'task-jira-4', title: 'Code review for authentication module', description: 'Check for security vulnerabilities and best practices.', assignedUserIds: ['user-4'], tags: ['Backend', 'Security'], priority: 'Medium', dueDate: '2025-05-18', projectId: 'jira-proj-1', type: 'TASK', color: 'bg-card' },
        ],
      },
      {
        id: 'col-jira-4',
        title: 'Done',
        cards: [
          { id: 'task-jira-5', title: 'Write project proposal document', description: 'Outline project scope, goals, and timeline.', assignedUserIds: ['user-1'], tags: ['Documentation'], priority: 'Low', dueDate: '2025-05-01', projectId: 'jira-proj-3', type: 'TASK', status: 'COMPLETED', color: 'bg-card' },
        ],
      },
    ];
    
    export const initialMilestonesData = [
        { 
            id: 'ms-jira-1', 
            name: 'Alpha Release', 
            description: 'Core features implemented and ready for internal testing.', 
            dueDate: '2025-06-15', 
            projectId: 'jira-proj-1', 
            status: 'IN_PROGRESS', 
            progress: 40,
            goals: [
                { text: "User Authentication Complete", completed: true },
                { text: "Profile Management Implemented", completed: false },
                { text: "Basic API Endpoints Live", completed: true },
            ]
        },
        { 
            id: 'ms-jira-2', 
            name: 'Mobile App Beta', 
            description: 'First beta version for Android and iOS.', 
            dueDate: '2025-07-20', 
            projectId: 'jira-proj-2', 
            status: 'IN_PROGRESS', 
            progress: 15,
            goals: [
                { text: "iOS Build Successful", completed: false },
                { text: "Android Build Successful", completed: false },
                { text: "Key UI Screens Implemented", completed: true },
            ]
        },
    ];

    export { initialProjectsData as initialJiraProjects };
    export { initialUsersData as initialJiraUsers };
    export { initialTagsData as initialJiraTags };
    export { initialColumnsData as initialJiraColumns };
    export { initialMilestonesData as initialJiraMilestones };
  