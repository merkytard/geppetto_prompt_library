
    import React, { useState } from 'react';
    import { Label } from "@/components/ui/label";
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import { Palette } from 'lucide-react';
    import { cn } from '@/lib/utils';

    const CalendarPresetSettings = ({ calendarColors, updateCalendarColors }) => {
      const [currentColors, setCurrentColors] = useState(calendarColors);

      // TODO: Fetch actual event types used in calendar dynamically if possible
      const calendarEventTypesForConfig = ['task', 'meeting', 'milestone', 'sprint_start', 'sprint_end', 'private'];
      // Basic color options - could be expanded
      const colorOptions = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-destructive', 'bg-yellow-600'];

      const handleCalendarColorChange = (eventType, colorClass) => {
          const updatedColors = { ...currentColors, [eventType]: colorClass };
          setCurrentColors(updatedColors);
          updateCalendarColors(updatedColors); // Save change
      };

      return (
        <div className="border rounded-md p-4 space-y-4 bg-background/50">
            <h3 className="font-medium flex items-center gap-2"><Palette className="h-4 w-4 text-primary"/> Calendar Event Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
               {calendarEventTypesForConfig.map(eventType => (
                   <div key={eventType} className="flex items-center gap-2">
                       <Label htmlFor={`color-${eventType}`} className="capitalize text-sm flex-shrink-0 w-20">{eventType.replace('_', ' ')}:</Label>
                       <Select value={currentColors[eventType] || 'bg-gray-500'} onValueChange={(value) => handleCalendarColorChange(eventType, value)}>
                           <SelectTrigger id={`color-${eventType}`} className="h-8 text-xs flex-grow">
                               <div className="flex items-center gap-1">
                                   <span className={cn("h-3 w-3 rounded-full inline-block", currentColors[eventType] || 'bg-gray-500')}></span>
                                   <SelectValue placeholder="Select color" />
                               </div>
                           </SelectTrigger>
                           <SelectContent>
                               {colorOptions.map(colorClass => (
                                   <SelectItem key={colorClass} value={colorClass}>
                                       <div className="flex items-center gap-2">
                                          <span className={cn("h-3 w-3 rounded-full", colorClass)}></span>
                                          {colorClass.replace('bg-', '').replace('-500', '').replace('-600', '')}
                                       </div>
                                   </SelectItem>
                               ))}
                           </SelectContent>
                       </Select>
                   </div>
               ))}
            </div>
       </div>
      );
    };

    export default CalendarPresetSettings;
  