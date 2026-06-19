import SectionLabel from '@/components/SectionLabel';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { motion } from 'framer-motion';

const education = [
  {
    degree: 'Bachelor of Science in Computer Science (Software Engineering)',
    institution: 'Inha University in Tashkent',
    date: '2023 – 2027 (Expected)',
    description: 'Majoring in Software Engineering with focus on AI systems, backend development, and cloud infrastructure. Relevant coursework: Data Structures, Algorithms, Database Systems, Machine Learning, Computer Networks.',
    logo: '/assets/logo-inha-new.png',
  },
  {
    degree: 'Backend Development Bootcamp',
    institution: 'PDP Academy',
    date: '2024',
    description: 'Intensive hands-on training in backend development. Learned Java, Spring Boot, RESTful API design, database management, and microservices architecture. Built multiple production-ready applications.',
    logo: '/assets/logo-pdp-new.png',
  },
  {
    degree: 'Proxima DevOps Selection Program',
    institution: 'Proxima',
    date: '2025',
    description: 'Selected among top 25 candidates from 200+ applicants for an intensive DevOps training program. Learning Docker, Kubernetes, CI/CD pipelines, Terraform, cloud infrastructure, and system administration.',
    logo: '/assets/logo-proxima.png',
  },
];

export default function EducationSection() {
  const timelineRef = useScrollReveal<HTMLDivElement>({
    y: 50,
    stagger: 0.15,
    childSelector: '.timeline-item',
  });

  return (
    <section className="w-full py-16 md:py-24 relative" style={{ backgroundColor: '#060B1A' }}>
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 212, 255, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 212, 255, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-[1200px] mx-auto px-5 md:px-10 relative z-10">
        <SectionLabel label="EDUCATION" />

        <div ref={timelineRef} className="mt-10 flex flex-col gap-8">
          {education.map((edu, index) => (
            <motion.div
              key={index}
              className="timeline-item glass-card p-6 flex flex-col sm:flex-row gap-5"
              whileHover={{ y: -4, boxShadow: '0 0 20px rgba(0, 212, 255, 0.4)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {/* Logo */}
              <div className="flex-shrink-0">
                <img
                  src={edu.logo}
                  alt={edu.institution}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-contain"
                  style={{ background: 'rgba(15, 27, 49, 0.8)' }}
                />
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="font-display text-lg md:text-xl font-semibold text-white mb-1">
                  {edu.degree}
                </h3>
                <p className="font-display text-sm md:text-base font-normal text-[#00D4FF] mb-1">
                  {edu.institution}
                </p>
                <p className="font-body text-xs md:text-sm font-light text-white/50 mb-2">
                  {edu.date}
                </p>
                <p className="font-body text-xs md:text-sm font-light text-white/60 leading-relaxed">
                  {edu.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
