import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import RegisterForm from './RegisterForm';

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
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
            <h1 className="text-3xl font-bold tracking-tight mb-2">Create account</h1>
            <p className="text-muted-foreground">Start building your personalized daily brief.</p>
          </div>
          
          <RegisterForm initialError={error} />
          
          <p className="text-center text-sm text-muted-foreground animate-fade-in opacity-0 delay-100 fill-mode-forwards">
            Already have an account? <Link href="/login" className="text-foreground font-medium hover:underline">Log in</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
