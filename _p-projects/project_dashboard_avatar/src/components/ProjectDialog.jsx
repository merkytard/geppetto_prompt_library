
    import React, { useState, useEffect } from 'react';
    import { Button } from "@/components/ui/button";
    import {
      Dialog,
      DialogContent,
      DialogDescription,
      DialogFooter,
      DialogHeader,
      DialogTitle,
      // Removed DialogTrigger as open state is now controlled by prop
    } from "@/components/ui/dialog";
    import { Input } from "@/components/ui/input";
    import { Textarea } from "@/components/ui/textarea";
    import { Label } from "@/components/ui/label";
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import * as Icons from 'lucide-react';

    const availableIcons = [
      'Package', 'Briefcase', 'Folder', 'FileText', 'Code', 'Database', 'Server', 'Cloud', 'LayoutGrid', 'Settings', 'Users', 'Target', 'Rocket', 'Lightbulb', 'Activity', 'Award', 'Book', 'Box', 'Camera', 'Clipboard', 'Compass', 'Cpu', 'CreditCard', 'Disc', 'Droplet', 'Feather', 'Figma', 'Film', 'Flag', 'Gift', 'Globe', 'HardDrive', 'Heart', 'Home', 'Image', 'Inbox', 'Key', 'Layers', 'LifeBuoy', 'Lock', 'Map', 'Mic', 'Monitor', 'Moon', 'Music', 'Navigation', 'Paperclip', 'PenTool', 'Phone', 'PieChart', 'Printer', 'Save', 'Scissors', 'Shield', 'ShoppingBag', 'Smartphone', 'Speaker', 'Star', 'Sun', 'Tag', 'Thermometer', 'ThumbsUp', 'Tool', 'Trash', 'TrendingUp', 'Truck', 'Umbrella', 'Video', 'Voicemail', 'Watch', 'Wifi', 'Wind', 'Zap', 'ZoomIn', 'ZoomOut'
    ].sort(); // Keep the list extensive and sorted

    // Receive isOpen and onOpenChange props to control the dialog externally
    const ProjectDialog = ({ isOpen, onOpenChange, project, onSave, dialogTitle, dialogDescription, children }) => {
      // Removed internal isOpen state, now controlled by props

      const [name, setName] = useState('');
      const [description, setDescription] = useState('');
      const [selectedIcon, setSelectedIcon] = useState('Package');

      useEffect(() => {
        // Update internal state only when the dialog is open and project data changes
        if (isOpen) {
          if (project) {
            setName(project.name || '');
            setDescription(project.description || '');
            setSelectedIcon(project.icon || 'Package');
          } else {
            // Reset form for add mode
            setName('');
            setDescription('');
            setSelectedIcon('Package');
          }
        }
      }, [project, isOpen]); // Depend on isOpen and project

      const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
          onSave({ id: project?.id, name: name.trim(), description: description.trim(), icon: selectedIcon });
          // onOpenChange(false); // Let parent handle closing if needed after save
        }
      };

      const renderIcon = (iconName, props = {}) => {
        const IconComponent = Icons[iconName];
        return IconComponent ? <IconComponent {...props} /> : <Icons.Package {...props} />;
      };

      // Use the controlled Dialog component
      return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          {/* Allow triggering from outside if needed, but primarily controlled by props */}
          {/* <DialogTrigger asChild>{children}</DialogTrigger> */}
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{dialogTitle || (project ? 'Edit Project' : 'Create New Project')}</DialogTitle>
              {dialogDescription && <DialogDescription>{dialogDescription}</DialogDescription>}
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Project Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter project name" required autoFocus />
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="icon">Icon</Label>
                    <Select value={selectedIcon} onValueChange={setSelectedIcon}>
                      <SelectTrigger id="icon">
                        <div className="flex items-center gap-2"> {renderIcon(selectedIcon, { className: "h-4 w-4" })} <SelectValue placeholder="Select an icon" /> </div>
                      </SelectTrigger>
                      <SelectContent>
                        {availableIcons.map(iconName => (
                          <SelectItem key={iconName} value={iconName}>
                             <div className="flex items-center gap-2"> {renderIcon(iconName, { className: "h-4 w-4" })} <span>{iconName}</span> </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                 </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter project description (optional)" rows={3} />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}> Cancel </Button>
                <Button type="submit" className="gold-button">Save Project</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      );
    };

    export default ProjectDialog;
  