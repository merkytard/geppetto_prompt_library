
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, Bot, Plus, ExternalLink, Settings, Image as ImageIcon, Trash2 } from 'lucide-react'; // Added ImageIcon and Trash2
import usePersistentState from '@/hooks/usePersistentState';

const ModuleCard = ({ title, description, icon: Icon, children }) => (
   <Card>
      <CardHeader>
         <div className="flex items-center gap-3 mb-2">
            <Icon className="w-6 h-6 text-primary" />
            <CardTitle>{title}</CardTitle>
         </div>
         <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
   </Card>
);

const ModulesPage = () => {
   const [customUrls, setCustomUrls] = usePersistentState('moduleCustomUrls', []);
   const [newUrl, setNewUrl] = useState('');
   const [newName, setNewName] = useState('');
   const [isGptConnected, setIsGptConnected] = usePersistentState('moduleGptConnected', false); // Mock connection state


   const addCustomUrl = (e) => {
      e.preventDefault();
      if (newUrl.trim() && newName.trim()) {
         // Basic URL validation (very simple)
         if (!newUrl.startsWith('http://') && !newUrl.startsWith('https://')) {
            alert('Please enter a valid URL starting with http:// or https://');
            return;
         }
         setCustomUrls(prev => [...prev, { id: `custom-${Date.now()}`, name: newName, url: newUrl }]);
         setNewUrl('');
         setNewName('');
      }
   };

   const removeCustomUrl = (id) => {
      setCustomUrls(prev => prev.filter(item => item.id !== id));
   };

   const toggleGptConnection = () => {
      if(!isGptConnected) {
         alert("Mock Connect: In a real app, this would involve API key input and validation.");
      }
      setIsGptConnected(!isGptConnected);
   };


  return (
    <div>
      <h1 className="text-3xl font-bold mb-4 text-primary">Modules & Integrations</h1>
      <p className="text-muted-foreground mb-6">
        Connect external tools and services to enhance your workflow.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

         {/* AI Assistant Module */}
         <ModuleCard title="AI Assistant (ChatGPT)" description="Integrate ChatGPT for task assistance, summarization, and more." icon={Bot}>
            <div className="flex items-center justify-between">
               <span className={`text-sm font-medium ${isGptConnected ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {isGptConnected ? 'Connected' : 'Not Connected'}
               </span>
               <Button variant={isGptConnected ? "destructive" : "outline"} size="sm" onClick={toggleGptConnection} className={!isGptConnected ? "gold-button" : ""}>
                  {isGptConnected ? 'Disconnect' : 'Connect'}
               </Button>
            </div>
             {isGptConnected && <p className="text-xs text-muted-foreground mt-2">Assistant features are now available (mock).</p>}
         </ModuleCard>

         {/* Midjourney Module */}
          <ModuleCard title="Midjourney" description="Quickly access your Midjourney account." icon={ImageIcon}>
             <Button variant="outline" size="sm" className="w-full gold-button" onClick={() => window.open('https://www.midjourney.com/', '_blank')}>
                Open Midjourney <ExternalLink className="h-4 w-4 ml-2" />
             </Button>
          </ModuleCard>

         {/* Custom URLs Module */}
         <ModuleCard title="Custom Links" description="Add quick links to frequently used websites." icon={Link}>
            <form onSubmit={addCustomUrl} className="space-y-3 mb-4">
               <div className="grid gap-1">
                  <Label htmlFor="link-name" className="text-xs">Name</Label>
                  <Input id="link-name" placeholder="e.g., Company Wiki" value={newName} onChange={(e) => setNewName(e.target.value)} required />
               </div>
               <div className="grid gap-1">
                  <Label htmlFor="link-url" className="text-xs">URL</Label>
                  <Input id="link-url" placeholder="https://..." type="url" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} required />
               </div>
               <Button type="submit" size="sm" className="w-full gold-button"><Plus className="h-4 w-4 mr-1" /> Add Link</Button>
            </form>
            <div className="space-y-2 max-h-32 overflow-y-auto">
               {customUrls.map(item => (
                  <div key={item.id} className="flex items-center justify-between text-sm bg-muted/50 p-2 rounded">
                     <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary truncate pr-2">
                        {item.name}
                     </a>
                     <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0" onClick={() => removeCustomUrl(item.id)}>
                        <Trash2 className="h-3 w-3 text-destructive" />
                     </Button>
                  </div>
               ))}
               {customUrls.length === 0 && <p className="text-xs text-muted-foreground text-center">No custom links added yet.</p>}
            </div>
         </ModuleCard>

         {/* Placeholder for more modules */}
          <Card className="border-dashed border-2 flex items-center justify-center min-h-[200px]">
              <div className="text-center text-muted-foreground">
                  <Settings className="h-8 w-8 mx-auto mb-2" />
                  <p>More modules coming soon...</p>
              </div>
          </Card>

      </div>
    </div>
  );
};

export default ModulesPage;
