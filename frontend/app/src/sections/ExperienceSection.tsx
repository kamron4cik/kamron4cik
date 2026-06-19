import SectionLabel from '@/components/SectionLabel';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { motion } from 'framer-motion';

const experiences = [
  {
    role: 'Cybersecurity Programmer',
    company: 'Ministry of Internal Affairs of Uzbekistan',
    date: 'Apr 2025 – Aug 2025',
    description: 'Contributing to national-level cybersecurity infrastructure. Developing security tools and protocols for government systems. Working with classified networks and sensitive data protection.',
    logo: '/assets/logo-ministry-new.png',
  },
  {
    role: 'Customer Support Specialist',
    company: 'Pharmastaff',
    date: 'Jan 2025 – Present',
    description: 'Providing technical support and customer service. Troubleshooting software issues and maintaining client relationships. Documenting common issues and solutions.',
    logo: '/assets/logo-pharmastaff-new.png',
  },
  {
    role: 'Research Assistant',
    company: 'Self-Employed (Freelance)',
    date: 'May 2024 – Sep 2024',
    description: 'Assisting in academic research projects related to software engineering. Conducting literature reviews and experimental implementations.',
    logo: '/assets/about-photo-new.jpg', // Using generic photo for self-employed
  },
  {
    role: 'Article Writer',
    company: 'Wikipedia',
    date: 'May 2023 – Sep 2023',
    description: 'Published articles on various technical topics. Contributing to open knowledge and technical documentation. Maintaining high editorial standards and citations.',
    logo: '/assets/logo-wikipedia-new.png',
  },
];

export default function ExperienceSection() {
  const timelineRef = useScrollReveal<HTMLDivElement>({
    y: 50,
    stagger: 0.15,
    childSelector: '.timeline-item',
  });

  return (
    <section className="w-full py-16 md:py-24 section-bg-gradient relative">
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
        <SectionLabel label="EXPERIENCE" />

        <div ref={timelineRef} className="mt-10 flex flex-col gap-8">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              className="timeline-item glass-card p-6 flex flex-col sm:flex-row gap-5"
              whileHover={{ y: -4, boxShadow: '0 0 20px rgba(0, 212, 255, 0.4)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {/* Logo */}
              <div className="flex-shrink-0">
                <img
                  src={exp.logo}
                  alt={exp.company}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-contain"
                  style={{ background: 'rgba(15, 27, 49, 0.8)' }}
                />
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="font-display text-lg md:text-xl font-semibold text-white mb-1">
                  {exp.role}
                </h3>
                <p className="font-display text-sm md:text-base font-normal text-[#00D4FF] mb-1">
                  {exp.company}
                </p>
                <p className="font-body text-xs md:text-sm font-light text-white/50 mb-2">
                  {exp.date}
                </p>
                <p className="font-body text-xs md:text-sm font-light text-white/60 leading-relaxed">
                  {exp.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
