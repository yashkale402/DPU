
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { authenticate } from './actions';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export function LoginForm() {
  const [errorMessage, dispatch] = useActionState(authenticate, undefined);

  return (
    <form action={dispatch}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input 
            id="username" 
            name="username" 
            type="text"
            placeholder="ganesh" 
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password" 
            name="password" 
            type="password" 
            placeholder="••••••••"
            required 
          />
        </div>
        {errorMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <LoginButton />
      </CardFooter>
    </form>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" aria-disabled={pending}>
      {pending ? 'Logging in...' : 'Login'}
    </Button>
  );
}
