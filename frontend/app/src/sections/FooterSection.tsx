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
  const ref = useScrollReveal<HTMLElement>({ y: 20, duration: 0.5 });

  return (
    <footer
      ref={ref}
      className="w-full py-12"
      style={{
        backgroundColor: '#060B1A',
        borderTop: '1px solid rgba(0, 212, 255, 0.12)',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-5 md:px-10 flex flex-col items-center gap-5">
        {/* Social icons row */}
        <div className="flex gap-4">
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
              <link.icon size={18} />
            </motion.a>
          ))}
        </div>

        {/* Copyright */}
        <p className="font-body text-xs font-light text-white/35 flex items-center gap-1.5">
          © 2025 Kamronbek Jumanov · Built with
          <span className="gradient-text font-medium">React, Three.js</span>
          &amp; <Heart size={11} className="text-[#FF007F] inline" fill="#FF007F" /> coffee
        </p>
      </div>
    </footer>
  );
}
