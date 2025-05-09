
    import React, { useState } from 'react';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Switch } from '@/components/ui/switch';
    import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { ExternalLink, Loader2, Eye, EyeOff, AlertTriangle } from 'lucide-react';
    import { getIconComponent } from '@/data/icons'; // Ensure this utility exists and handles icons

    const IntegrationCard = ({
      service,
      description,
      connected,
      onConnect,
      onDisconnect, // Add onDisconnect prop
      onSave, // For API keys
      inputField,
      inputValue,
      onInputChange,
      isLoading,
      userDetails,
      apiKeySensitive = false,
      isToggleOnly = false, // For simple on/off integrations without complex auth
      icon // string key for getIconComponent
    }) => {
      const [showApiKey, setShowApiKey] = useState(false);
      const ServiceIcon = getIconComponent(icon) || AlertTriangle;

      const handleSave = () => {
        if (onSave) {
          onSave(inputValue); // For API keys, onSave might handle connect/disconnect logic
        }
      };

      const handleToggle = (checked) => {
        if (onConnect) onConnect(checked); // Pass checked state for switch-based toggles
      };

      return (
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-3">
            <div className="flex-shrink-0">
              <ServiceIcon className="h-10 w-10 text-primary" />
            </div>
            <div className="flex-grow">
              <CardTitle className="text-lg font-semibold">{service}</CardTitle>
              {description && <CardDescription className="text-xs text-muted-foreground">{description}</CardDescription>}
            </div>
          </CardHeader>
          <CardContent className="pt-2 pb-4 space-y-3">
            {inputField && !isToggleOnly && (
              <div className="space-y-1.5">
                <label htmlFor={`${service}-input`} className="text-xs font-medium text-muted-foreground">{inputField}</label>
                <div className="flex items-center gap-2">
                  <Input
                    id={`${service}-input`}
                    type={apiKeySensitive && !showApiKey ? 'password' : 'text'}
                    value={inputValue}
                    onChange={(e) => onInputChange(e.target.value)}
                    placeholder={`Enter your ${inputField.toLowerCase()}`}
                    className="text-sm h-9"
                    disabled={isLoading || (connected && service !== "ChatGPT")} // Allow editing ChatGPT key even if "connected"
                  />
                  {apiKeySensitive && (
                    <Button variant="ghost" size="icon" onClick={() => setShowApiKey(!showApiKey)} className="h-9 w-9">
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  )}
                </div>
              </div>
            )}
            {userDetails && connected && (
              <p className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 p-2 rounded-md">
                Connected as: {userDetails}
              </p>
            )}
          </CardContent>
          <CardFooter className="flex justify-end items-center gap-2 border-t pt-4">
            {isLoading && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
            
            {isToggleOnly ? (
                 <div className="flex items-center space-x-2">
                    <Switch
                        id={`${service}-toggle`}
                        checked={connected}
                        onCheckedChange={handleToggle}
                        disabled={isLoading}
                    />
                    <label htmlFor={`${service}-toggle`} className="text-sm font-medium text-muted-foreground">
                        {connected ? 'Enabled' : 'Disabled'}
                    </label>
                </div>
            ) : inputField ? (
              // API Key based connection (like ChatGPT)
              <Button onClick={handleSave} disabled={isLoading || !inputValue} size="sm" className="text-xs">
                {connected ? 'Update Key' : 'Save & Connect'}
              </Button>
            ) : (
              // OAuth based connection (like Google)
              <>
                {connected && onDisconnect && (
                  <Button variant="outline" onClick={onDisconnect} disabled={isLoading} size="sm" className="text-xs">
                    Disconnect
                  </Button>
                )}
                {!connected && onConnect && (
                  <Button onClick={onConnect} disabled={isLoading} size="sm" className="text-xs gold-button">
                    Connect {service}
                  </Button>
                )}
              </>
            )}
          </CardFooter>
        </Card>
      );
    };

    export default IntegrationCard;
  