import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export const ErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="mb-6 border-red-500 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="text-red-500 flex-shrink-0 mt-0.5 text-xl">⚠</div>
              <div>
                <h3 className="font-semibold text-red-600 mb-1">Erro na aplicação</h3>
                <p className="text-sm text-gray-600">
                  Algo inesperado aconteceu. Tente recarregar a página.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="bg-white border rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-sm text-gray-600 mb-2">Detalhes do erro:</h3>
          <pre className="text-xs text-red-600 bg-gray-100 p-3 rounded border overflow-auto max-h-32">
            {error.message}
          </pre>
        </div>
        
        <Button 
          onClick={resetErrorBoundary} 
          className="w-full"
          variant="outline"
        >
          🔄 Tentar Novamente
        </Button>
      </div>
    </div>
  );
}
