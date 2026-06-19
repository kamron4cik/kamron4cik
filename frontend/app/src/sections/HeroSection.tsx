import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTypewriter } from '@/hooks/useTypewriter';
import SocialLinks from '@/components/SocialLinks';
import ScrollIndicator from '@/components/ScrollIndicator';
import HolographicScene from '@/3d/HolographicScene';
import { Download, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  isActive: boolean;
}

export default function HeroSection({ isActive }: HeroSectionProps) {
  const [sceneReady, setSceneReady] = useState(false);
  const [cvHovered, setCvHovered] = useState(false);

  const nameTyping = useTypewriter({
    text: 'KAMRONBEK JUMANOV',
    speed: 60,
    enabled: isActive && sceneReady,
  });

  const roleTyping = useTypewriter({
    text: 'Software Engineering Student | AI Enthusiast | Backend Developer',
    speed: 40,
    enabled: isActive && nameTyping.isComplete,
  });

  return (
    <section className="relative w-full h-screen overflow-hidden">
      <HolographicScene onReady={() => setSceneReady(true)} />

      <div
        className="absolute inset-0 z-[1]"
        style={{ background: 'rgba(6, 11, 26, 0.35)' }}
      />

      <div className="absolute bottom-20 left-0 right-0 z-[2]">
        <div className="max-w-[1200px] mx-auto px-5 md:px-10">
          <div className="relative mb-4">
            <h1
              className="font-display text-4xl md:text-6xl lg:text-7xl font-bold uppercase leading-[1.1] tracking-[0.02em] gradient-text name-glow animate-pulse-glow select-none"
              style={{ opacity: nameTyping.displayText ? 1 : 0 }}
            >
              <span className="relative">
                {nameTyping.displayText || 'KAMRONBEK JUMANOV'}
                <span
                  className="absolute inset-0 font-display text-4xl md:text-6xl lg:text-7xl font-bold uppercase leading-[1.1] tracking-[0.02em] opacity-50 select-none"
                  style={{
                    color: '#00D4FF',
                    transform: 'translateX(-2px)',
                    clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)',
                  }}
                  aria-hidden="true"
                >
                  {nameTyping.displayText || 'KAMRONBEK JUMANOV'}
                </span>
                <span
                  className="absolute inset-0 font-display text-4xl md:text-6xl lg:text-7xl font-bold uppercase leading-[1.1] tracking-[0.02em] opacity-50 select-none"
                  style={{
                    color: '#FF007F',
                    transform: 'translateX(2px)',
                    clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)',
                  }}
                  aria-hidden="true"
                >
                  {nameTyping.displayText || 'KAMRONBEK JUMANOV'}
                </span>
              </span>
            </h1>
            {nameTyping.showCursor && !nameTyping.isComplete && (
              <span className="text-[#00D4FF] animate-blink-cursor text-4xl md:text-6xl lg:text-7xl font-bold">
                _
              </span>
            )}
          </div>

          <div className="mb-6 min-h-[2rem]">
            <p
              className="font-display text-base md:text-xl lg:text-2xl font-normal tracking-[0.02em] text-white/80"
              style={{ opacity: roleTyping.displayText ? 1 : 0 }}
            >
              {roleTyping.displayText}
              {roleTyping.showCursor && (
                <span className="text-[#00D4FF] animate-blink-cursor">_</span>
              )}
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: roleTyping.isComplete ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4"
          >
            <SocialLinks />

            {/* Download CV Button */}
            <motion.a
              href="/assets/KamronbekJumanov_CV.docx"
              download="KamronbekJumanov_CV.docx"
              id="download-cv-btn"
              className="relative overflow-hidden flex items-center gap-2 px-5 py-2.5 rounded-full font-display font-semibold text-sm tracking-widest uppercase select-none cursor-pointer"
              style={{
                background: cvHovered
                  ? 'linear-gradient(135deg, rgba(0, 212, 255, 0.25), rgba(255, 0, 127, 0.15))'
                  : 'linear-gradient(135deg, rgba(0, 212, 255, 0.12), rgba(255, 0, 127, 0.08))',
                border: '1px solid rgba(0, 212, 255, 0.5)',
                color: '#00D4FF',
                boxShadow: cvHovered
                  ? '0 0 25px rgba(0, 212, 255, 0.5), inset 0 0 20px rgba(0, 212, 255, 0.05)'
                  : '0 0 10px rgba(0, 212, 255, 0.2)',
              }}
              onHoverStart={() => setCvHovered(true)}
              onHoverEnd={() => setCvHovered(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              {/* Shimmer sweep effect */}
              <motion.span
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(0, 212, 255, 0.15) 50%, transparent 100%)',
                  transform: 'skewX(-20deg)',
                }}
                animate={{ x: ['-200%', '300%'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
              />
              {/* Animated icon */}
              <motion.span
                animate={cvHovered ? { y: [0, -2, 0], rotate: [0, -10, 0] } : { y: 0 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
              >
                <Download size={15} />
              </motion.span>
              <span>Download CV</span>
              <motion.span
                animate={{ rotate: cvHovered ? 360 : 0, opacity: cvHovered ? 1 : 0.4 }}
                transition={{ duration: 0.5 }}
              >
                <Sparkles size={12} />
              </motion.span>
            </motion.a>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: roleTyping.isComplete ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <ScrollIndicator />
      </motion.div>
    </section>
  );
}
