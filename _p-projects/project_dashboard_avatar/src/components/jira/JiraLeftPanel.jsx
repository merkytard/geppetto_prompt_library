
    import React from 'react';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
    import TamagotchiAvatar from '@/components/TamagotchiAvatar';
    import Leaderboard from '@/components/Leaderboard';
    import EggSelection from '@/components/EggSelection';
    import { ScrollArea } from '@/components/ui/scroll-area';
    import { Users, Award, Activity } from 'lucide-react';

    const JiraLeftPanel = ({ tamagotchiState, leaderboardData, onSelectEgg, users }) => {
      return (
        <ScrollArea className="h-full p-1">
          <div className="space-y-4">
            {tamagotchiState && tamagotchiState.hasChosen ? (
              <Card className="bg-gradient-to-br from-card to-muted/30 shadow-lg border-primary/10">
                <CardHeader className="p-3 text-center">
                  <CardTitle className="text-lg">My Companion</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center p-3">
                  <TamagotchiAvatar state={tamagotchiState} size="default" />
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gradient-to-br from-card to-muted/30 shadow-lg border-primary/10">
                <CardHeader className="p-3 text-center">
                  <CardTitle className="text-lg">Choose Your Companion!</CardTitle>
                  <CardDescription className="text-xs">A new friend awaits.</CardDescription>
                </CardHeader>
                <CardContent className="p-3">
                  <EggSelection onHatch={onSelectEgg} />
                </CardContent>
              </Card>
            )}

            <Card className="bg-card shadow-md">
              <CardHeader className="p-3">
                <CardTitle className="text-base flex items-center">
                  <Award className="h-4 w-4 mr-2 text-yellow-500" />
                  Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <Leaderboard data={leaderboardData || []} currentUser={tamagotchiState?.name} />
              </CardContent>
            </Card>

            <Card className="bg-card shadow-md">
              <CardHeader className="p-3">
                <CardTitle className="text-base flex items-center">
                  <Users className="h-4 w-4 mr-2 text-blue-500" />
                  Team Members
                </CardTitle>
                <CardDescription className="text-xs">Active users in Jira.</CardDescription>
              </CardHeader>
              <CardContent className="p-3 text-xs">
                {users && users.length > 0 ? (
                  <ul className="space-y-1.5">
                    {users.map(user => (
                      <li key={user.id} className="flex items-center gap-2 p-1.5 rounded bg-muted/50">
                        <img  alt={user.name} className="w-5 h-5 rounded-full" src="https://images.unsplash.com/photo-1665113361900-b9720957d41a" />
                        <span>{user.name}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No users found.</p>
                )}
              </CardContent>
            </Card>
            
            <Card className="bg-card shadow-md">
              <CardHeader className="p-3">
                <CardTitle className="text-base flex items-center">
                  <Activity className="h-4 w-4 mr-2 text-green-500" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 text-xs text-muted-foreground">
                <p>Activity feed coming soon...</p>
              </CardContent>
            </Card>

          </div>
        </ScrollArea>
      );
    };

    export default JiraLeftPanel;
  