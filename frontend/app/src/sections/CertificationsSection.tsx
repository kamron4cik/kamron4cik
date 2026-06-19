import SectionLabel from '@/components/SectionLabel';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { motion } from 'framer-motion';

const certificates = [
  { title: 'SQL (Basic)', issuer: 'HackerRank', date: '2024', logo: '/assets/logo-hackerrank.png' },
  { title: 'SQL (Intermediate)', issuer: 'HackerRank', date: '2024', logo: '/assets/logo-hackerrank.png' },
  { title: 'SQL (Advanced)', issuer: 'HackerRank', date: '2024', logo: '/assets/logo-hackerrank.png' },
  { title: 'Java (Basic)', issuer: 'HackerRank', date: '2024', logo: '/assets/logo-hackerrank.png' },
  { title: 'Problem Solving (Basic)', issuer: 'HackerRank', date: '2024', logo: '/assets/logo-hackerrank.png' },
  { title: 'Problem Solving (Intermediate)', issuer: 'HackerRank', date: '2024', logo: '/assets/logo-hackerrank.png' },
];

export default function CertificationsSection() {
  const gridRef = useScrollReveal<HTMLDivElement>({
    scale: 0.9,
    y: 30,
    stagger: 0.1,
    childSelector: '.cert-card',
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
        <SectionLabel label="CERTIFICATIONS" />

        <div
          ref={gridRef}
          className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {certificates.map((cert, index) => (
            <motion.div
              key={index}
              className="cert-card glass-card p-5 flex flex-col items-center text-center"
              whileHover={{ y: -4, boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {/* Logo */}
              <img
                src={cert.logo}
                alt={cert.issuer}
                className="w-14 h-14 md:w-16 md:h-16 rounded-lg object-contain mb-4"
              />

              {/* Title */}
              <h3 className="font-display text-base font-semibold text-white mb-1">
                {cert.title}
              </h3>

              {/* Date */}
              <p className="font-body text-xs font-light text-white/50 mb-4">
                {cert.issuer} • {cert.date}
              </p>

              {/* Verify button */}
              <button
                className="px-3 py-1 font-display text-xs font-medium rounded-md transition-all duration-300 hover:bg-[#00D4FF] hover:text-white"
                style={{
                  background: 'transparent',
                  color: '#00D4FF',
                  border: '1px solid #00D4FF',
                }}
              >
                Verify
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
