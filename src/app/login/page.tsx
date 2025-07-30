import { LoginForm } from './login-form';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50">
      <Card className="mx-auto max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold font-headline">Admin Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the admin dashboard.
          </CardDescription>
        </CardHeader>
        <LoginForm />
      </Card>
    </div>
  );
}
