import SectionLabel from '@/components/SectionLabel';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

const education = [
  {
    degree: 'B.Sc. Computer Science — Software Engineering',
    institution: 'Inha University in Tashkent',
    date: '2023 – 2027',
    description: 'Majoring in Software Engineering with focus on AI systems, backend development, and cloud infrastructure. Relevant coursework: Data Structures, Algorithms, Database Systems, Machine Learning, Computer Networks.',
    logo: '/assets/logo-inha-new.png',
    accent: '#A78BFA',
    tag: 'Degree',
  },
  {
    degree: 'Backend Development Bootcamp',
    institution: 'PDP Academy',
    date: '2024',
    description: 'Intensive hands-on training in backend development. Learned Java, Spring Boot, RESTful API design, database management, and microservices architecture. Built multiple production-ready applications.',
    logo: '/assets/logo-pdp-new.png',
    accent: '#F59E0B',
    tag: 'Bootcamp',
  },
  {
    degree: 'Proxima DevOps Selection Program',
    institution: 'Proxima',
    date: '2025',
    description: 'Selected among top 25 candidates from 200+ applicants for an intensive DevOps training program. Learning Docker, Kubernetes, CI/CD pipelines, Terraform, cloud infrastructure, and system administration.',
    logo: '/assets/logo-proxima.png',
    accent: '#34D399',
    tag: 'Top 25 / 200+',
  },
];

export default function EducationSection() {
  const timelineRef = useScrollReveal<HTMLDivElement>({
    y: 40,
    stagger: 0.15,
    childSelector: '.timeline-item',
  });

  return (
    <section id="education" className="w-full py-20 md:py-28 relative" style={{ backgroundColor: '#0A0A0F' }}>
      {/* Aurora blobs */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 40% 50% at 95% 50%, rgba(124, 58, 237, 0.06) 0%, transparent 60%),
            radial-gradient(ellipse 30% 40% at 5% 70%, rgba(245, 158, 11, 0.04) 0%, transparent 60%)
          `,
        }}
      />

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
        <SectionLabel label="Education" subtitle="Academic Background" />

        <div ref={timelineRef} className="relative flex flex-col gap-0 mt-2">
          {/* Vertical timeline line */}
          <div className="timeline-line" />

          {education.map((edu, index) => (
            <motion.div
              key={index}
              className="timeline-item relative pl-12 pb-10 last:pb-0"
            >
              {/* Timeline dot */}
              <div
                className="timeline-dot"
                style={{
                  background: edu.accent,
                  boxShadow: `0 0 14px ${edu.accent}99`,
                }}
              />

              <motion.div
                className="aurora-card p-6 flex flex-col sm:flex-row gap-5"
                whileHover={{ y: -4, boxShadow: `0 8px 40px ${edu.accent}22` }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {/* Accent left bar */}
                <div
                  className="absolute left-0 top-5 bottom-5 w-[3px] rounded-full"
                  style={{ background: `linear-gradient(180deg, ${edu.accent}, transparent)` }}
                />

                {/* Icon / Logo */}
                <div className="flex-shrink-0">
                  <div
                    className="w-14 h-14 rounded-xl overflow-hidden flex items-center justify-center"
                    style={{ background: 'rgba(28, 24, 40, 0.8)', border: `1px solid ${edu.accent}33` }}
                  >
                    <img src={edu.logo} alt={edu.institution} className="w-10 h-10 object-contain" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-display text-lg font-semibold text-white leading-tight">
                        {edu.degree}
                      </h3>
                      <p className="font-display text-sm font-medium mt-0.5" style={{ color: edu.accent }}>
                        {edu.institution}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="amber-badge">{edu.date}</span>
                      <span
                        className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full"
                        style={{
                          background: `${edu.accent}14`,
                          border: `1px solid ${edu.accent}33`,
                          color: edu.accent,
                        }}
                      >
                        {edu.tag}
                      </span>
                    </div>
                  </div>
                  <p className="font-body text-sm font-light leading-relaxed" style={{ color: 'rgba(240, 237, 248, 0.6)' }}>
                    {edu.description}
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
