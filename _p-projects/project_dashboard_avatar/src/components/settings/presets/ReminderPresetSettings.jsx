
    import React, { useState } from 'react';
    import { Label } from "@/components/ui/label";
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import { BellDot } from 'lucide-react';

    const reminderFrequencies = [
      { value: 'none', label: 'None' },
      { value: 'day_before', label: '1 Day Before' },
      { value: 'hour_before', label: '1 Hour Before' },
      { value: 'on_due_date', label: 'On Due Date' },
      { value: 'daily', label: 'Daily (if overdue)' },
    ];

    const ReminderPresetSettings = ({ reminderDefault, updateReminderDefault }) => {
      const [currentDefault, setCurrentDefault] = useState(reminderDefault);

      const handleReminderDefaultChange = (value) => {
           setCurrentDefault(value);
           updateReminderDefault(value); // Save change
       };

      return (
        <div className="border rounded-md p-4 space-y-4 bg-background/50">
           <h3 className="font-medium flex items-center gap-2"><BellDot className="h-4 w-4 text-primary"/> Reminder Defaults</h3>
           <div className="flex items-center gap-2">
               <Label htmlFor="reminder-default" className="text-sm">Default Frequency:</Label>
               <Select value={currentDefault} onValueChange={handleReminderDefaultChange}>
                   <SelectTrigger id="reminder-default" className="w-[180px] h-8 text-xs"> <SelectValue placeholder="Select default" /> </SelectTrigger>
                   <SelectContent> {reminderFrequencies.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)} </SelectContent>
               </Select>
           </div>
        </div>
      );
    };

    export default ReminderPresetSettings;
  