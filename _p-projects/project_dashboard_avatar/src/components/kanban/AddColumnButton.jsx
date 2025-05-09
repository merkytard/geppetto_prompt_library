
    import React from 'react';
    import { Button } from '@/components/ui/button';
    import { Plus } from 'lucide-react';
    import AddColumnDialog from '@/components/AddColumnDialog'; // Import the dialog

    const AddColumnButton = ({ onAddColumn }) => {
      return (
        <AddColumnDialog onSave={onAddColumn}>
          <Button
            variant="outline"
            className="min-w-[280px] h-16 border-dashed border-muted-foreground/50 hover:border-primary/80 hover:text-primary transition-colors duration-200 flex items-center justify-center gap-2 text-muted-foreground hover:bg-accent"
          >
            <Plus className="h-5 w-5" />
            Add Column
          </Button>
        </AddColumnDialog>
      );
    };

    export default AddColumnButton;
  