
    import React, { useState, useMemo, useCallback } from 'react';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent } from "@/components/ui/card";
    import { ScrollArea } from '@/components/ui/scroll-area';
    import { Calendar } from "@/components/ui/calendar";
    import { cn } from '@/lib/utils';
    import { isSameDay, parseISO, isValid } from 'date-fns';
    import { Briefcase, User as UserIcon, Plus, Circle, Square, AlertTriangle, Flag, Play, Bell, CalendarCheck2 } from 'lucide-react';
    import AddCalendarEventDialog from '@/components/jira/AddCalendarEventDialog';
    import ReminderSettingsPopover from '@/components/ReminderSettingsPopover'; 
    import useAppSettings from '@/hooks/useAppSettings';
    import usePersistentState from '@/hooks/usePersistentState';
    import { useToast } from "@/components/ui/use-toast"; 
    import { motion, AnimatePresence } from 'framer-motion';

    const defaultEventTypesConfig = {
        task: { label: 'Task Deadline', colorClass: 'bg-destructive', icon: <AlertTriangle className="h-3 w-3" /> },
        meeting: { label: 'Meeting', colorClass: 'bg-red-500', icon: <Circle className="h-3 w-3" /> },
        milestone: { label: 'Milestone Due', colorClass: 'bg-blue-500', icon: <Square className="h-3 w-3" /> },
        sprint_start: { label: 'Sprint Start', colorClass: 'bg-yellow-500', icon: <Play className="h-3 w-3" /> },
        sprint_end: { label: 'Sprint End', colorClass: 'bg-yellow-600', icon: <Flag className="h-3 w-3" /> },
        private: { label: 'Private', colorClass: 'bg-purple-500', icon: <UserIcon className="h-3 w-3" /> },
    };

    const JiraCalendarView = ({ allCards, milestones, selectedProjectId, setReminderForCard }) => { 
        const [calendarDate, setCalendarDate] = useState(new Date());
        const [calendarFilter, setCalendarFilter] = useState('all');
        const [isAddEventDialogOpen, setIsAddEventDialogOpen] = useState(false);
        const [addEventInitialDate, setAddEventInitialDate] = useState(new Date());
        const { getCalendarEventColors } = useAppSettings();
        const { toast } = useToast(); 

        const [sprintInfo] = usePersistentState('kanbanSprintInfo', {
            name: 'Current Sprint', startDate: null, endDate: null,
        });

        const configuredColors = getCalendarEventColors();

        const eventTypes = useMemo(() => {
            const combined = {};
            const baseConfig = { ...defaultEventTypesConfig };
             if (!configuredColors.sprint_end && !baseConfig.sprint_end) {
                baseConfig.sprint_end = { label: 'Sprint End', colorClass: 'bg-yellow-600', icon: <Flag className="h-3 w-3" /> };
             }
            for (const type in baseConfig) {
                combined[type] = { ...baseConfig[type], colorClass: configuredColors[type] || baseConfig[type].colorClass };
            }
            for (const type in configuredColors) {
                 if (!combined[type]) { combined[type] = { label: type, colorClass: configuredColors[type], icon: <CalendarCheck2 className="h-3 w-3" /> }; }
            }
            return combined;
        }, [configuredColors]);

        const [mockMeetings, setMockMeetings] = usePersistentState('mockCalendarMeetings', [
             { id: 'meet-1', date: new Date(2025, 4, 10), title: 'Daily Standup', type: 'meeting', reminder: null },
             { id: 'meet-2', date: new Date(2025, 4, 15), title: 'Sprint Planning', type: 'meeting', reminder: null },
        ]);

        const calendarEvents = useMemo(() => {
            const safeAllCards = Array.isArray(allCards) ? allCards : [];
            const safeMilestones = Array.isArray(milestones) ? milestones : [];

            const relevantCards = (selectedProjectId === 'all') ? safeAllCards : safeAllCards.filter(c => c.projectId === selectedProjectId);
            const relevantMilestones = (selectedProjectId === 'all') ? safeMilestones : safeMilestones.filter(m => m.projectId === selectedProjectId);

            const taskEvents = relevantCards.filter(card => card.dueDate).map(card => {
                const date = parseISO(card.dueDate); const type = card.eventType === 'private' ? 'private' : 'task';
                return isValid(date) ? { id: card.id, date, title: card.title, type, eventClass: eventTypes[type]?.label || type, columnId: card.columnId, reminder: card.reminder } : null; 
            }).filter(Boolean);

            const milestoneEvents = relevantMilestones.filter(ms => ms.dueDate).map(ms => {
                 const date = parseISO(ms.dueDate);
                 return isValid(date) ? { id: ms.id, date, title: ms.name, type: 'milestone', eventClass: eventTypes.milestone?.label || 'milestone', reminder: null } : null;
            }).filter(Boolean);

             const meetingEvents = mockMeetings.map(e => ({ ...e, date: e.date instanceof Date ? e.date : parseISO(e.date), eventClass: eventTypes.meeting?.label || 'meeting' })).filter(e => isValid(e.date)); 

             const sprintEvents = [];
             if (sprintInfo.startDate) { const startDate = parseISO(sprintInfo.startDate); if (isValid(startDate)) { sprintEvents.push({ id: 'sprint-start', date: startDate, title: `${sprintInfo.name} Starts`, type: 'sprint_start', eventClass: eventTypes.sprint_start?.label || 'sprint_start', reminder: null }); } }
             if (sprintInfo.endDate) { const endDate = parseISO(sprintInfo.endDate); if (isValid(endDate)) { sprintEvents.push({ id: 'sprint-end', date: endDate, title: `${sprintInfo.name} Ends`, type: 'sprint_end', eventClass: eventTypes.sprint_end?.label || 'sprint_end', reminder: null }); } }

            return [...taskEvents, ...milestoneEvents, ...meetingEvents, ...sprintEvents];
        }, [allCards, milestones, selectedProjectId, mockMeetings, eventTypes, sprintInfo]);

        const calendarModifiers = useMemo(() => {
            const modifiers = { today: new Date() };
            if (!calendarEvents) return modifiers; 
            Object.keys(eventTypes).forEach(type => {
                modifiers[type] = calendarEvents
                    .filter(e => e.type === type && e.date && isValid(e.date))
                    .map(e => e.date);
            });
            return modifiers;
        }, [calendarEvents, eventTypes]);

        const eventsForSelectedDate = useMemo(() => {
            if (!calendarDate || !isValid(calendarDate) || !calendarEvents) return [];
            return calendarEvents.filter(event => {
                const isDateMatch = event.date && isValid(event.date) && isSameDay(event.date, calendarDate);
                if (!isDateMatch) return false;
                if (calendarFilter === 'all') return true;
                if (calendarFilter === 'private' && event.type === 'private') return true;
                if (calendarFilter === 'work' && event.type !== 'private') return true;
                return false;
            }).sort((a,b) => (a.date || new Date(0)) - (b.date || new Date(0))); // Sort by date
        }, [calendarEvents, calendarDate, calendarFilter]);

        const formattedCalendarDate = calendarDate && isValid(calendarDate) ? calendarDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Invalid Date';

        const handleAddEvent = (eventData) => {
            const newMeeting = {
                id: `meet-${Date.now()}`, date: eventData.date, title: eventData.title, type: eventData.type, reminder: null,
            };
            setMockMeetings(prev => [...prev, newMeeting]);
            toast({ title: "Event Added", description: `Added "${eventData.title}" to the calendar.` });
        };

        const handleDayClick = useCallback((day) => {
            if (day && isValid(day)) setCalendarDate(day); 
        }, []);

        const handleOpenAddDialog = () => {
            setAddEventInitialDate(calendarDate || new Date()); 
            setIsAddEventDialogOpen(true);
        };

        const handleSetReminder = (eventId, eventType, columnId, settings) => {
             const eventTitle = calendarEvents?.find(e => e.id === eventId)?.title || eventType;
            if (eventType === 'task' && columnId && setReminderForCard) {
                setReminderForCard(columnId, eventId, settings); 
                toast({ title: "Reminder Set", description: `Reminder set for task "${eventTitle}".` });
            } else if (eventType === 'meeting') {
                setMockMeetings(prev => prev.map(m => m.id === eventId ? { ...m, reminder: settings } : m));
                toast({ title: "Reminder Set", description: `Reminder set for meeting "${eventTitle}".` });
            } else {
                toast({ title: "Reminder Set", description: `Reminder set for ${eventTitle}.` });
            }
        };
        
        const eventItemVariants = {
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
            exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
        };

        return (
            <>
                <Card className="h-full flex flex-col md:flex-row shadow-lg border-primary/10">
                    <CardContent className="pt-6 flex-grow flex flex-col md:flex-row gap-4 md:gap-6">
                        <div className="flex flex-col items-center">
                            <Calendar
                                mode="single" selected={calendarDate} onSelect={setCalendarDate} onDayClick={handleDayClick} 
                                className="rounded-md border shadow-sm"
                                modifiers={calendarModifiers} 
                                calendarEvents={calendarEvents || []} 
                                classNames={{
                                    day_today: "bg-accent/80 text-accent-foreground animate-pulse-fast",
                                    day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                                }}
                            />
                            <div className="mt-4 w-full max-w-[280px]">
                                <div className="flex gap-2 mb-3 justify-center">
                                    <Button variant={calendarFilter === 'all' ? 'secondary' : 'outline'} size="sm" className="flex-1" onClick={() => setCalendarFilter('all')}>All</Button>
                                    <Button variant={calendarFilter === 'work' ? 'secondary' : 'outline'} size="sm" className="flex-1" onClick={() => setCalendarFilter('work')}><Briefcase className="h-3.5 w-3.5 mr-1" />Work</Button>
                                    <Button variant={calendarFilter === 'private' ? 'secondary' : 'outline'} size="sm" className="flex-1" onClick={() => setCalendarFilter('private')}><UserIcon className="h-3.5 w-3.5 mr-1" />Private</Button>
                                </div>
                                <div className="text-xs space-y-1 border-t pt-2">
                                   <h4 className="font-medium mb-1 text-center">Legend</h4>
                                   {Object.entries(eventTypes).map(([type, config]) => (
                                        <div key={type} className="flex items-center gap-1.5 text-muted-foreground">
                                             <span className={cn("h-2.5 w-2.5 rounded-sm inline-block flex-shrink-0", config.colorClass)}></span>
                                             {config.icon && React.cloneElement(config.icon, { className: "h-3 w-3 mr-0.5"})}
                                             {config.label} {type === 'task' && '(Deadline)'}
                                         </div>
                                   ))}
                                </div>
                                <Button variant="outline" size="sm" className="w-full mt-3 gold-button" onClick={handleOpenAddDialog}>
                                     <Plus className="h-4 w-4 mr-1"/> Add Calendar Event
                                 </Button>
                            </div>
                        </div>

                        <div className="flex-grow border-t md:border-t-0 md:border-l pl-0 md:pl-6 pt-4 md:pt-0">
                            <h3 className="text-lg font-semibold mb-3">Events for: {formattedCalendarDate}</h3>
                            <ScrollArea className="h-[300px] md:h-[calc(100%-4rem)] pr-2"> {/* Adjust height */}
                                <AnimatePresence mode="popLayout">
                                {eventsForSelectedDate.length > 0 ? (
                                    <motion.div layout className="space-y-2">
                                        {eventsForSelectedDate.map(event => (
                                            <motion.div 
                                                key={`${event.id}-${event.type}`}
                                                layout
                                                variants={eventItemVariants}
                                                initial="initial"
                                                animate="animate"
                                                exit="exit"
                                                className="p-2 border rounded text-xs flex items-center gap-1.5 hover:bg-muted/50 transition-colors"
                                            >
                                                 <span className={cn("h-2.5 w-2.5 rounded-sm flex-shrink-0", eventTypes[event.type]?.colorClass || 'bg-gray-400')}></span>
                                                 {eventTypes[event.type]?.icon && React.cloneElement(eventTypes[event.type]?.icon, { className: "h-3.5 w-3.5 flex-shrink-0"})}
                                                 <span className="font-medium flex-grow truncate" title={event.title}>{event.title}</span>
                                                 <span className="text-muted-foreground text-[10px] mr-2 whitespace-nowrap">({event.eventClass})</span>
                                                 <ReminderSettingsPopover
                                                     cardId={event.id} columnId={event.columnId} currentSettings={event.reminder}
                                                     onSetReminder={(colId, cardId, settings) => handleSetReminder(cardId, event.type, colId, settings)}
                                                     trigger={
                                                         <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto flex-shrink-0 rounded-full">
                                                             <Bell className={cn("h-3.5 w-3.5", event.reminder?.frequency && event.reminder.frequency !== 'none' ? 'text-primary animate-pulse-slow' : 'text-muted-foreground')} />
                                                         </Button>
                                                     }
                                                 />
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                ) : (
                                    <motion.p 
                                        variants={eventItemVariants} initial="initial" animate="animate"
                                        className="text-sm text-muted-foreground text-center pt-4"
                                    >
                                        No '{calendarFilter}' events on this date.
                                    </motion.p>
                                )}
                                </AnimatePresence>
                            </ScrollArea>
                        </div>
                    </CardContent>
                </Card>
                 <AddCalendarEventDialog
                    isOpen={isAddEventDialogOpen} onOpenChange={setIsAddEventDialogOpen}
                    onAddEvent={handleAddEvent} initialDate={addEventInitialDate}
                 />
            </>
        );
    };

    export default JiraCalendarView;
  