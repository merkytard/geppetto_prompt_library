
    import usePersistentState from './usePersistentState';

    export const defaultSettings = {
        global: {
            kanbanCardTypes: ['TASK', 'BUG', 'FEATURE', 'STORY', 'EPIC'],
            kanbanTags: ['UI', 'UX', 'Backend', 'Frontend', 'Testing', 'Docs', 'Urgent', 'High Priority', 'Low Priority'],
            calendarEventColors: {
                task: 'bg-destructive', 
                meeting: 'bg-red-500',
                milestone: 'bg-blue-500',
                sprint_start: 'bg-yellow-500',
                private: 'bg-purple-500',
            },
            reminderDefault: 'none',
            sprintPresets: [ 
                { id: 'preset-1', name: 'Default 2 Weeks', durationDays: 14, namingConvention: 'Sprint {YYYY}-{MM}-{DD}' }
            ],
            epicNamingConvention: "Epic: {description}",
            productAbbreviations: [{ name: "Core Product", abbr: "CORE" }],
        },
        projectSpecific: {},
    };

    const useAppSettings = (projectId = null) => {
        const [settings, setSettings] = usePersistentState('appSettings', defaultSettings);

        const getSetting = (key, type = 'global') => {
            if (projectId && type === 'project' && settings.projectSpecific[projectId]?.[key] !== undefined) {
                return settings.projectSpecific[projectId][key];
            }
            return settings.global?.[key] ?? defaultSettings.global[key];
        };

        const updateGlobalSetting = (key, value) => {
            setSettings(prev => ({
                ...prev,
                global: {
                    ...(prev.global || defaultSettings.global), 
                    [key]: value,
                },
            }));
        };

        const updateProjectSetting = (projId, key, value) => {
             if (!projId) return; 
            setSettings(prev => ({
                ...prev,
                projectSpecific: {
                    ...prev.projectSpecific,
                    [projId]: {
                        ...(prev.projectSpecific[projId] || {}),
                        [key]: value,
                    },
                },
            }));
        };

        const getKanbanCardTypes = () => getSetting('kanbanCardTypes', 'global');
        const updateKanbanCardTypes = (newTypes) => updateGlobalSetting('kanbanCardTypes', newTypes);

        const getKanbanTags = () => getSetting('kanbanTags', 'global');
        const updateKanbanTags = (newTags) => updateGlobalSetting('kanbanTags', newTags);

        const getCalendarEventColors = () => getSetting('calendarEventColors', 'global');
        const updateCalendarEventColors = (newColors) => updateGlobalSetting('calendarEventColors', newColors);

        const getReminderDefault = () => getSetting('reminderDefault', 'global');
        const updateReminderDefault = (newDefault) => updateGlobalSetting('reminderDefault', newDefault);

        const getSprintPresets = () => getSetting('sprintPresets', 'global');
        const updateSprintPresets = (newPresets) => updateGlobalSetting('sprintPresets', newPresets);
        const addSprintPreset = (preset) => {
            const newId = `preset-${Date.now()}`;
            updateSprintPresets([...getSprintPresets(), { ...preset, id: newId }]);
        };
        const deleteSprintPreset = (presetId) => {
            updateSprintPresets(getSprintPresets().filter(p => p.id !== presetId));
        };

        const getProjectSpecificSetting = (key) => {
            if (!projectId) return null;
            return getSetting(key, 'project');
        }
        const updateCurrentProjectSetting = (key, value) => {
            if (!projectId) {
                console.warn("Cannot update project setting without a current project ID context.");
                return;
            }
            updateProjectSetting(projectId, key, value);
        }


        return {
            settings, 
            getSetting,
            updateGlobalSetting,
            updateProjectSetting,

            getKanbanCardTypes,
            updateKanbanCardTypes,
            getKanbanTags,
            updateKanbanTags,
            getCalendarEventColors,
            updateCalendarEventColors,
            getReminderDefault,
            updateReminderDefault,
            getSprintPresets,
            updateSprintPresets,
            addSprintPreset,
            deleteSprintPreset,

            getProjectSpecificSetting,
            updateCurrentProjectSetting,
        };
    };

    export default useAppSettings;
  