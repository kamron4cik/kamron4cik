import { motion } from 'framer-motion';
import { Linkedin, Github, Send, Mail } from 'lucide-react';

const links = [
  { href: 'https://www.linkedin.com/in/kamronbek-jumanov-a4ab362b6/', icon: Linkedin, label: 'LinkedIn' },
  { href: 'https://github.com/kamron4cik', icon: Github, label: 'GitHub' },
  { href: 'https://t.me/Kamronbek_cs', icon: Send, label: 'Telegram' },
  { href: 'mailto:jumanovkamronbek8@gmail.com', icon: Mail, label: 'Email' },
];

interface SocialLinksProps {
  className?: string;
}

export default function SocialLinks({ className = '' }: SocialLinksProps) {
  return (
    <div className={`flex gap-4 ${className}`}>
      {links.map((link) => (
        <motion.a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
          whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
          whileTap={{ scale: 0.95 }}
          aria-label={link.label}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
          <link.icon size={20} />
        </motion.a>
      ))}
    </div>
  );
}
