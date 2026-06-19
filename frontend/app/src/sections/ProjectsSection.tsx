import SectionLabel from '@/components/SectionLabel';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Gamepad2 } from 'lucide-react';

const projects = [
  {
    title: '2D Adventure Game',
    description: 'A classic tile-based Java Swing adventure game with 60 FPS gameplay, sprite animations, collision detection, dynamic character switching (Boy/Girl), collectible items (keys, medals, chests), background music & Despacito easter egg on medal pickup!',
    tech: ['Java', 'Java Swing', 'Tile Engine', 'Sound API', 'OOP'],
    image: '/assets/project-javagame.png',
    links: { github: 'https://github.com/kamron4cik/MyJavaGame' },
    badge: '🎮 FEATURED',
    badgeColor: '#CCFF00',
  },
  {
    title: 'Oromland',
    description: 'National platform helping families discover and book children\'s camps and sanatoriums in Uzbekistan. Built with Spring Boot backend, PostgreSQL database, and Angular frontend.',
    tech: ['Spring Boot', 'PostgreSQL', 'Angular', 'JWT', 'Docker'],
    image: '/assets/project-oromland.jpg',
    links: { github: 'https://github.com/kamron4cik/oromland', live: 'https://oromland.uz' },
    badge: null,
    badgeColor: null,
  },
  {
    title: 'Quiz Bot Platform',
    description: 'Telegram-based educational testing platform. Features question categories, analytics, payment integration, leaderboards, and comprehensive admin controls.',
    tech: ['Java', 'Telegram API', 'PostgreSQL', 'Spring Boot'],
    image: '/assets/project-quizbot.jpg',
    links: { github: 'https://github.com/kamron4cik/quiz-bot' },
    badge: null,
    badgeColor: null,
  },
  {
    title: 'Cybersecurity Internal Tools',
    description: 'Internal security tools developed during Ministry of Internal Affairs internship. Classified project with futuristic security visualization interface.',
    tech: ['Python', 'Security APIs', 'Encryption'],
    image: '/assets/project-cybersec.jpg',
    links: { github: 'https://github.com/kamron4cik/cybersec-tools' },
    badge: null,
    badgeColor: null,
  },
  {
    title: 'AI Experiments',
    description: 'Collection of AI and automation experiments including machine learning models, natural language processing tools, and intelligent system prototypes.',
    tech: ['Python', 'TensorFlow', 'OpenAI API'],
    image: '/assets/project-ai.jpg',
    links: { github: 'https://github.com/kamron4cik/ai-experiments' },
    badge: null,
    badgeColor: null,
  },
];

export default function ProjectsSection() {
  const gridRef = useScrollReveal<HTMLDivElement>({
    y: 50,
    stagger: 0.2,
    childSelector: '.project-card',
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
        <SectionLabel label="PROJECTS" />

        <div
          ref={gridRef}
          className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {projects.map((project, index) => (
            <motion.div
              key={index}
              className={`project-card glass-card overflow-hidden group ${index === 0 ? 'md:col-span-2' : ''}`}
              whileHover={{ y: -8, boxShadow: project.badge ? '0 0 40px rgba(204, 255, 0, 0.3), 0 0 80px rgba(0, 212, 255, 0.2)' : '0 0 30px rgba(0, 212, 255, 0.5)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              style={project.badge ? { borderColor: 'rgba(204, 255, 0, 0.25)' } : {}}
            >
              {/* Image */}
              <div className={`relative overflow-hidden ${index === 0 ? 'aspect-video md:aspect-[21/9]' : 'aspect-video'}`}>
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F1B31] to-transparent opacity-60" />
                {/* Badge */}
                {project.badge && (
                  <motion.div
                    className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-display font-semibold tracking-widest"
                    style={{
                      background: 'rgba(10, 20, 40, 0.85)',
                      border: `1px solid ${project.badgeColor}`,
                      color: project.badgeColor!,
                      boxShadow: `0 0 12px ${project.badgeColor}55`,
                    }}
                    animate={{ boxShadow: [`0 0 8px ${project.badgeColor}44`, `0 0 20px ${project.badgeColor}88`, `0 0 8px ${project.badgeColor}44`] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Gamepad2 size={12} />
                    {project.badge}
                  </motion.div>
                )}
              </div>

              {/* Content */}
              <div className={`p-6 ${index === 0 ? 'md:flex md:gap-8 md:items-start' : ''}`}>
                <div className={index === 0 ? 'md:flex-1' : ''}>
                  <h3 className="font-display text-xl md:text-[22px] font-semibold text-white mb-2">
                    {project.title}
                  </h3>
                  <p className="font-body text-sm font-light text-white/60 leading-relaxed mb-4 line-clamp-3">
                    {project.description}
                  </p>
                </div>

                <div className={index === 0 ? 'md:flex-1' : ''}>
                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 text-xs font-body font-light rounded-md"
                        style={{
                          background: project.badge ? 'rgba(204, 255, 0, 0.06)' : 'rgba(0, 212, 255, 0.08)',
                          border: `1px solid ${project.badge ? 'rgba(204, 255, 0, 0.2)' : 'rgba(0, 212, 255, 0.2)'}`,
                          color: 'rgba(255, 255, 255, 0.8)',
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex gap-3">
                    {project.links.github && (
                      <motion.a
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-display font-medium tracking-wider transition-all duration-300"
                        style={{
                          background: 'rgba(0, 212, 255, 0.1)',
                          border: '1px solid rgba(0, 212, 255, 0.3)',
                          color: '#00D4FF',
                        }}
                        whileHover={{ scale: 1.05, background: 'rgba(0, 212, 255, 0.2)' }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Github size={14} />
                        VIEW CODE
                      </motion.a>
                    )}
                    {project.links.live && (
                      <motion.a
                        href={project.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-display font-medium tracking-wider transition-all duration-300"
                        style={{
                          background: 'rgba(255, 0, 127, 0.1)',
                          border: '1px solid rgba(255, 0, 127, 0.3)',
                          color: '#FF007F',
                        }}
                        whileHover={{ scale: 1.05, background: 'rgba(255, 0, 127, 0.2)' }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ExternalLink size={14} />
                        LIVE DEMO
                      </motion.a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
