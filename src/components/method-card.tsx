import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Parameter {
  name: string;
  type: string;
  placeholder: string;
}

interface MethodCardProps {
  name: string;
  method: (...args: any[]) => Promise<any>;
  params?: Parameter[];
  description?: string;
}

export function MethodCard({ name, method, params = [], description }: MethodCardProps) {
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleExecute = async () => {
    try {
      setLoading(true);
      setError(null);
      const paramArray = params.map(param => paramValues[param.name]);
      const response = await method(...paramArray);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {params.map(param => (
            <div key={param.name} className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {param.name}
              </label>
              <Input
                placeholder={param.placeholder}
                onChange={(e) => setParamValues({
                  ...paramValues,
                  [param.name]: e.target.value
                })}
              />
            </div>
          ))}

          <Button 
            onClick={handleExecute} 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Executing...' : 'Execute'}
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result !== null && (
            <Alert>
              <AlertDescription>
                <pre className="mt-2 w-full overflow-auto text-sm">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
}