
    import React from "react";
    import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
    import { Button } from "@/components/ui/button";
    import { Badge } from "@/components/ui/badge";
    import { Star, Download, Tag, Info, ExternalLink } from "lucide-react";

    export default function AppCard({ app, onSelect, isSelected, isWorkingOn }) {
      if (!app) {
        return (
          <Card className="animate-pulse">
            <CardHeader className="flex flex-col items-center gap-2 p-4">
              <div className="w-16 h-16 rounded-md bg-muted"></div>
              <div className="h-4 w-3/4 rounded bg-muted"></div>
              <div className="h-3 w-1/2 rounded bg-muted"></div>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              <div className="h-3 w-full rounded bg-muted"></div>
              <div className="h-3 w-5/6 rounded bg-muted"></div>
            </CardContent>
            <CardFooter className="p-4">
              <div className="h-8 w-full rounded bg-muted"></div>
            </CardFooter>
          </Card>
        );
      }

      const {
        packageName,
        iconUrl,
        name,
        description,
        releaseStatus,
        lastTestUrl,
        rating,
        category,
        currentVersion,
        installs
      } = app;

      const getStatusColor = (status) => {
        if (!status) return "bg-gray-500";
        const lowerStatus = status.toLowerCase();
        if (lowerStatus.includes("published")) return "bg-green-500";
        if (lowerStatus.includes("beta")) return "bg-yellow-500";
        if (lowerStatus.includes("alpha") || lowerStatus.includes("internal")) return "bg-blue-500";
        if (lowerStatus.includes("review")) return "bg-orange-500";
        return "bg-gray-500";
      };

      return (
        <Card
          className={`hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 border-2 ${
            isSelected ? "border-primary shadow-lg" : "border-transparent"
          } ${isWorkingOn ? "ring-2 ring-offset-2 ring-green-500" : ""}`}
          onClick={() => onSelect && onSelect(app)}
        >
          <CardHeader className="flex flex-row items-start gap-4 p-4 bg-muted/30 rounded-t-lg">
            <img 
              src={iconUrl || "/placeholder-icon.png"}
              alt={name || packageName}
              className="w-16 h-16 md:w-20 md:h-20 rounded-lg border object-cover"
             src="https://images.unsplash.com/photo-1626682561113-d1db402cc866" />
            <div className="flex-grow">
              <h3 className="text-base md:text-lg font-semibold text-primary truncate" title={name || packageName}>
                {name || packageName}
              </h3>
              <p className="text-xs text-muted-foreground truncate" title={packageName}>{packageName}</p>
              <Badge variant="outline" className={`mt-1 text-xs ${getStatusColor(releaseStatus)} text-white border-none`}>
                {releaseStatus || "Unknown Status"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 text-sm space-y-2">
            <p className="text-xs text-muted-foreground line-clamp-3 h-12" title={description}>
              {description || "No description available."}
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              {category && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Tag className="h-3 w-3" /> {category}
                </Badge>
              )}
              {rating && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-400" /> {rating}
                </Badge>
              )}
               {currentVersion && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Info className="h-3 w-3" /> v{currentVersion}
                </Badge>
              )}
              {installs && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Download className="h-3 w-3" /> {installs}
                </Badge>
              )}
            </div>
          </CardContent>
          <CardFooter className="p-4 border-t">
            {lastTestUrl ? (
              <a
                href={lastTestUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <Button variant="outline" size="sm" className="w-full flex items-center gap-2 hover:bg-primary/10">
                  View Test <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </a>
            ) : (
              <Button variant="ghost" size="sm" className="w-full text-muted-foreground" disabled>
                No Active Test Link
              </Button>
            )}
          </CardFooter>
        </Card>
      );
    }
  