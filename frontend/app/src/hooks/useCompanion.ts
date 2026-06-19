import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Mood, ACHIEVEMENTS, Achievement, GREETINGS, JOKES, FACTS, QUOTES, SPECIAL_INTERACTIONS } from '../lib/companionData';

interface CompanionState {
  clicks: number;
  unlockedAchievements: string[];
  currentMood: Mood;
  currentMessage: string | null;
  lastInteractionTime: number;
  newAchievement: Achievement | null;

  // Actions
  interact: () => void;
  clearAchievementNotification: () => void;
  dismissMessage: () => void;
  reset: () => void;
}

const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const useCompanion = create<CompanionState>()(
  persist(
    (set, get) => ({
      clicks: 0,
      unlockedAchievements: [],
      currentMood: 'neutral',
      currentMessage: null,
      lastInteractionTime: 0,
      newAchievement: null,

      interact: () => {
        const { clicks, unlockedAchievements } = get();
        const newClicks = clicks + 1;
        const now = Date.now();

        let message = '';
        let mood: Mood = 'happy';
        let newlyUnlocked: Achievement | null = null;

        // 1. Check for Achievements
        const achievement = ACHIEVEMENTS.find(a => a.requiredClicks === newClicks);
        if (achievement && !unlockedAchievements.includes(achievement.id)) {
          newlyUnlocked = achievement;
          unlockedAchievements.push(achievement.id);
        }

        // 2. Determine Response
        if (SPECIAL_INTERACTIONS[newClicks]) {
          // Milestone interaction
          const interaction = SPECIAL_INTERACTIONS[newClicks];
          message = interaction.text;
          mood = interaction.mood;
        } else {
          // Random interaction based on progression
          const rand = Math.random();
          let pool = GREETINGS;
          
          if (newClicks > 5) {
            // Unlocked jokes and facts
            if (rand < 0.33) pool = JOKES;
            else if (rand < 0.66) pool = FACTS;
            else pool = QUOTES;
          } else if (newClicks > 2) {
            // Unlocked just facts
            if (rand < 0.5) pool = FACTS;
            else pool = GREETINGS;
          }

          const response = getRandomItem(pool);
          message = response.text;
          mood = response.mood;
        }

        set({
          clicks: newClicks,
          currentMessage: message,
          currentMood: mood,
          lastInteractionTime: now,
          unlockedAchievements: [...unlockedAchievements],
          newAchievement: newlyUnlocked || get().newAchievement, // keep existing if not cleared
        });
      },

      clearAchievementNotification: () => set({ newAchievement: null }),
      
      dismissMessage: () => set({ currentMessage: null, currentMood: 'neutral' }),

      reset: () => set({
        clicks: 0,
        unlockedAchievements: [],
        currentMood: 'neutral',
        currentMessage: null,
        newAchievement: null,
        lastInteractionTime: 0,
      }),
    }),
    {
      name: 'robot-companion-storage',
      partialize: (state) => ({ 
        clicks: state.clicks, 
        unlockedAchievements: state.unlockedAchievements 
      }), // Only persist these fields
    }
  )
);
