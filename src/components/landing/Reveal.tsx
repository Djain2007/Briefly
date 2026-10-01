'use client';
import { useEffect, useRef, useState, ReactNode } from 'react';

export function Reveal({ 
  children, 
  delay = 0, 
  className = '',
  direction = 'up'
}: { 
  children: ReactNode, 
  delay?: number, 
  className?: string,
  direction?: 'up' | 'none'
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  const getTranslate = () => {
    if (direction === 'none') return '';
    return isVisible ? 'translate-y-0' : 'translate-y-4';
  };

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-500 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'} ${getTranslate()} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
