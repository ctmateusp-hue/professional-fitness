import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { AlertTriangle, RefreshCw } from "@phosphor-icons/react";

export const ErrorFallback = ({ error, resetErrorBoundary }) => {
  // When encountering an error in the development mode, rethrow it and don't display the boundary.
  // The parent UI will take care of showing a more helpful dialog.
  if (import.meta.env.DEV) throw error;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="mb-6 border-destructive bg-destructive/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-destructive flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="font-semibold text-destructive mb-1">This spark has encountered a runtime error</h3>
                <p className="text-sm text-muted-foreground">
                  Something unexpected happened while running the application. The error details are shown below. Contact the spark author and let them know about this issue.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="bg-card border rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-sm text-muted-foreground mb-2">Error Details:</h3>
          <pre className="text-xs text-destructive bg-muted/50 p-3 rounded border overflow-auto max-h-32">
            {error.message}
          </pre>
        </div>
        
        <Button 
          onClick={resetErrorBoundary} 
          className="w-full"
          variant="outline"
        >
          <RefreshCw className="mr-2" size={16} />
          Try Again
        </Button>
      </div>
    </div>
  );
}
