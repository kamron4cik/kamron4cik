import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTypewriter } from '@/hooks/useTypewriter';
import SocialLinks from '@/components/SocialLinks';
import ScrollIndicator from '@/components/ScrollIndicator';
import HolographicScene from '@/3d/HolographicScene';
import { Download, Sparkles } from 'lucide-react';
import { useLang } from '@/context/LangContext';

interface HeroSectionProps {
  isActive: boolean;
}

export default function HeroSection({ isActive }: HeroSectionProps) {
  const { t } = useLang();
  const [sceneReady, setSceneReady] = useState(false);
  const [cvHovered, setCvHovered] = useState(false);

  const nameTyping = useTypewriter({
    text: 'KAMRONBEK JUMANOV',
    speed: 60,
    enabled: isActive && sceneReady,
  });

  const roleTyping = useTypewriter({
    text: t.hero.role,
    speed: 35,
    enabled: isActive && nameTyping.isComplete,
  });

  return (
    <section id="hero" className="relative w-full h-screen overflow-hidden">
      <HolographicScene onReady={() => setSceneReady(true)} />

      {/* New gradient overlay — richer and violet-tinted at bottom */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: `
            linear-gradient(
              to bottom,
              rgba(10, 10, 15, 0.15) 0%,
              rgba(10, 10, 15, 0.0) 40%,
              rgba(19, 17, 28, 0.65) 75%,
              rgba(10, 10, 15, 0.92) 100%
            )
          `,
        }}
      />

      {/* Subtle violet radial bloom */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 15% 90%, rgba(124, 58, 237, 0.18) 0%, transparent 70%)',
        }}
      />

      {/* Content */}
      <div className="absolute bottom-24 left-0 right-0 z-[2]">
        <div className="max-w-[1200px] mx-auto px-5 md:px-10">

          {/* Name */}
          <div className="relative mb-3">
            <h1
              className="font-display text-4xl md:text-[62px] lg:text-[76px] font-bold uppercase leading-[1.05] tracking-[-0.01em] aurora-text animate-pulse-glow select-none"
              style={{ opacity: nameTyping.displayText ? 1 : 0 }}
            >
              {nameTyping.displayText || 'KAMRONBEK JUMANOV'}
            </h1>
            {nameTyping.showCursor && !nameTyping.isComplete && (
              <span
                className="animate-blink-cursor text-4xl md:text-[62px] lg:text-[76px] font-bold font-display"
                style={{ color: '#F59E0B' }}
              >
                _
              </span>
            )}
          </div>

          {/* Role — monospace */}
          <div className="mb-7 min-h-[1.75rem]">
            <p
              className="font-mono text-sm md:text-base lg:text-lg font-light tracking-wide"
              style={{
                color: 'rgba(240, 237, 248, 0.65)',
                opacity: roleTyping.displayText ? 1 : 0,
              }}
            >
              {roleTyping.displayText}
              {roleTyping.showCursor && (
                <span className="animate-blink-cursor" style={{ color: '#A78BFA' }}>_</span>
              )}
            </p>
          </div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: roleTyping.isComplete ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4"
          >
            <SocialLinks />

            {/* Download CV */}
            <motion.a
              href="/assets/KamronbekJumanov_CV.docx"
              download="KamronbekJumanov_CV.docx"
              id="download-cv-btn"
              className="relative overflow-hidden flex items-center gap-2 px-5 py-2.5 rounded-full font-display font-semibold text-sm tracking-widest uppercase select-none cursor-pointer"
              style={{
                background: cvHovered
                  ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.22), rgba(167, 139, 250, 0.15))'
                  : 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(167, 139, 250, 0.08))',
                border: '1px solid rgba(245, 158, 11, 0.45)',
                color: '#F59E0B',
                boxShadow: cvHovered
                  ? '0 0 28px rgba(245, 158, 11, 0.45), inset 0 0 20px rgba(245, 158, 11, 0.05)'
                  : '0 0 10px rgba(245, 158, 11, 0.15)',
              }}
              onHoverStart={() => setCvHovered(true)}
              onHoverEnd={() => setCvHovered(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              {/* Shimmer */}
              <motion.span
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(245, 158, 11, 0.18) 50%, transparent 100%)',
                  transform: 'skewX(-20deg)',
                }}
                animate={{ x: ['-200%', '300%'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 1.2 }}
              />
              <motion.span
                animate={cvHovered ? { y: [0, -2, 0], rotate: [0, -10, 0] } : { y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Download size={15} />
              </motion.span>
              <span>{t.hero.cv}</span>
              <motion.span
                animate={{ rotate: cvHovered ? 360 : 0, opacity: cvHovered ? 1 : 0.5 }}
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
        transition={{ duration: 0.5, delay: 1.2 }}
      >
        <ScrollIndicator />
      </motion.div>
    </section>
  );
}
