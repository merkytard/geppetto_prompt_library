
    import React from 'react';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Avatar, AvatarFallback } from '@/components/ui/avatar';
    import { Trophy } from 'lucide-react';
    import { initialUsers } from '@/data/initialKanbanData'; // Corrected import name
    import { cn } from '@/lib/utils';

    // Mock leaderboard data - include avatar type and level
    // Assuming user IDs here match those in initialUsers
    const mockLeaderboardData = [
      { userId: 'user-3', level: 5, xp: 450, avatarType: 'chameleon' }, // Charlie
      { userId: 'user-1', level: 4, xp: 310, avatarType: 'beaver' },    // Alice
      { userId: 'user-2', level: 4, xp: 290, avatarType: 'owl' },       // Bob
      // Add more mock entries if needed, using existing user IDs
    ].sort((a, b) => b.level - a.level || b.xp - a.xp); // Sort by level, then XP


    const Leaderboard = () => {
      const getAvatarIcon = (type) => {
         switch (type) {
             case 'chameleon': return '🦎';
             case 'owl': return '🦉';
             case 'beaver': return '🐿️'; // Changed from beaver to squirrel for better emoji match
             default: return '❓';
         }
      }

      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" /> Team Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockLeaderboardData.map((entry, index) => {
                const user = initialUsers.find(u => u.id === entry.userId); // Use initialUsers here
                if (!user) return null; // Skip if user data not found

                let rankColor = '';
                if (index === 0) rankColor = 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
                else if (index === 1) rankColor = 'border-gray-300 bg-gray-50 dark:bg-gray-700/20';
                else if (index === 2) rankColor = 'border-orange-400 bg-orange-50 dark:bg-orange-900/20';

                // Generate initials for AvatarFallback
                const initials = user.name.split(' ').map(n=>n[0]).join('').toUpperCase();

                return (
                  <div
                    key={entry.userId}
                    className={cn("flex items-center justify-between p-3 rounded-lg border", rankColor)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-bold w-6 text-center text-muted-foreground">#{index + 1}</span>
                      <Avatar className={cn("h-9 w-9", user.color /* Assuming color prop might exist */)}>
                         {/* Removed AvatarImage as it might not exist */}
                        <AvatarFallback className="text-sm">{initials}</AvatarFallback>
                      </Avatar>
                      <div>
                         <span className="font-medium">{user.name}</span>
                         <p className="text-xs text-muted-foreground flex items-center gap-1">
                            {getAvatarIcon(entry.avatarType)} Lvl {entry.level}
                         </p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-primary">{entry.xp} XP</span>
                  </div>
                );
              })}
               {mockLeaderboardData.length === 0 && (
                   <p className="text-sm text-muted-foreground text-center py-4">Leaderboard data is not available.</p>
               )}
            </div>
          </CardContent>
        </Card>
      );
    };

    export default Leaderboard;
  