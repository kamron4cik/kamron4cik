import SectionLabel from '@/components/SectionLabel';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { motion } from 'framer-motion';
import { Code2, Layers, Zap } from 'lucide-react';
import { useLang } from '@/context/LangContext';

const stats = [
  { value: '2+', label: 'Years Coding', icon: <Code2 size={16} /> },
  { value: '5+', label: 'Projects Built', icon: <Layers size={16} /> },
  { value: '3', label: 'Internships', icon: <Zap size={16} /> },
];

export default function AboutSection() {
  const { t } = useLang();
  const photoRef = useScrollReveal<HTMLDivElement>({ x: -50, y: 0, duration: 0.9 });
  const textRef = useScrollReveal<HTMLDivElement>({ x: 50, y: 0, duration: 0.9, delay: 0.15 });
  const statsRef = useScrollReveal<HTMLDivElement>({ y: 30, duration: 0.7, delay: 0.35 });

  return (
    <section id="about" className="w-full py-20 md:py-28 relative" style={{ backgroundColor: '#0A0A0F' }}>
      {/* Aurora blobs */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 40% 50% at 5% 50%, rgba(124, 58, 237, 0.07) 0%, transparent 60%),
            radial-gradient(ellipse 30% 40% at 95% 30%, rgba(245, 158, 11, 0.05) 0%, transparent 60%)
          `,
        }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(167, 139, 250, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(167, 139, 250, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      <div className="max-w-[1200px] mx-auto px-5 md:px-10 relative z-10">
        <SectionLabel label={t.about.label} subtitle={t.about.subtitle} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 mt-2">
          {/* Photo */}
          <div ref={photoRef} className="flex justify-center md:justify-start">
            <div className="relative group w-full max-w-[360px]">
              {/* Angular decorative frame */}
              <div
                className="absolute -inset-3 rounded-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.15), transparent, rgba(245, 158, 11, 0.15))',
                }}
              />
              <div
                className="absolute -top-px -left-px w-12 h-12 pointer-events-none"
                style={{
                  borderTop: '2px solid #A78BFA',
                  borderLeft: '2px solid #A78BFA',
                  borderRadius: '12px 0 0 0',
                }}
              />
              <div
                className="absolute -bottom-px -right-px w-12 h-12 pointer-events-none"
                style={{
                  borderBottom: '2px solid #F59E0B',
                  borderRight: '2px solid #F59E0B',
                  borderRadius: '0 0 12px 0',
                }}
              />
              <img
                src="/assets/about-photo-new.jpg"
                alt="Kamronbek Jumanov"
                className="relative w-full aspect-[3/4] object-cover rounded-xl transition-all duration-500"
                style={{
                  border: '1px solid rgba(167, 139, 250, 0.2)',
                  boxShadow: '0 0 30px rgba(124, 58, 237, 0.12)',
                  filter: 'brightness(0.95) contrast(1.05)',
                }}
              />
              {/* Hover glow overlay */}
              <div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  boxShadow: 'inset 0 0 40px rgba(167, 139, 250, 0.12)',
                  background: 'linear-gradient(to bottom, transparent 60%, rgba(124, 58, 237, 0.15))',
                }}
              />
            </div>
          </div>

          {/* Text + Stats */}
          <div ref={textRef} className="flex flex-col justify-center gap-8">
            {/* Bio */}
            <div>
              {/* Quote decoration */}
              <div
                className="text-6xl font-display font-bold leading-none mb-2 select-none"
                style={{ color: 'rgba(167, 139, 250, 0.15)' }}
              >
                "
              </div>
              <p className="font-body text-base md:text-[17px] font-light leading-[1.8]" style={{ color: 'rgba(240, 237, 248, 0.75)' }}>
                {t.about.description}
              </p>
            </div>

            {/* Stats */}
            <div ref={statsRef} className="grid grid-cols-3 gap-4">
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  className="aurora-card p-4 flex flex-col items-center text-center gap-1"
                  whileHover={{ y: -3 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  <div style={{ color: '#A78BFA' }}>{stat.icon}</div>
                  <div className="font-display font-bold text-2xl aurora-text">{stat.value}</div>
                  <div className="font-body text-xs font-light" style={{ color: 'rgba(240, 237, 248, 0.5)' }}>
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
