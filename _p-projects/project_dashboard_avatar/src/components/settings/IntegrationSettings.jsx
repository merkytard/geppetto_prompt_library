
    import React from 'react';
    import IntegrationCard from '@/components/IntegrationCard';
    import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Loader2 } from 'lucide-react';

    const IntegrationSettings = ({
      googleAuth, // Now receiving the entire googleGlobalHook object
      chatGptStatus,
      chatGptApiKeyInput,
      onChatGptApiKeyInputChange,
      onChatGPTSave,
      trelloStatus,
      notionStatus,
      slackStatus,
      onToggleIntegration
    }) => {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Service Integrations</CardTitle>
            <CardDescription>Connect your accounts to enhance application functionality. More integrations coming soon!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <IntegrationCard
              service="Google Account"
              description="Connect to access Google Calendar, Gmail, and Drive."
              connected={googleAuth.isAuthenticated}
              onConnect={googleAuth.signIn}
              onDisconnect={googleAuth.signOut}
              isLoading={googleAuth.isLoading}
              userDetails={googleAuth.user ? `${googleAuth.user.name} (${googleAuth.user.email})` : null}
              icon="Google"
            />
            <IntegrationCard
              service="ChatGPT"
              description="Enable AI-powered features and chat assistance."
              connected={chatGptStatus.connected}
              onSave={onChatGPTSave} // onSave will handle connect/disconnect based on key
              inputField="API Key"
              inputValue={chatGptApiKeyInput}
              onInputChange={onChatGptApiKeyInputChange}
              apiKeySensitive={true}
              icon="Bot"
            />
             <IntegrationCard
              service="Trello (Soon)"
              description="Sync tasks and boards from Trello."
              connected={trelloStatus.connected}
              onConnect={() => onToggleIntegration('trello')} // For simple toggle
              isToggleOnly={true} // Indicates it's a simple toggle without complex auth
              icon="Trello"
            />
             <IntegrationCard
              service="Notion (Soon)"
              description="Integrate your Notion workspaces and databases."
              connected={notionStatus.connected}
              onConnect={() => onToggleIntegration('notion')}
              isToggleOnly={true}
              icon="Database" // Or a more specific Notion icon if available
            />
             <IntegrationCard
              service="Slack (Soon)"
              description="Receive notifications and interact via Slack."
              connected={slackStatus.connected}
              onConnect={() => onToggleIntegration('slack')}
              isToggleOnly={true}
              icon="MessageCircle" // Or a Slack icon
            />

            {/* Example of how to use fetched Google data (optional display here) */}
            {googleAuth.isAuthenticated && (
              <div className="mt-6 p-4 border rounded-lg bg-muted/50">
                <h4 className="font-semibold mb-2">Google Integration Actions:</h4>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={googleAuth.fetchCalendarEvents} disabled={googleAuth.isLoading} size="sm" variant="outline">
                    {googleAuth.isLoading && googleAuth.calendarEvents.length === 0 ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Fetch Calendar Events
                  </Button>
                  <Button onClick={() => googleAuth.fetchGmailMessages(3)} disabled={googleAuth.isLoading} size="sm" variant="outline">
                     {googleAuth.isLoading && googleAuth.gmailMessages.length === 0 ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Fetch Gmail (3)
                  </Button>
                </div>
                {googleAuth.calendarEvents.length > 0 && (
                  <div className="mt-3 text-xs">
                    <p className="font-medium">Recent Calendar Events:</p>
                    <ul className="list-disc list-inside">
                      {googleAuth.calendarEvents.slice(0,2).map(event => <li key={event.id}>{event.summary}</li>)}
                    </ul>
                  </div>
                )}
                 {googleAuth.gmailMessages.length > 0 && (
                  <div className="mt-3 text-xs">
                    <p className="font-medium">Recent Gmail Subjects:</p>
                    <ul className="list-disc list-inside">
                      {googleAuth.gmailMessages.slice(0,2).map(msg => <li key={msg.id}>{msg.payload.headers.find(h => h.name === "Subject")?.value || 'No Subject'}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}

          </CardContent>
        </Card>
      );
    };

    export default IntegrationSettings;
  