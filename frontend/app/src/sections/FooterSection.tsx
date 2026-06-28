import { useScrollReveal } from '@/hooks/useScrollReveal';
import { motion } from 'framer-motion';
import { Github, Linkedin, Send, Mail, Heart } from 'lucide-react';

const links = [
  { href: 'https://github.com/kamron4cik', icon: Github, label: 'GitHub' },
  { href: 'https://www.linkedin.com/in/kamronbek-jumanov-a4ab362b6/', icon: Linkedin, label: 'LinkedIn' },
  { href: 'https://t.me/Kamronbek_cs', icon: Send, label: 'Telegram' },
  { href: 'mailto:jumanovkamronbek8@gmail.com', icon: Mail, label: 'Email' },
];

export default function FooterSection() {
  const ref = useScrollReveal<HTMLElement>({ y: 16, duration: 0.5 });

  return (
    <footer
      ref={ref}
      className="w-full py-12 relative"
      style={{ backgroundColor: '#0A0A0F' }}
    >
      {/* Aurora top border */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(167, 139, 250, 0.4), rgba(245, 158, 11, 0.3), rgba(167, 139, 250, 0.4), transparent)',
        }}
      />

      <div className="max-w-[1200px] mx-auto px-5 md:px-10 flex flex-col items-center gap-6">
        {/* Logo */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-base select-none"
          style={{
            background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.12), rgba(245, 158, 11, 0.08))',
            border: '1px solid rgba(167, 139, 250, 0.2)',
            color: '#A78BFA',
          }}
        >
          KJ
        </div>

        {/* Social icons */}
        <div className="flex gap-3">
          {links.map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="social-link"
              whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              <link.icon size={17} />
            </motion.a>
          ))}
        </div>

        {/* Copyright */}
        <p className="font-body text-xs font-light text-center flex flex-wrap items-center justify-center gap-1.5" style={{ color: 'rgba(240, 237, 248, 0.3)' }}>
          © 2025 Kamronbek Jumanov · Built with
          <span className="gradient-text font-medium">React, Three.js</span>
          &amp; <Heart size={11} className="inline" style={{ color: '#F59E0B', fill: '#F59E0B' }} /> coffee
        </p>
      </div>
    </footer>
  );
}
