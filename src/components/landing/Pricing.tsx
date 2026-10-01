'use client';

import { useState } from 'react';
import { Reveal } from './Reveal';
import { Check } from 'lucide-react';
import Link from 'next/link';

export function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: 'FREE',
      desc: 'For getting started.',
      priceMonthly: 0,
      priceAnnual: 0,
      features: [
        'Daily briefing',
        'Basic interests',
        'Text summaries',
        'Limited audio'
      ],
      cta: 'Start free',
      href: '/register',
      isPopular: false
    },
    {
      name: 'PLUS',
      desc: 'For regular news listeners.',
      priceMonthly: 149,
      priceAnnual: 999,
      features: [
        'Personalized interests',
        'Full daily briefing',
        'Audio briefing',
        'Briefing history',
        'Saved stories',
        'Ad-free experience'
      ],
      cta: 'Choose Plus',
      href: '#',
      isPopular: true
    },
    {
      name: 'PRO',
      desc: 'For deeper news consumption.',
      priceMonthly: 299,
      priceAnnual: 2499,
      features: [
        'Everything in Plus',
        'Longer briefings',
        'Advanced personalization',
        'Multiple briefing preferences',
        'Extended history',
        'Additional personalization controls'
      ],
      cta: 'Choose Pro',
      href: '#',
      isPopular: false
    },
    {
      name: 'TEAMS',
      desc: 'For teams that want a shared briefing experience.',
      priceMonthly: '199',
      priceAnnual: '1999',
      unit: '/ user / month',
      features: [
        'Everything in Pro',
        'Team management',
        'Shared interests',
        'Centralized billing'
      ],
      cta: 'Coming soon',
      href: '#',
      isPopular: false,
      disabled: true
    }
  ];

  return (
    <section className="py-24 md:py-32 bg-background border-t border-border" id="plans">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        
        <Reveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-foreground">
              Simple, transparent pricing.
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground font-medium mb-10 max-w-2xl mx-auto">
              Choose the plan that fits how you consume your daily news.
            </p>
            
            <div className="inline-flex items-center gap-2 p-1 bg-surface border border-surface-border rounded-full">
              <button 
                onClick={() => setIsAnnual(false)}
                className={`px-6 py-2 rounded-full text-sm font-bold trans-fast ${!isAnnual ? 'bg-foreground text-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setIsAnnual(true)}
                className={`px-6 py-2 rounded-full text-sm font-bold trans-fast ${isAnnual ? 'bg-foreground text-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Annually
              </button>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, idx) => (
            <Reveal key={plan.name} delay={idx * 100}>
              <div className={`relative flex flex-col h-full bg-surface border rounded-3xl p-8 trans-normal hover:-translate-y-1 ${plan.isPopular ? 'border-foreground shadow-xl' : 'border-surface-border shadow-sm hover:border-border'}`}>
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                    Recommended
                  </div>
                )}
                
                <div className="mb-8">
                  <h3 className="text-sm font-bold tracking-widest uppercase text-muted-foreground mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-3xl font-bold text-foreground">
                      ₹{isAnnual ? plan.priceAnnual : plan.priceMonthly}
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">
                      {plan.unit ? plan.unit : isAnnual ? '/ year' : '/ month'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium h-10">{plan.desc}</p>
                </div>

                <div className="flex-1">
                  <ul className="space-y-4 mb-8">
                    {plan.features.map(feat => (
                      <li key={feat} className="flex items-start gap-3">
                        <Check size={16} className="text-foreground shrink-0 mt-0.5" strokeWidth={2.5} />
                        <span className="text-sm font-medium text-foreground leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link 
                  href={plan.href}
                  className={`w-full text-center py-3.5 rounded-xl font-bold trans-fast active:scale-[0.98] ${
                    plan.disabled 
                      ? 'bg-muted text-muted-foreground cursor-not-allowed pointer-events-none'
                      : plan.isPopular
                        ? 'bg-foreground text-background hover:bg-foreground/90 shadow-md'
                        : 'bg-surface border border-border text-foreground hover:bg-muted'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
        
        <Reveal delay={400}>
          <div className="mt-20 text-center">
            <p className="text-sm text-muted-foreground font-medium">Payments are not yet enabled. Selecting a paid plan will notify you when billing is active.</p>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
