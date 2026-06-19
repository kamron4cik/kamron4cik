import SectionLabel from '@/components/SectionLabel';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import SkillTag from '@/components/SkillTag';
import {
  Server,
  Code2,
  Database,
  Globe,
  Container,
  Cloud,
  Shield,
  Terminal,
  Cpu,
  Lock,
  Bug,
  Workflow,
  Braces,
  FileCode,
  Layers,
} from 'lucide-react';

const skillCategories = [
  {
    name: 'Backend Development',
    skills: [
      { name: 'Java', icon: <Braces size={16} /> },
      { name: 'Spring Boot', icon: <Server size={16} /> },
      { name: 'REST API', icon: <Globe size={16} /> },
      { name: 'PostgreSQL', icon: <Database size={16} /> },
      { name: 'MySQL', icon: <Database size={16} /> },
    ],
  },
  {
    name: 'Programming Languages',
    skills: [
      { name: 'Java', icon: <FileCode size={16} /> },
      { name: 'Python', icon: <Code2 size={16} /> },
      { name: 'C++', icon: <Cpu size={16} /> },
      { name: 'SQL', icon: <Database size={16} /> },
    ],
  },
  {
    name: 'DevOps & Tools',
    skills: [
      { name: 'Docker', icon: <Container size={16} /> },
      { name: 'Terraform', icon: <Layers size={16} /> },
      { name: 'Ansible', icon: <Terminal size={16} /> },
      { name: 'CI/CD', icon: <Workflow size={16} /> },
      { name: 'Linux', icon: <Terminal size={16} /> },
    ],
  },
  {
    name: 'Cybersecurity & Cloud',
    skills: [
      { name: 'OSINT', icon: <Shield size={16} /> },
      { name: 'Cryptography', icon: <Lock size={16} /> },
      { name: 'Ethical Hacking', icon: <Bug size={16} /> },
      { name: 'AWS', icon: <Cloud size={16} /> },
      { name: 'Azure', icon: <Cloud size={16} /> },
      { name: 'Cloud Infrastructure', icon: <Server size={16} /> },
    ],
  },
];

export default function SkillsSection() {
  const gridRef = useScrollReveal<HTMLDivElement>({
    y: 30,
    stagger: 0.15,
    childSelector: '.skill-category',
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
        <SectionLabel label="SKILLS" />

        <div
          ref={gridRef}
          className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {skillCategories.map((category) => (
            <div key={category.name} className="skill-category">
              <h3 className="font-display text-lg md:text-xl font-semibold text-white mb-6 relative">
                {category.name}
                <span className="absolute bottom-[-8px] left-0 w-10 h-0.5 bg-[#00D4FF]" />
              </h3>
              <div className="flex flex-wrap gap-3">
                {category.skills.map((skill) => (
                  <SkillTag key={skill.name} name={skill.name} icon={skill.icon} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
