import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCompanion } from '@/hooks/useCompanion';

export default function CompanionToasts() {
  const newAchievement = useCompanion((state) => state.newAchievement);
  const clearNotification = useCompanion((state) => state.clearAchievementNotification);

  // Auto-hide after 5 seconds
  useEffect(() => {
    if (newAchievement) {
      const timer = setTimeout(() => {
        clearNotification();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [newAchievement, clearNotification]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
      <AnimatePresence>
        {newAchievement && (
          <motion.div
            key={newAchievement.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="glass-card flex items-center gap-4 p-4 pr-6 rounded-2xl shadow-2xl pointer-events-auto cursor-pointer"
            onClick={clearNotification}
            style={{
              background: 'rgba(10, 20, 40, 0.85)',
              border: '1px solid rgba(204, 255, 0, 0.3)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(204, 255, 0, 0.1)',
            }}
          >
            {/* Icon */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#CCFF00] to-[#00D4FF] flex items-center justify-center text-2xl shadow-inner">
              {newAchievement.icon}
            </div>

            {/* Content */}
            <div className="flex flex-col">
              <span className="text-[10px] font-display font-bold tracking-widest text-[#CCFF00] uppercase mb-0.5">
                Achievement Unlocked
              </span>
              <span className="text-white font-display font-semibold text-lg leading-tight">
                {newAchievement.title}
              </span>
              <span className="text-white/60 font-body text-sm mt-0.5">
                {newAchievement.description}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
