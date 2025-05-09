
    import React, { useState, useEffect } from 'react';
    import { Button } from "@/components/ui/button";
    import {
      Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
    } from "@/components/ui/dialog";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
    import { Calendar as CalendarIcon } from 'lucide-react';
    import { Calendar } from "@/components/ui/calendar";
    import { cn } from "@/lib/utils";
    import { format, isValid } from "date-fns";

    const eventTypeOptions = [
        { value: 'meeting', label: 'Meeting' },
        { value: 'milestone', label: 'Milestone' },
        { value: 'task', label: 'Task (Kanban)' }, // For creating a linked task maybe?
        { value: 'private', label: 'Private Event' },
        { value: 'sprint_start', label: 'Sprint Start' },
    ];

    const AddCalendarEventDialog = ({ isOpen, onOpenChange, onAddEvent, initialDate }) => {
      const [title, setTitle] = useState('');
      const [eventType, setEventType] = useState('meeting');
      const [eventDate, setEventDate] = useState(null); // Store as Date object

      useEffect(() => {
        if (isOpen) {
            // Reset form when opening
            setTitle('');
            setEventType('meeting');
            // Set initial date from prop, ensuring it's a valid Date object
            setEventDate(initialDate instanceof Date && isValid(initialDate) ? initialDate : new Date());
        }
      }, [isOpen, initialDate]);

      const handleSave = () => {
        if (!title.trim() || !eventDate || !isValid(eventDate)) {
            // Add basic validation feedback if needed (e.g., toast)
            console.error("Invalid event data");
            return;
        }

        // Call the parent handler with the event data
        onAddEvent({
          title: title.trim(),
          type: eventType,
          date: eventDate, // Pass the Date object
        });

        onOpenChange(false); // Close the dialog
      };

      return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Calendar Event</DialogTitle>
              <DialogDescription>Add a new meeting, milestone, or other event to the calendar. (Mock)</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Event Title */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="event-title" className="text-right">Title</Label>
                <Input
                  id="event-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="col-span-3"
                  placeholder="Event Title"
                  autoFocus
                />
              </div>

              {/* Event Type */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="event-type" className="text-right">Type</Label>
                <Select value={eventType} onValueChange={setEventType}>
                  <SelectTrigger id="event-type" className="col-span-3">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypeOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Event Date */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="event-date" className="text-right">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      id="event-date"
                      className={cn(
                        "col-span-3 justify-start text-left font-normal",
                        !eventDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {eventDate && isValid(eventDate) ? format(eventDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={eventDate}
                      onSelect={setEventDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <DialogFooter>
               <Button type="button" variant="outline" onClick={() => onOpenChange(false)}> Cancel </Button>
               <Button type="button" onClick={handleSave}>Add Event</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    };

    export default AddCalendarEventDialog;
  