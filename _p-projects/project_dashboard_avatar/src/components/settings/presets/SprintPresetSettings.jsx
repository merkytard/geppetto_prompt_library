
    import React, { useState } from 'react';
    import { Label } from "@/components/ui/label";
    import { Input } from "@/components/ui/input";
    import { Button } from "@/components/ui/button";
    import { Trash2, Plus, CalendarClock } from 'lucide-react';
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
    import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

    const SprintPresetSettings = ({ sprintPresets, onAddPreset, onDeletePreset }) => {
      const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
      const [newPresetName, setNewPresetName] = useState('');
      const [newPresetDuration, setNewPresetDuration] = useState(14);
      const [newPresetNaming, setNewPresetNaming] = useState('Sprint {YYYY}-{MM}-{DD}');

      const handleAddConfirm = () => {
          if (newPresetName.trim() && newPresetDuration > 0) {
              onAddPreset({
                  name: newPresetName.trim(),
                  durationDays: newPresetDuration,
                  namingConvention: newPresetNaming.trim() || 'Sprint {YYYY}-{MM}-{DD}'
              });
              setIsAddDialogOpen(false);
              setNewPresetName('');
              setNewPresetDuration(14);
              setNewPresetNaming('Sprint {YYYY}-{MM}-{DD}');
          }
      };

      return (
        <div className="border rounded-md p-4 space-y-4 bg-background/50">
          <h3 className="font-medium flex items-center gap-2"><CalendarClock className="h-4 w-4 text-primary"/> Sprint Presets</h3>
          <p className="text-xs text-muted-foreground">Define standard sprint durations and naming conventions.</p>

          <div className="space-y-2">
              {sprintPresets.map(preset => (
                  <Card key={preset.id} className="bg-muted/50 p-3 flex justify-between items-center">
                      <div>
                          <p className="text-sm font-medium">{preset.name}</p>
                          <p className="text-xs text-muted-foreground">
                              {preset.durationDays} days | Convention: "{preset.namingConvention}"
                          </p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onDeletePreset(preset.id)}>
                          <Trash2 className="h-4 w-4 text-destructive"/>
                      </Button>
                  </Card>
              ))}
              {sprintPresets.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-2">No sprint presets defined.</p>
              )}
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                  <Button size="sm" className="text-xs h-8 px-3 mt-2"><Plus className="h-4 w-4 mr-1"/>Add Sprint Preset</Button>
              </DialogTrigger>
              <DialogContent>
                  <DialogHeader>
                      <DialogTitle>Add New Sprint Preset</DialogTitle>
                      <DialogDescription>Define a reusable sprint configuration.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3 py-2">
                      <div>
                          <Label htmlFor="preset-name">Preset Name</Label>
                          <Input id="preset-name" value={newPresetName} onChange={(e) => setNewPresetName(e.target.value)} placeholder="e.g., Standard 2 Weeks" />
                      </div>
                      <div>
                          <Label htmlFor="preset-duration">Duration (Days)</Label>
                          <Input id="preset-duration" type="number" value={newPresetDuration} onChange={(e) => setNewPresetDuration(parseInt(e.target.value, 10) || 1)} min="1" />
                      </div>
                      <div>
                          <Label htmlFor="preset-naming">Naming Convention</Label>
                          <Input id="preset-naming" value={newPresetNaming} onChange={(e) => setNewPresetNaming(e.target.value)} placeholder="e.g., Sprint {YYYY}-{MM}-{DD}" />
                          <p className="text-xs text-muted-foreground mt-1">Use placeholders like {'{YYYY}'}, {'{MM}'}, {'{DD}'}.</p>
                      </div>
                  </div>
                  <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                      <Button onClick={handleAddConfirm}>Add Preset</Button>
                  </DialogFooter>
              </DialogContent>
          </Dialog>
        </div>
      );
    };

    export default SprintPresetSettings;
  