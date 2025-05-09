
    import React, { useState } from 'react';
    import { Label } from "@/components/ui/label";
    import { Input } from "@/components/ui/input";
    import { Button } from "@/components/ui/button";
    import { Trash2, Plus, Tags } from 'lucide-react';

    const KanbanPresetSettings = ({
      kanbanTypes, updateKanbanTypes,
      kanbanTags, updateKanbanTags
    }) => {
      const [currentTypes, setCurrentTypes] = useState(kanbanTypes);
      const [newKanbanType, setNewKanbanType] = useState('');
      const [currentTags, setCurrentTags] = useState(kanbanTags);
      const [newKanbanTag, setNewKanbanTag] = useState('');

      const handleAddKanbanType = () => {
          const typeToAdd = newKanbanType.trim().toUpperCase();
          if (typeToAdd && !currentTypes.includes(typeToAdd)) {
              const updatedTypes = [...currentTypes, typeToAdd];
              setCurrentTypes(updatedTypes);
              updateKanbanTypes(updatedTypes); // Save change
              setNewKanbanType('');
          }
      };
      const handleDeleteKanbanType = (typeToDelete) => {
          const updatedTypes = currentTypes.filter(t => t !== typeToDelete);
          setCurrentTypes(updatedTypes);
          updateKanbanTypes(updatedTypes); // Save change
      };

      const handleAddKanbanTag = () => {
           const tagToAdd = newKanbanTag.trim();
           if (tagToAdd && !currentTags.includes(tagToAdd)) {
               const updatedTags = [...currentTags, tagToAdd];
               setCurrentTags(updatedTags);
               updateKanbanTags(updatedTags); // Save change
               setNewKanbanTag('');
           }
      };
      const handleDeleteKanbanTag = (tagToDelete) => {
           const updatedTags = currentTags.filter(t => t !== tagToDelete);
           setCurrentTags(updatedTags);
           updateKanbanTags(updatedTags); // Save change
      };

      return (
        <div className="border rounded-md p-4 space-y-4 bg-background/50">
          <h3 className="font-medium flex items-center gap-2"><Tags className="h-4 w-4 text-primary"/> Kanban Settings</h3>
          {/* Card Types */}
          <div>
             <Label className="text-sm font-medium">Card Types</Label>
             <div className="flex flex-wrap gap-2 mt-2">
                 {currentTypes.map(type => (
                    <div key={type} className="flex items-center gap-1 bg-muted px-2 py-0.5 rounded text-xs">
                       {type}
                       <Button variant="ghost" size="icon" className="h-4 w-4 ml-1" onClick={() => handleDeleteKanbanType(type)}> <Trash2 className="h-3 w-3 text-destructive"/> </Button>
                    </div>
                 ))}
             </div>
             <div className="flex gap-2 mt-2">
                 <Input value={newKanbanType} onChange={e => setNewKanbanType(e.target.value)} placeholder="New type (e.g., UI_REVIEW)" className="h-8 text-xs flex-grow" />
                 <Button size="sm" className="text-xs h-8 px-3" onClick={handleAddKanbanType}><Plus className="h-4 w-4 mr-1"/>Add Type</Button>
             </div>
          </div>
          {/* Tags */}
           <div>
             <Label className="text-sm font-medium">Available Tags</Label>
             <div className="flex flex-wrap gap-2 mt-2">
                 {currentTags.map(tag => (
                    <div key={tag} className="flex items-center gap-1 bg-muted px-2 py-0.5 rounded text-xs">
                       {tag}
                       <Button variant="ghost" size="icon" className="h-4 w-4 ml-1" onClick={() => handleDeleteKanbanTag(tag)}> <Trash2 className="h-3 w-3 text-destructive"/> </Button>
                    </div>
                 ))}
             </div>
             <div className="flex gap-2 mt-2">
                 <Input value={newKanbanTag} onChange={e => setNewKanbanTag(e.target.value)} placeholder="New tag (e.g., Mobile)" className="h-8 text-xs flex-grow" />
                 <Button size="sm" className="text-xs h-8 px-3" onClick={handleAddKanbanTag}><Plus className="h-4 w-4 mr-1"/>Add Tag</Button>
             </div>
           </div>
           {/* Add placeholders for Epic/Product names here */}
        </div>
      );
    };

    export default KanbanPresetSettings;
  