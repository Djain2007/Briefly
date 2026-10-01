import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import LoginForm from './LoginForm';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams;
  const error = params.error as string;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-16 flex items-center px-6 lg:px-12">
        <Link href="/" className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm font-medium transition-colors">
          <ArrowLeft size={16} />
          Back
        </Link>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Log in</h1>
            <p className="text-muted-foreground">Enter your email to access your briefs.</p>
          </div>
          
          <LoginForm initialError={error} />
          
          <p className="text-center text-sm text-muted-foreground animate-fade-in opacity-0 delay-100 fill-mode-forwards">
            Don&apos;t have an account? <Link href="/register" className="text-foreground font-medium hover:underline">Get started</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
