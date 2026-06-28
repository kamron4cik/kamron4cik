import SectionLabel from '@/components/SectionLabel';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { motion } from 'framer-motion';
import { useLang } from '@/context/LangContext';
import {
  Server,
  Code2,
  Container,
  Shield,
} from 'lucide-react';

const skillCategories = [
  {
    name: 'Backend',
    description: 'Server-side systems',
    icon: <Server size={20} />,
    color: '#A78BFA',
    skills: ['Java', 'Spring Boot', 'REST API', 'PostgreSQL', 'MySQL'],
    large: true,
  },
  {
    name: 'Languages',
    description: 'What I write in',
    icon: <Code2 size={20} />,
    color: '#F59E0B',
    skills: ['Java', 'Python', 'C++', 'SQL'],
    large: false,
  },
  {
    name: 'DevOps & Tools',
    description: 'Ship & automate',
    icon: <Container size={20} />,
    color: '#34D399',
    skills: ['Docker', 'Terraform', 'Ansible', 'CI/CD', 'Linux'],
    large: false,
  },
  {
    name: 'Security & Cloud',
    description: 'Protect & scale',
    icon: <Shield size={20} />,
    color: '#FB7185',
    skills: ['OSINT', 'Cryptography', 'Ethical Hacking', 'AWS', 'Azure'],
    large: true,
  },
];

export default function SkillsSection() {
  const { t } = useLang();
  const gridRef = useScrollReveal<HTMLDivElement>({
    y: 30,
    stagger: 0.12,
    childSelector: '.bento-item',
  });

  return (
    <section id="skills" className="w-full py-20 md:py-28 section-bg-gradient relative">
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
        <SectionLabel label={t.skills.label} subtitle={t.skills.subtitle} />

        {/* Bento grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2"
        >
          {skillCategories.map((cat) => (
            <motion.div
              key={cat.name}
              className={`bento-item bento-card ${cat.large ? 'lg:col-span-2' : 'lg:col-span-1'}`}
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 350, damping: 22 }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: `${cat.color}14`,
                    border: `1px solid ${cat.color}30`,
                    color: cat.color,
                  }}
                >
                  {cat.icon}
                </div>
                <div>
                  <div className="font-display text-base font-semibold text-white">{cat.name}</div>
                  <div className="font-body text-xs" style={{ color: 'rgba(240, 237, 248, 0.45)' }}>
                    {cat.description}
                  </div>
                </div>
              </div>

              {/* Skill tags */}
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <motion.span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-light cursor-default select-none"
                    style={{
                      background: `${cat.color}0d`,
                      border: `1px solid ${cat.color}28`,
                      color: 'rgba(240, 237, 248, 0.8)',
                    }}
                    whileHover={{
                      background: `${cat.color}1a`,
                      borderColor: `${cat.color}55`,
                      color: '#fff',
                      scale: 1.04,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Dot indicator */}
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: cat.color, opacity: 0.8 }}
                    />
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
