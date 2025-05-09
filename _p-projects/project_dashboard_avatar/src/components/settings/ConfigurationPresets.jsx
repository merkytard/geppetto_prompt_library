
    import React, { useState } from 'react';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
    import { Button } from "@/components/ui/button";
    import { Settings as SettingsIcon, Copy, Edit } from 'lucide-react';
    import useAppSettings from '@/hooks/useAppSettings';
    import KanbanPresetSettings from '@/components/settings/presets/KanbanPresetSettings';
    import CalendarPresetSettings from '@/components/settings/presets/CalendarPresetSettings';
    import ReminderPresetSettings from '@/components/settings/presets/ReminderPresetSettings';
    import SprintPresetSettings from '@/components/settings/presets/SprintPresetSettings'; // Import new component

    const ConfigurationPresets = () => {
      const [selectedProjectId, setSelectedProjectId] = useState('global'); // 'global' or project ID (Simulated)

      // Use the App Settings hook - context depends on selectedProjectId
      const {
         getKanbanCardTypes, updateKanbanCardTypes,
         getKanbanTags, updateKanbanTags,
         getCalendarEventColors, updateCalendarEventColors,
         getReminderDefault, updateReminderDefault,
         getSprintPresets, addSprintPreset, deleteSprintPreset, updateSprintPresets, // Add sprint preset functions
      } = useAppSettings(selectedProjectId === 'global' ? null : selectedProjectId);

      // Mock handlers for preset management
      const handleDuplicatePreset = () => {
          alert("Mock Duplicate: This would create a copy of the current preset configuration.");
      };

      const handleRenamePreset = () => {
          const newName = prompt("Enter new name for this preset:", "Global Preset");
          if (newName) {
              alert(`Mock Rename: Preset renamed to "${newName}".`);
          }
      };

      return (
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex justify-between items-center border-b pb-2">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5" /> Configuration Preset: Global {/* Placeholder Name */}
                </CardTitle>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleRenamePreset}><Edit className="h-4 w-4 mr-1"/> Rename</Button>
                    <Button variant="outline" size="sm" onClick={handleDuplicatePreset}><Copy className="h-4 w-4 mr-1"/> Duplicate</Button>
                </div>
            </div>
            <CardDescription className="pt-2">Define global or project-specific settings. (Project-specific settings are currently simulated)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
              {/* Context Selector (Simulated - commented out for now) */}
              {/* <div className="flex items-center gap-2"> ... </div> */}

              <KanbanPresetSettings
                  kanbanTypes={getKanbanCardTypes()}
                  updateKanbanTypes={updateKanbanCardTypes}
                  kanbanTags={getKanbanTags()}
                  updateKanbanTags={updateKanbanTags}
              />
              <CalendarPresetSettings
                  calendarColors={getCalendarEventColors()}
                  updateCalendarColors={updateCalendarEventColors}
              />
              <ReminderPresetSettings
                  reminderDefault={getReminderDefault()}
                  updateReminderDefault={updateReminderDefault}
              />
              {/* Add Sprint Settings */}
              <SprintPresetSettings
                  sprintPresets={getSprintPresets()}
                  onAddPreset={addSprintPreset}
                  onDeletePreset={deleteSprintPreset}
                  onUpdatePresets={updateSprintPresets} // Pass update function if needed for reordering etc.
              />
          </CardContent>
        </Card>
      );
    };

    export default ConfigurationPresets;
  