
    import React, { useState, useEffect } from 'react';
    import { Button } from "@/components/ui/button";
    import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
    import { Calendar } from "@/components/ui/calendar";
    import { Calendar as CalendarIcon } from 'lucide-react';
    import { cn } from "@/lib/utils";
    import { format, isValid, parseISO } from "date-fns";

    const SprintInfoDialog = ({ isOpen, onOpenChange, currentInfo, onSave }) => {
        const [name, setName] = useState('');
        const [startDate, setStartDate] = useState(null);
        const [endDate, setEndDate] = useState(null);

        useEffect(() => {
            if (isOpen && currentInfo) {
                setName(currentInfo.name || '');
                const parsedStart = currentInfo.startDate ? parseISO(currentInfo.startDate) : null;
                setStartDate(parsedStart && isValid(parsedStart) ? parsedStart : null);
                const parsedEnd = currentInfo.endDate ? parseISO(currentInfo.endDate) : null;
                setEndDate(parsedEnd && isValid(parsedEnd) ? parsedEnd : null);
            }
        }, [isOpen, currentInfo]);

        const handleSave = () => {
            onSave({
                name: name.trim() || 'Unnamed Sprint',
                startDate: startDate && isValid(startDate) ? format(startDate, 'yyyy-MM-dd') : null,
                endDate: endDate && isValid(endDate) ? format(endDate, 'yyyy-MM-dd') : null,
            });
        };

        return (
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Sprint Information</DialogTitle>
                        <DialogDescription>Update the name and dates for the current sprint view.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="sprint-name" className="text-right">Name</Label>
                            <Input id="sprint-name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" placeholder="Sprint Name" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="start-date" className="text-right">Start Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant={"outline"} id="start-date" className={cn("col-span-3 justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {startDate && isValid(startDate) ? format(startDate, "PPP") : <span>Pick start date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="end-date" className="text-right">End Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant={"outline"} id="end-date" className={cn("col-span-3 justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {endDate && isValid(endDate) ? format(endDate, "PPP") : <span>Pick end date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" onClick={handleSave}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    };

    export default SprintInfoDialog;
  