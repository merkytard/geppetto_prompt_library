
    import React from 'react';
    import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
    import { Button } from "@/components/ui/button";
    import { User, Download } from 'lucide-react';
    import usePersistentState from '@/hooks/usePersistentState';

    const avatarTypes = {
      chameleon: { name: 'Chameleon', icon: '🦎', description: 'Creative Visionary (Graphic Designer)', color: 'text-green-500' },
      owl: { name: 'Owl', icon: '🦉', description: 'Strategic Planner (Analyst/Manager)', color: 'text-indigo-500' },
      beaver: { name: 'Beaver', icon: '🐿️', description: 'Diligent Builder (Programmer)', color: 'text-amber-600' },
      peacock: { name: 'Peacock', icon: '🦚', description: 'Engaging Promoter (Marketer)', color: 'text-cyan-500' },
      octopus: { name: 'Octopus', icon: '🐙', description: 'Versatile Creator (Video Artist)', color: 'text-rose-500' },
    };

    const ProfileSettings = ({ theme, integrationStatus }) => {
      const [tamagotchiState] = usePersistentState('tamagotchiState', {});

      const handleSaveProfile = () => {
        const profileData = { theme, tamagotchi: tamagotchiState, integrations: integrationStatus };
        const jsonString = JSON.stringify(profileData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url; link.download = 'profile.json';
        document.body.appendChild(link); link.click(); document.body.removeChild(link);
        URL.revokeObjectURL(url);
        alert('Profile data saved as profile.json');
      };

      const getAvatarDetails = () => avatarTypes[tamagotchiState?.type] || { name: 'N/A', icon: '❓', description: 'No Avatar Chosen', color: 'text-gray-500' };
      const { icon: avatarIcon, name: avatarName, description: avatarDescription } = getAvatarDetails();

      return (
        <Card className="shadow-sm">
          <CardHeader><CardTitle className="text-xl font-semibold border-b pb-2 flex items-center gap-2"><User className="h-5 w-5" /> Profile</CardTitle></CardHeader>
          <CardContent className="space-y-4">
             {tamagotchiState?.hasChosen ? (
                <div className="flex items-center gap-4">
                  <span className="text-5xl">{avatarIcon}</span>
                  <div>
                    <p className="font-medium">Name: {tamagotchiState.name}</p>
                    <p className="text-sm text-muted-foreground">Type: {avatarName} ({avatarDescription})</p>
                    <p className="text-sm text-muted-foreground">Level: {tamagotchiState.level} (XP: {tamagotchiState.xp}/{tamagotchiState.xpToNextLevel})</p>
                  </div>
                </div>
             ) : ( <p className="text-muted-foreground">No avatar chosen yet. Visit the Jira page to select one.</p> )}
             <Button onClick={handleSaveProfile} variant="outline" size="sm"> <Download className="mr-2 h-4 w-4" /> Save Profile Data (JSON) </Button>
          </CardContent>
        </Card>
      );
    };

    export default ProfileSettings;
  