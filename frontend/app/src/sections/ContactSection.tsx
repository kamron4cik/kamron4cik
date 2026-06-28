import SectionLabel from '@/components/SectionLabel';
import HolographicTerminal from '@/components/HolographicTerminal';
import { motion } from 'framer-motion';
import { useLang } from '@/context/LangContext';

export default function ContactSection() {
  const { t } = useLang();
  return (
    <section id="contact" className="w-full py-20 md:py-28 relative" style={{ backgroundColor: '#0A0A0F' }}>
      {/* Aurora blobs */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 50% 60% at 50% 0%, rgba(124, 58, 237, 0.08) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 20% 100%, rgba(245, 158, 11, 0.05) 0%, transparent 60%)
          `,
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(167, 139, 250, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(167, 139, 250, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 0%, #0A0A0F 80%)' }}
      />

      <div className="max-w-[1200px] mx-auto px-5 md:px-10 relative z-10">
        <SectionLabel label={t.contact.label} subtitle={t.contact.subtitle} />

        {/* CTA headline */}
        <motion.div
          className="mb-10 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight mb-3">
            {t.contact.headline.start}
            <span className="aurora-text">{t.contact.headline.highlight}</span>
            {t.contact.headline.end}
          </h2>
          <p className="font-body text-base font-light" style={{ color: 'rgba(240, 237, 248, 0.55)' }}>
            {t.contact.sub}
          </p>
        </motion.div>

        <HolographicTerminal />
      </div>
    </section>
  );
}
