
    import React from "react";
    import usePersistentState from "@/hooks/usePersistentState";
    import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
    import ProfileSettings from "@/components/settings/ProfileSettings";
    import AppearanceSettings from "@/components/settings/AppearanceSettings";
    import IntegrationSettings from "@/components/settings/IntegrationSettings";
    import ConfigurationPresets from "@/components/settings/ConfigurationPresets";
    import DataManagementSettings from "@/components/settings/DataManagementSettings"; // Import new component
    import { useToast } from "@/components/ui/use-toast";
    import useGoogleGlobal from "@/hooks/useGoogleGlobal"; 

    const SettingsPage = () => {
      const { toast } = useToast();
      const googleGlobalHook = useGoogleGlobal();

      const [integrationStatus, setIntegrationStatus] = usePersistentState("integrationStatus", {
        chatgpt: { connected: false, apiKey: "" },
        trello: { connected: false },
        notion: { connected: false },
        slack: { connected: false },
      });

      const [chatGptApiKeyInput, setChatGptApiKeyInput] = usePersistentState("chatGptApiKeyInput", integrationStatus.chatgpt.apiKey || "");
      
      React.useEffect(() => {
        setIntegrationStatus(prev => ({
          ...prev,
          google: { 
            connected: googleGlobalHook.isAuthenticated,
            token: googleGlobalHook.accessToken, 
            user: googleGlobalHook.user
          }
        }));
      }, [googleGlobalHook.isAuthenticated, googleGlobalHook.accessToken, googleGlobalHook.user, setIntegrationStatus]);


      const handleChatGPTSave = (key) => {
        const newStatus = { ...integrationStatus.chatgpt, connected: !!key, apiKey: key };
        setIntegrationStatus(prev => ({ ...prev, chatgpt: newStatus }));
        if (key) {
          toast({ title: "ChatGPT API Key Saved", description: "Successfully connected to ChatGPT." });
        } else {
          toast({ title: "ChatGPT API Key Reset", description: "API Key removed." });
        }
      };

      const handleToggleIntegration = (serviceName) => {
        setIntegrationStatus(prev => {
            const currentServiceState = prev[serviceName] || { connected: false };
            const newServiceState = { ...currentServiceState, connected: !currentServiceState.connected };
            const message = newServiceState.connected ? `${serviceName.charAt(0).toUpperCase() + serviceName.slice(1)} Connected` : `${serviceName.charAt(0).toUpperCase() + serviceName.slice(1)} Disconnected`;
            toast({ title: message });
            return { ...prev, [serviceName]: newServiceState };
        });
      };


      return (
        <div className="container mx-auto py-8 px-4 md:px-6 h-full overflow-y-auto">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-destructive">
              Application Settings
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your preferences, integrations, and application configurations.
            </p>
          </header>

          <Tabs defaultValue="integrations" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-6"> {/* Adjusted for new tab */}
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
              <TabsTrigger value="presets">Presets</TabsTrigger>
              <TabsTrigger value="data">Data Management</TabsTrigger> {/* New Tab Trigger */}
            </TabsList>

            <TabsContent value="profile">
              <ProfileSettings 
                theme={localStorage.getItem("vite-ui-theme") || "light"} 
                integrationStatus={integrationStatus} 
              />
            </TabsContent>
            <TabsContent value="appearance">
              <AppearanceSettings />
            </TabsContent>
            <TabsContent value="integrations">
              <IntegrationSettings
                googleAuth={googleGlobalHook} 
                chatGptStatus={integrationStatus.chatgpt}
                chatGptApiKeyInput={chatGptApiKeyInput}
                onChatGptApiKeyInputChange={setChatGptApiKeyInput}
                onChatGPTSave={handleChatGPTSave}
                trelloStatus={integrationStatus.trello}
                notionStatus={integrationStatus.notion}
                slackStatus={integrationStatus.slack}
                onToggleIntegration={handleToggleIntegration}
              />
            </TabsContent>
            <TabsContent value="presets">
              <ConfigurationPresets />
            </TabsContent>
            <TabsContent value="data"> {/* New Tab Content */}
              <DataManagementSettings />
            </TabsContent>
          </Tabs>
        </div>
      );
    };

    export default SettingsPage;
  