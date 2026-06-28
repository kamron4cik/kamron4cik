import SectionLabel from '@/components/SectionLabel';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Github, ExternalLink, Gamepad2, Lock } from 'lucide-react';
import { useRef } from 'react';

const projects = [
  {
    title: '2D Adventure Game',
    description: 'A classic tile-based Java Swing adventure game with 60 FPS gameplay, sprite animations, collision detection, dynamic character switching (Boy/Girl), collectible items (keys, medals, chests), background music & Despacito easter egg on medal pickup!',
    tech: ['Java', 'Java Swing', 'Tile Engine', 'Sound API', 'OOP'],
    image: '/assets/project-javagame.png',
    links: { github: 'https://github.com/kamron4cik/MyJavaGame' },
    badge: 'FEATURED',
    accent: '#A78BFA',
    featured: true,
  },
  {
    title: 'Oromland',
    description: 'National platform helping families discover and book children\'s camps and sanatoriums in Uzbekistan. Built with Spring Boot backend, PostgreSQL database, and Angular frontend.',
    tech: ['Spring Boot', 'PostgreSQL', 'Angular', 'JWT', 'Docker'],
    image: '/assets/project-oromland.jpg',
    links: { github: 'https://github.com/kamron4cik/oromland', live: 'https://oromland.uz' },
    badge: null,
    accent: '#34D399',
    featured: false,
  },
  {
    title: 'Quiz Bot Platform',
    description: 'Telegram-based educational testing platform. Features question categories, analytics, payment integration, leaderboards, and comprehensive admin controls.',
    tech: ['Java', 'Telegram API', 'PostgreSQL', 'Spring Boot'],
    image: '/assets/project-quizbot.jpg',
    links: { github: 'https://github.com/kamron4cik/quiz-bot' },
    badge: null,
    accent: '#F59E0B',
    featured: false,
  },
  {
    title: 'Cybersecurity Internal Tools',
    description: 'Internal security tools developed during Ministry of Internal Affairs internship. Classified project with futuristic security visualization interface.',
    tech: ['Python', 'Security APIs', 'Encryption'],
    image: '/assets/project-cybersec.jpg',
    links: { github: 'https://github.com/kamron4cik/cybersec-tools' },
    badge: 'CLASSIFIED',
    accent: '#FB7185',
    featured: false,
  },
  {
    title: 'AI Experiments',
    description: 'Collection of AI and automation experiments including machine learning models, natural language processing tools, and intelligent system prototypes.',
    tech: ['Python', 'TensorFlow', 'OpenAI API'],
    image: '/assets/project-ai.jpg',
    links: { github: 'https://github.com/kamron4cik/ai-experiments' },
    badge: null,
    accent: '#60A5FA',
    featured: false,
  },
];

function TiltCard({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], ['7deg', '-7deg']);
  const rotateY = useTransform(x, [-0.5, 0.5], ['-7deg', '7deg']);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const reset = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      className={`tilt-card ${className ?? ''}`}
      style={{ rotateX, rotateY, ...style }}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      whileHover={{ scale: 1.015 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      {children}
    </motion.div>
  );
}

export default function ProjectsSection() {
  const gridRef = useScrollReveal<HTMLDivElement>({
    y: 50,
    stagger: 0.18,
    childSelector: '.project-card',
  });

  const featured = projects[0];
  const rest = projects.slice(1);

  return (
    <section id="projects" className="w-full py-20 md:py-28 relative" style={{ backgroundColor: '#0A0A0F' }}>
      {/* Aurora blobs */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 50% 60% at 80% 20%, rgba(124, 58, 237, 0.07) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 10% 80%, rgba(245, 158, 11, 0.05) 0%, transparent 60%)
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
        <SectionLabel label="Projects" subtitle="Things I've Built" />

        <div ref={gridRef} className="flex flex-col gap-8 mt-2">
          {/* Featured project */}
          <TiltCard className="project-card">
            <div
              className="aurora-card overflow-hidden"
              style={{ borderColor: 'rgba(167, 139, 250, 0.2)' }}
            >
              {/* Spotlight glow */}
              <div
                className="absolute inset-0 pointer-events-none rounded-[20px]"
                style={{
                  background: 'radial-gradient(ellipse 50% 60% at 50% 0%, rgba(167, 139, 250, 0.08) 0%, transparent 70%)',
                }}
              />

              <div className="md:grid md:grid-cols-5">
                {/* Image */}
                <div className="md:col-span-3 relative overflow-hidden aspect-video md:aspect-auto md:min-h-[280px]">
                  <img
                    src={featured.image}
                    alt={featured.title}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#13111C] opacity-30 md:opacity-70" />

                  {/* Featured badge */}
                  <motion.div
                    className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-display font-semibold tracking-widest"
                    style={{
                      background: 'rgba(10, 10, 15, 0.8)',
                      border: '1px solid rgba(167, 139, 250, 0.5)',
                      color: '#A78BFA',
                      boxShadow: '0 0 15px rgba(167, 139, 250, 0.3)',
                    }}
                    animate={{ boxShadow: ['0 0 10px rgba(167, 139, 250, 0.3)', '0 0 25px rgba(167, 139, 250, 0.6)', '0 0 10px rgba(167, 139, 250, 0.3)'] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  >
                    <Gamepad2 size={12} />
                    {featured.badge}
                  </motion.div>
                </div>

                {/* Content */}
                <div className="md:col-span-2 p-6 flex flex-col justify-between gap-4">
                  <div>
                    <h3 className="font-display text-2xl font-bold text-white mb-2">{featured.title}</h3>
                    <p className="font-body text-sm font-light leading-relaxed" style={{ color: 'rgba(240, 237, 248, 0.65)' }}>
                      {featured.description}
                    </p>
                  </div>
                  <div>
                    <div className="flex flex-wrap gap-2 mb-5">
                      {featured.tech.map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-1 text-xs font-mono rounded-lg"
                          style={{
                            background: 'rgba(167, 139, 250, 0.08)',
                            border: '1px solid rgba(167, 139, 250, 0.2)',
                            color: 'rgba(240, 237, 248, 0.75)',
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      {featured.links.github && (
                        <motion.a
                          href={featured.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-display font-semibold tracking-wider"
                          style={{
                            background: 'rgba(167, 139, 250, 0.1)',
                            border: '1px solid rgba(167, 139, 250, 0.3)',
                            color: '#A78BFA',
                          }}
                          whileHover={{ background: 'rgba(167, 139, 250, 0.2)', scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Github size={14} />
                          VIEW CODE
                        </motion.a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TiltCard>

          {/* Other projects grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rest.map((project, index) => (
              <TiltCard key={index} className="project-card">
                <div className="aurora-card overflow-hidden h-full" style={{ borderColor: `${project.accent}22` }}>
                  {/* Image */}
                  <div className="relative overflow-hidden aspect-video">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: `linear-gradient(to bottom, transparent 40%, #13111C 100%)` }}
                    />
                    {project.badge && (
                      <div
                        className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-medium"
                        style={{
                          background: `${project.accent}14`,
                          border: `1px solid ${project.accent}44`,
                          color: project.accent,
                        }}
                      >
                        <Lock size={9} />
                        {project.badge}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-display text-lg font-semibold text-white mb-1.5">{project.title}</h3>
                    <p className="font-body text-sm font-light leading-relaxed mb-4 line-clamp-2" style={{ color: 'rgba(240, 237, 248, 0.6)' }}>
                      {project.description}
                    </p>

                    {/* Tech */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 text-[11px] font-mono rounded-md"
                          style={{
                            background: `${project.accent}0d`,
                            border: `1px solid ${project.accent}28`,
                            color: 'rgba(240, 237, 248, 0.7)',
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Links */}
                    <div className="flex gap-2">
                      {project.links.github && (
                        <motion.a
                          href={project.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-display font-medium tracking-wide"
                          style={{
                            background: `${project.accent}10`,
                            border: `1px solid ${project.accent}30`,
                            color: project.accent,
                          }}
                          whileHover={{ scale: 1.05, background: `${project.accent}20` }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Github size={13} />
                          Code
                        </motion.a>
                      )}
                      {project.links.live && (
                        <motion.a
                          href={project.links.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-display font-medium tracking-wide"
                          style={{
                            background: 'rgba(245, 158, 11, 0.1)',
                            border: '1px solid rgba(245, 158, 11, 0.3)',
                            color: '#F59E0B',
                          }}
                          whileHover={{ scale: 1.05, background: 'rgba(245, 158, 11, 0.2)' }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <ExternalLink size={13} />
                          Live Demo
                        </motion.a>
                      )}
                    </div>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
