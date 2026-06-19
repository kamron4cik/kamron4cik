import { useState, useEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import LoadingScreen from '@/components/LoadingScreen';
import HeroSection from '@/sections/HeroSection';
import AboutSection from '@/sections/AboutSection';
import ExperienceSection from '@/sections/ExperienceSection';
import EducationSection from '@/sections/EducationSection';
import SkillsSection from '@/sections/SkillsSection';
import ProjectsSection from '@/sections/ProjectsSection';
import CertificationsSection from '@/sections/CertificationsSection';
import ContactSection from '@/sections/ContactSection';
import FooterSection from '@/sections/FooterSection';
import CompanionToasts from '@/components/CompanionToasts';

gsap.registerPlugin(ScrollTrigger);

type LoadingPhase = 'loading' | 'ready' | 'exited';

function App() {
  const [phase, setPhase] = useState<LoadingPhase>('loading');
  const [progress, setProgress] = useState(0);
  const lenisRef = useRef<Lenis | null>(null);

  // Initialize smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  // Loading progress animation
  useEffect(() => {
    if (phase !== 'loading') return;

    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Slow down near the end to wait for 3D scene
        const increment = prev > 80 ? 1 : prev > 50 ? 3 : 5;
        return Math.min(prev + increment, 95);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [phase]);

  // When 3D scene is ready and progress is at least 95, mark as ready
  const handleSceneReady = useCallback(() => {
    if (phase === 'loading') {
      setProgress(100);
      setTimeout(() => {
        setPhase('ready');
        // After exit animation completes
        setTimeout(() => {
          setPhase('exited');
        }, 700);
      }, 400);
    }
  }, [phase]);

  // Force scene ready after timeout as fallback
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (phase === 'loading') {
        handleSceneReady();
      }
    }, 4000);
    return () => clearTimeout(timeout);
  }, [phase, handleSceneReady]);

  const isLoading = phase === 'loading' || phase === 'ready';

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: '#060B1A' }}>
      {/* Loading Screen */}
      <LoadingScreen isVisible={isLoading} progress={progress} />

      {/* AI Companion Achievement Toasts */}
      <CompanionToasts />

      {/* Main Content */}
      <main className={phase === 'exited' ? 'opacity-100' : 'opacity-0'}>
        <HeroSection isActive={phase === 'exited'} />
        <AboutSection />
        <ExperienceSection />
        <EducationSection />
        <SkillsSection />
        <ProjectsSection />
        <CertificationsSection />
        <ContactSection />
        <FooterSection />
      </main>
    </div>
  );
}

export default App;
