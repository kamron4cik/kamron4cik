import SectionLabel from '@/components/SectionLabel';
import HolographicTerminal from '@/components/HolographicTerminal';

export default function ContactSection() {
  return (
    <section className="w-full py-16 md:py-24 relative" style={{ backgroundColor: '#060B1A' }}>
      {/* Grid overlay - more prominent */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 212, 255, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 212, 255, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Vignette effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, #060B1A 80%)',
        }}
      />

      <div className="max-w-[1200px] mx-auto px-5 md:px-10 relative z-10">
        <SectionLabel label="CONTACT" />

        <div className="mt-10">
          <HolographicTerminal />
        </div>
      </div>
    </section>
  );
}
