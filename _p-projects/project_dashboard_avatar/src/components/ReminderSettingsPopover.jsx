
    import React, { useState, useEffect } from 'react';
    import { Button } from "@/components/ui/button";
    import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
    import { Label } from "@/components/ui/label";
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import { BellRing } from 'lucide-react';
    import useAppSettings from '@/hooks/useAppSettings'; // Import settings hook

    const reminderFrequencies = [
      { value: 'none', label: 'None' },
      { value: 'day_before', label: '1 Day Before' },
      { value: 'hour_before', label: '1 Hour Before' },
      { value: 'on_due_date', label: 'On Due Date' },
      { value: 'daily', label: 'Daily (if overdue)' },
    ];

    const ReminderSettingsPopover = ({ cardId, columnId, currentSettings, onSetReminder, trigger }) => {
      const { getReminderDefault } = useAppSettings();
      const defaultReminder = getReminderDefault();

      const [isOpen, setIsOpen] = useState(false);
      const [frequency, setFrequency] = useState('none');

      useEffect(() => {
        // Sync with current settings OR default from settings when popover opens
        if (isOpen) {
          setFrequency(currentSettings?.frequency || defaultReminder || 'none');
        }
      }, [currentSettings, isOpen, defaultReminder]);

      const handleSave = () => {
        if (onSetReminder) {
          onSetReminder(columnId, cardId, { frequency });
        }
        setIsOpen(false);
      };

      return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>{trigger}</PopoverTrigger>
          <PopoverContent className="w-60 p-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none flex items-center gap-1"><BellRing className="h-4 w-4"/> Reminder</h4>
                <p className="text-sm text-muted-foreground">
                  Set reminder frequency for this task. (Mock)
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reminder-frequency">Frequency</Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger id="reminder-frequency" className="w-full">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {reminderFrequencies.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button size="sm" onClick={handleSave}>Save</Button>
            </div>
          </PopoverContent>
        </Popover>
      );
    };

    export default ReminderSettingsPopover;
  