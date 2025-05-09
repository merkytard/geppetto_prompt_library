
    import React from 'react';
    import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
    import { Label } from "@/components/ui/label";
    import { Switch } from "@/components/ui/switch";
    import { useTheme } from '@/context/ThemeProvider';

    const AppearanceSettings = () => {
      const { theme, setTheme } = useTheme();

      return (
        <Card className="shadow-sm">
          <CardHeader><CardTitle className="text-xl font-semibold border-b pb-2">Appearance</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center justify-between py-2">
              <Label htmlFor="theme-switch" className="text-base">Theme</Label>
              <div className="flex items-center space-x-2">
                <Label htmlFor="theme-switch" className="text-sm text-muted-foreground">Light</Label>
                <Switch id="theme-switch" checked={theme === 'dark'} onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')} aria-label="Toggle theme" />
                <Label htmlFor="theme-switch" className="text-sm text-muted-foreground">Dark</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    };

    export default AppearanceSettings;
  