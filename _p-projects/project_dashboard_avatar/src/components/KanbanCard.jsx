
    import React from 'react';
    import { useSortable } from '@dnd-kit/sortable';
    import { CSS } from '@dnd-kit/utilities';
    import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
    import { Avatar, AvatarFallback } from '@/components/ui/avatar';
    import { Badge } from '@/components/ui/badge';
    import { Button } from '@/components/ui/button';
    import { Edit3, User, Tag, Clock, Link2, CheckCircle, Zap, Archive, Info, ExternalLink, FolderOpen, Layers, Brain } from 'lucide-react';
    import ReminderSettingsPopover from '@/components/ReminderSettingsPopover';
    import { cn } from '@/lib/utils';
    import { motion } from 'framer-motion';

    const KanbanCard = ({
      card, columnId, users = [], onEdit, onAssignUser, onChangeColor,
      onLinkToNode, onArchive, onSetReminder, isSelected, isOverlay, onCompleteCard,
    }) => {
      const {
        attributes, listeners, setNodeRef, transform, transition, isDragging
      } = useSortable({ id: card.id, data: { type: 'card', card } });

      const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : 'auto',
      };

      const assignedUsers = users.filter(user => card.assignedUserIds?.includes(user.id));
      const priorityColor = card.priority === 'High' ? 'text-red-500' : card.priority === 'Medium' ? 'text-yellow-500' : 'text-green-500';

      const handleComplete = (e) => {
        e.stopPropagation(); 
        if (onCompleteCard) {
          onCompleteCard(columnId, card.id);
        }
      };

      const cardBaseColor = card.color || 'bg-card';

      return (
        <motion.div
          ref={setNodeRef}
          style={style}
          {...attributes}
          {...listeners}
          layoutId={isOverlay ? undefined : card.id}
          className={cn(
            "kanban-card relative group",
            cardBaseColor,
            isSelected && "ring-2 ring-primary shadow-lg",
            card.isArchived && "opacity-60"
          )}
        >
          <CardHeader className="p-2 border-b">
            <div className="flex justify-between items-start">
              <CardTitle className="text-sm font-semibold break-words mr-1">{card.title}</CardTitle>
              <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0 text-muted-foreground group-hover:text-primary" onClick={(e) => { e.stopPropagation(); onEdit(card); }}>
                <Edit3 className="h-3.5 w-3.5" />
              </Button>
            </div>
            {card.projectId && (
                <p className="text-xs text-muted-foreground mt-0.5">
                    Project: {card.projectName || '...'}
                </p>
            )}
          </CardHeader>

          <CardContent className="p-2 space-y-1.5">
            {card.description && <p className="text-xs text-muted-foreground break-words line-clamp-2">{card.description}</p>}
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
                {card.dueDate && (
                    <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{card.dueDate}</span>
                    </div>
                )}
                <span className={cn("font-medium", priorityColor)}>{card.priority}</span>
            </div>

            {card.tags && card.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {card.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-[10px] px-1 py-0.5">{tag}</Badge>
                ))}
              </div>
            )}

            {card.sourceCodeUrl && (
                <div className="flex items-center gap-1 text-xs text-blue-500 hover:underline cursor-pointer mt-1" onClick={() => window.open(card.sourceCodeUrl, '_blank')}>
                    <ExternalLink className="h-3 w-3" />
                    <span>Source Code</span>
                </div>
            )}
            {card.localFolderPath && (
                 <div className="flex items-center gap-1 text-xs text-purple-500 mt-1" title={card.localFolderPath}>
                    <FolderOpen className="h-3 w-3" />
                    <span className="truncate max-w-[100px] sm:max-w-[150px]">{card.localFolderPath.split(/[/\\]/).pop() || card.localFolderPath}</span>
                </div>
            )}
            
            {/* Link indicators */}
            <div className="flex items-center gap-2 mt-1.5 text-xs">
                {card.linkedKanbanTask && (
                    <Badge variant="outline" className="border-orange-400 text-orange-600">
                        <Layers className="h-3 w-3 mr-1" /> Kanban
                    </Badge>
                )}
                {card.linkedNodeId && (
                     <Badge variant="outline" className="border-teal-400 text-teal-600">
                        <Brain className="h-3 w-3 mr-1" /> NodeBase
                    </Badge>
                )}
            </div>


          </CardContent>

          <CardFooter className="p-2 border-t flex flex-col items-start space-y-2">
            <div className="flex justify-between items-center w-full">
                <div className="flex items-center -space-x-2">
                    {assignedUsers.map(user => (
                    <Avatar key={user.id} className="h-5 w-5 border-2 border-card">
                        <AvatarFallback className="text-[10px]">{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    ))}
                    {assignedUsers.length === 0 && (
                    <div className="flex items-center text-xs text-muted-foreground">
                        <User className="h-3 w-3 mr-1" /> Unassigned
                    </div>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    {card.xpValue && (
                        <Badge variant="outline" className="text-green-600 border-green-600/50 px-1.5 py-0.5 text-[10px] flex items-center gap-0.5">
                            <Zap className="h-2.5 w-2.5" /> {card.xpValue} XP
                        </Badge>
                    )}
                    {onLinkToNode && card.id && ( 
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-blue-500" onClick={() => onLinkToNode(card.id, null)} title="Link to NodeBase">
                        <Link2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                </div>
            </div>
             <div className="flex justify-between items-center w-full">
                 <ReminderSettingsPopover
                    cardId={card.id} columnId={columnId} currentSettings={card.reminder}
                    onSetReminder={onSetReminder}
                    trigger={
                        <Button variant="ghost" size="xs" className="text-xs text-muted-foreground hover:text-amber-600 px-1.5 py-0.5 h-auto">
                            <Clock className={cn("h-3 w-3 mr-1", card.reminder?.frequency && card.reminder.frequency !== 'none' ? 'text-amber-500' : '')} />
                            Reminder
                        </Button>
                    }
                  />
                  {!card.isArchived && onCompleteCard && (
                    <Button variant="ghost" size="xs" className="text-xs text-green-600 hover:text-green-700 hover:bg-green-500/10 px-1.5 py-0.5 h-auto" onClick={handleComplete}>
                        <CheckCircle className="h-3 w-3 mr-1" /> Mark Done
                    </Button>
                  )}
                   {card.isArchived && (
                    <Badge variant="outline" className="text-xs text-gray-500 border-gray-400/50">
                        <Archive className="h-3 w-3 mr-1" /> Archived
                    </Badge>
                  )}
             </div>
          </CardFooter>
        </motion.div>
      );
    };

    export default React.memo(KanbanCard);
  