import { motion, AnimatePresence } from 'framer-motion';
import { useTypewriter } from '@/hooks/useTypewriter';

interface LoadingScreenProps {
  isVisible: boolean;
  progress: number;
}

export default function LoadingScreen({ isVisible, progress }: LoadingScreenProps) {
  const { displayText, showCursor } = useTypewriter({
    text: 'INITIALIZING PORTFOLIO',
    speed: 65,
    enabled: isVisible,
    hideCursorAfter: 0,
  });

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
          style={{ backgroundColor: '#0A0A0F' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
        >
          {/* Aurora background blobs */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(ellipse 60% 50% at 30% 40%, rgba(124, 58, 237, 0.12) 0%, transparent 60%),
                radial-gradient(ellipse 50% 40% at 70% 60%, rgba(245, 158, 11, 0.08) 0%, transparent 60%)
              `,
            }}
          />

          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(rgba(167, 139, 250, 0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(167, 139, 250, 0.5) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}
          />

          <div className="relative z-10 flex flex-col items-center gap-8">
            {/* Logo mark */}
            <div className="relative">
              <motion.div
                className="w-16 h-16 rounded-2xl flex items-center justify-center font-display font-bold text-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.15), rgba(245, 158, 11, 0.1))',
                  border: '1px solid rgba(167, 139, 250, 0.3)',
                  color: '#A78BFA',
                }}
                animate={{
                  boxShadow: [
                    '0 0 15px rgba(167, 139, 250, 0.3)',
                    '0 0 35px rgba(167, 139, 250, 0.6), 0 0 60px rgba(245, 158, 11, 0.15)',
                    '0 0 15px rgba(167, 139, 250, 0.3)',
                  ],
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                KJ
              </motion.div>
              {/* Orbiting dot */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              >
                <div
                  className="absolute top-0 left-1/2 w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1"
                  style={{
                    background: '#F59E0B',
                    boxShadow: '0 0 8px rgba(245, 158, 11, 0.9)',
                  }}
                />
              </motion.div>
            </div>

            {/* Typewriter line */}
            <div
              className="font-mono text-sm tracking-[0.2em] uppercase"
              style={{ color: 'rgba(167, 139, 250, 0.8)' }}
            >
              <span>{displayText}</span>
              {showCursor && (
                <span className="animate-blink-cursor" style={{ color: '#F59E0B' }}>_</span>
              )}
            </div>

            {/* Progress bar */}
            <div className="flex flex-col items-center gap-2 w-60">
              <div
                className="w-full h-[2px] rounded-full overflow-hidden"
                style={{ background: 'rgba(167, 139, 250, 0.1)' }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #A78BFA, #C084FC, #F59E0B)',
                    boxShadow: '0 0 8px rgba(167, 139, 250, 0.6)',
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div
                className="font-mono text-xs tabular-nums"
                style={{ color: 'rgba(240, 237, 248, 0.35)' }}
              >
                {progress.toString().padStart(3, '0')}%
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
