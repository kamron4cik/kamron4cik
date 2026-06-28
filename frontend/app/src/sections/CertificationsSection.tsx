import SectionLabel from '@/components/SectionLabel';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useLang } from '@/context/LangContext';

const certificates = [
  { title: 'SQL (Basic)', issuer: 'HackerRank', date: '2024', logo: '/assets/logo-hackerrank.png', level: 1 },
  { title: 'SQL (Intermediate)', issuer: 'HackerRank', date: '2024', logo: '/assets/logo-hackerrank.png', level: 2 },
  { title: 'SQL (Advanced)', issuer: 'HackerRank', date: '2024', logo: '/assets/logo-hackerrank.png', level: 3 },
  { title: 'Java (Basic)', issuer: 'HackerRank', date: '2024', logo: '/assets/logo-hackerrank.png', level: 1 },
  { title: 'Problem Solving (Basic)', issuer: 'HackerRank', date: '2024', logo: '/assets/logo-hackerrank.png', level: 1 },
  { title: 'Problem Solving (Intermediate)', issuer: 'HackerRank', date: '2024', logo: '/assets/logo-hackerrank.png', level: 2 },
];

const levelColor: Record<number, string> = {
  1: '#34D399',
  2: '#F59E0B',
  3: '#A78BFA',
};

const levelLabel: Record<number, string> = {
  1: 'Basic',
  2: 'Intermediate',
  3: 'Advanced',
};

export default function CertificationsSection() {
  const { t } = useLang();
  const gridRef = useScrollReveal<HTMLDivElement>({
    scale: 0.92,
    y: 24,
    stagger: 0.09,
    childSelector: '.cert-card',
  });

  return (
    <section id="certifications" className="w-full py-20 md:py-28 section-bg-gradient relative">
      {/* Grid overlay */}
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
        <SectionLabel label={t.certifications.label} subtitle={t.certifications.subtitle} />

        <div
          ref={gridRef}
          className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {certificates.map((cert, index) => {
            const color = levelColor[cert.level];
            return (
              <motion.div
                key={index}
                className="cert-card aurora-card p-5 flex gap-4 items-start"
                whileHover={{ y: -5, boxShadow: `0 8px 40px ${color}20` }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{ borderColor: `${color}18` }}
              >
                {/* Left: logo + checkmark */}
                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                  <div
                    className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center"
                    style={{ background: 'rgba(28, 24, 40, 0.9)', border: `1px solid ${color}28` }}
                  >
                    <img src={cert.logo} alt={cert.issuer} className="w-8 h-8 object-contain" />
                  </div>
                  <CheckCircle2 size={16} style={{ color: '#34D399' }} />
                </div>

                {/* Right: details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-base font-semibold text-white leading-tight mb-1">{cert.title}</h3>
                  <p className="font-body text-xs" style={{ color: 'rgba(240, 237, 248, 0.5)' }}>
                    {cert.issuer} · {cert.date}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    {/* Level badge */}
                    <span
                      className="font-mono text-[10px] font-medium px-2.5 py-1 rounded-full"
                      style={{
                        background: `${color}12`,
                        border: `1px solid ${color}30`,
                        color: color,
                      }}
                    >
                      {levelLabel[cert.level]}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
