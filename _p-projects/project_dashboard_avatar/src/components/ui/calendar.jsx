
    import * as React from "react";
    import { ChevronLeft, ChevronRight } from "lucide-react";
    import { DayPicker, useDayPicker, useNavigation } from "react-day-picker";
    import { cn } from "@/lib/utils";
    import { buttonVariants } from "@/components/ui/button";
    import useAppSettings from '@/hooks/useAppSettings';
    import { isSameDay, isValid } from 'date-fns';

    // Maximum number of glyphs to show per day
    const MAX_GLYPHS_PER_DAY = 4;

    function DayWithGlyphs(props) {
      const { date, displayMonth, onDayClick, calendarEvents = [] } = props; // Receive calendarEvents
      const { mode, classNames, styles, modifiers, modifierClassNames, modifierStyles } = useDayPicker();
      const { goToMonth } = useNavigation();
      const { getCalendarEventColors } = useAppSettings();
      const configuredColors = getCalendarEventColors();

      const eventGlyphColors = React.useMemo(() => ({
          task: configuredColors.task || 'bg-destructive',
          meeting: configuredColors.meeting || 'bg-red-500',
          milestone: configuredColors.milestone || 'bg-blue-500',
          sprint_start: configuredColors.sprint_start || 'bg-yellow-500',
          sprint_end: configuredColors.sprint_end || 'bg-yellow-600',
          private: configuredColors.private || 'bg-purple-500',
      }), [configuredColors]);

      // Find events specifically for this day
      const eventsOnThisDay = React.useMemo(() => {
          if (!date || !isValid(date)) return [];
          return calendarEvents.filter(event => event.date && isValid(event.date) && isSameDay(event.date, date));
      }, [date, calendarEvents]);

      // Get unique event types for this day, limited to MAX_GLYPHS_PER_DAY
      const uniqueEventTypes = React.useMemo(() => {
          const types = new Set(eventsOnThisDay.map(e => e.type));
          return Array.from(types).slice(0, MAX_GLYPHS_PER_DAY);
      }, [eventsOnThisDay]);

      // Generate glyphs based on the limited unique types
      const glyphs = uniqueEventTypes
        .filter(type => eventGlyphColors[type]) // Ensure color exists
        .map(type => (
          <span
            key={type}
            className={cn("inline-block h-1.5 w-1.5 rounded-full", eventGlyphColors[type])}
            title={type.replace('_', ' ')} // Add tooltip for type
          ></span>
      ));

      const handleClick = () => {
          // Only trigger onDayClick if the day is not outside the current month
          // and the onDayClick prop is provided.
          if (!modifiers.outside && onDayClick) {
              onDayClick(date);
          } else if (modifiers.outside && date) {
              // If an outside day is clicked, navigate to that month
              goToMonth(date);
              // Optionally, also select the day after navigation
              if (onDayClick) {
                 setTimeout(() => onDayClick(date), 0); // Allow navigation first
              }
          }
      };

      const dayContent = date ? date.getDate() : null;

      if (!dayContent) {
        return <div className="h-9 w-9 p-0"></div>;
      }

      // Determine button classes based on DayPicker's internal state (modifiers)
      const buttonClasses = cn(
        buttonVariants({ variant: 'ghost' }),
        'h-9 w-9 p-0 font-normal relative',
        modifiers.today && 'bg-accent text-accent-foreground',
        // Apply selected styles only if NOT an outside day OR if outside days are interactive
        modifiers.selected && !modifiers.outside && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        modifiers.outside && 'text-muted-foreground opacity-50',
        // Keep selected style for outside days if they are clickable/selectable
        // modifiers.selected && modifiers.outside && 'bg-accent/50 text-muted-foreground', // Example: different style for selected outside day
        modifiers.disabled && 'text-muted-foreground opacity-50',
        modifiers.range_start && 'day-range-start',
        modifiers.range_end && 'day-range-end',
        modifiers.range_middle && 'day-range-middle'
      );

      return (
        <button
          type="button"
          onClick={handleClick}
          className={buttonClasses}
          style={modifierStyles?.day} // Use modifierStyles if provided
          disabled={modifiers.disabled} // Disable based on DayPicker state
          aria-selected={modifiers.selected}
        >
          {dayContent}
          {glyphs.length > 0 && (
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-0.5">
              {glyphs}
            </div>
          )}
        </button>
      );
    }


    function Calendar({
      className,
      classNames,
      showOutsideDays = true,
      onDayClick, // Receive onDayClick to pass down
      calendarEvents, // Receive calendarEvents to pass down
      selected, // Receive selected state
      onSelect, // Receive onSelect handler
      ...props
    }) {
      return (
        <DayPicker
          showOutsideDays={showOutsideDays}
          className={cn("p-3", className)}
          classNames={{
            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "space-y-4",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: "text-sm font-medium",
            nav: "space-x-1 flex items-center",
            nav_button: cn(
              buttonVariants({ variant: "outline" }),
              "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
            ),
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell:
              "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
            row: "flex w-full mt-2",
            // Base cell styling - DayWithGlyphs will handle specific day states
            cell: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
            // Remove DayPicker's default day styles, let DayWithGlyphs handle them
            day: "", // Override default day class
            day_selected: "", // Override default selected class
            day_today: "", // Override default today class
            day_outside: "", // Override default outside class
            day_disabled: "", // Override default disabled class
            day_range_middle: "", // Override default range middle class
            day_hidden: "invisible",
            ...classNames,
          }}
          components={{
            IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
            IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
            // Pass necessary props to the custom Day component
            Day: (dayProps) => <DayWithGlyphs {...dayProps} onDayClick={onDayClick} calendarEvents={calendarEvents} />,
          }}
          // Pass selection handlers and state to DayPicker
          selected={selected}
          onSelect={onSelect}
          onDayClick={onDayClick} // Also pass onDayClick here if DayPicker needs it directly (might be redundant)
          {...props} />
      );
    }
    Calendar.displayName = "Calendar";

    export { Calendar };
  