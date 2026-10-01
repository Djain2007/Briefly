import { createClient } from '@/lib/supabase/server';
import { LandingNav } from '@/components/landing/LandingNav';
import { Hero } from '@/components/landing/Hero';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { InterestPreview } from '@/components/landing/InterestPreview';
import { AudioSection } from '@/components/landing/AudioSection';
import { ProductShowcase } from '@/components/landing/ProductShowcase';
import { Pricing } from '@/components/landing/Pricing';
import { FinalCTA } from '@/components/landing/FinalCTA';
import { Footer } from '@/components/landing/Footer';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const isLoggedIn = !!user;

  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-foreground selection:text-background scroll-smooth">
      <LandingNav isLoggedIn={isLoggedIn} />
      <main className="flex-1">
        <Hero isLoggedIn={isLoggedIn} />
        <HowItWorks />
        <InterestPreview />
        <AudioSection />
        <ProductShowcase />
        <Pricing />
        <FinalCTA isLoggedIn={isLoggedIn} />
      </main>
      <Footer />
    </div>
  );
}
