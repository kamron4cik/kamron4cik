import SectionLabel from '@/components/SectionLabel';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function AboutSection() {
  const photoRef = useScrollReveal<HTMLDivElement>({
    x: -50,
    y: 0,
    duration: 0.8,
  });
  const textRef = useScrollReveal<HTMLDivElement>({
    x: 50,
    y: 0,
    duration: 0.8,
    delay: 0.2,
  });

  return (
    <section className="w-full py-16 md:py-24 relative" style={{ backgroundColor: '#060B1A' }}>
      {/* Subtle grid overlay */}
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
        <SectionLabel label="ABOUT ME" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 mt-10">
          {/* Photo */}
          <div ref={photoRef} className="flex justify-center md:justify-start">
            <div className="relative group">
              <img
                src="/assets/about-photo-new.jpg"
                alt="Kamronbek Jumanov"
                className="w-full max-w-[400px] aspect-[3/4] object-cover rounded-2xl transition-all duration-500 group-hover:border-[rgba(0,212,255,0.6)]"
                style={{
                  border: '2px solid rgba(0, 212, 255, 0.3)',
                  boxShadow: '0 0 20px rgba(0, 212, 255, 0.15)',
                }}
              />
              <div
                className="absolute inset-0 rounded-2xl transition-all duration-500 opacity-0 group-hover:opacity-100 pointer-events-none"
                style={{
                  boxShadow: '0 0 30px rgba(0, 212, 255, 0.3), inset 0 0 30px rgba(0, 212, 255, 0.1)',
                }}
              />
            </div>
          </div>

          {/* Bio Text */}
          <div ref={textRef} className="flex items-center">
            <p className="font-body text-sm md:text-base lg:text-lg font-light leading-relaxed text-white/80">
              Hello! I'm Kamronbek Jumanov, a Software Engineering student at Inha University in Tashkent with a passion for AI and backend development. I specialize in building intelligent systems that solve real-world problems. Currently, I'm focused on AI integration in applications and developing robust backend infrastructure. When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, or envisioning the next big startup idea.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
