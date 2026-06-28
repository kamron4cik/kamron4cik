import SectionLabel from '@/components/SectionLabel';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { motion } from 'framer-motion';
import { useLang } from '@/context/LangContext';

const experiences = [
  {
    role: 'Cybersecurity Programmer',
    company: 'Ministry of Internal Affairs of Uzbekistan',
    date: 'Apr 2025 – Aug 2025',
    description: 'Contributing to national-level cybersecurity infrastructure. Developing security tools and protocols for government systems. Working with classified networks and sensitive data protection.',
    logo: '/assets/logo-ministry-new.png',
    accent: '#A78BFA',
  },
  {
    role: 'Customer Support Specialist',
    company: 'Pharmastaff',
    date: 'Jan 2025 – Present',
    description: 'Providing technical support and customer service. Troubleshooting software issues and maintaining client relationships. Documenting common issues and solutions.',
    logo: '/assets/logo-pharmastaff-new.png',
    accent: '#34D399',
  },
  {
    role: 'Research Assistant',
    company: 'Self-Employed (Freelance)',
    date: 'May 2024 – Sep 2024',
    description: 'Assisting in academic research projects related to software engineering. Conducting literature reviews and experimental implementations.',
    logo: '/assets/about-photo-new.jpg',
    accent: '#F59E0B',
  },
  {
    role: 'Article Writer',
    company: 'Wikipedia',
    date: 'May 2023 – Sep 2023',
    description: 'Published articles on various technical topics. Contributing to open knowledge and technical documentation. Maintaining high editorial standards and citations.',
    logo: '/assets/logo-wikipedia-new.png',
    accent: '#FB7185',
  },
];

export default function ExperienceSection() {
  const { t } = useLang();
  const timelineRef = useScrollReveal<HTMLDivElement>({
    y: 40,
    stagger: 0.15,
    childSelector: '.timeline-item',
  });

  return (
    <section id="experience" className="w-full py-20 md:py-28 section-bg-gradient relative">
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

      <div className="max-w-[1000px] mx-auto px-5 md:px-10 relative z-10">
        <SectionLabel label={t.experience.label} subtitle={t.experience.subtitle} />

        <div ref={timelineRef} className="relative mt-16 pl-6 md:pl-0 flex flex-col gap-0 mt-2">
          {/* Vertical timeline line */}
          <div className="timeline-line" />

          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              className="timeline-item relative pl-12 pb-10 last:pb-0"
            >
              {/* Timeline dot */}
              <div
                className="timeline-dot"
                style={{
                  background: exp.accent,
                  boxShadow: `0 0 14px ${exp.accent}99`,
                }}
              />

              <motion.div
                className="aurora-card p-6 flex flex-col sm:flex-row gap-5"
                whileHover={{ y: -4, boxShadow: `0 8px 40px ${exp.accent}22` }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {/* Left accent bar */}
                <div
                  className="absolute left-0 top-5 bottom-5 w-[3px] rounded-full"
                  style={{ background: `linear-gradient(180deg, ${exp.accent}, transparent)` }}
                />

                {/* Logo */}
                <div className="flex-shrink-0">
                  <div
                    className="w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden flex items-center justify-center"
                    style={{ background: 'rgba(28, 24, 40, 0.8)', border: `1px solid ${exp.accent}33` }}
                  >
                    <img
                      src={exp.logo}
                      alt={exp.company}
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-display text-lg font-semibold text-white leading-tight">
                        {exp.role}
                      </h3>
                      <p className="font-display text-sm font-medium mt-0.5" style={{ color: exp.accent }}>
                        {exp.company}
                      </p>
                    </div>
                    <span className="amber-badge flex-shrink-0">{exp.date}</span>
                  </div>
                  <p className="font-body text-sm font-light leading-relaxed" style={{ color: 'rgba(240, 237, 248, 0.6)' }}>
                    {exp.description}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
