import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sectionIds = navItems.map((n) => n.href.replace('#', ''));
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.4 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (href: string) => {
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMenuOpen(false);
  };

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-[50] nav-glass"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.5 }}
      style={{
        boxShadow: scrolled ? '0 0 30px rgba(167, 139, 250, 0.06)' : 'none',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-5 md:px-10 h-16 flex items-center justify-between">
        {/* Logo */}
        <motion.a
          href="#"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex items-center gap-2.5 select-none"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-display font-bold text-sm"
            style={{
              background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.2), rgba(245, 158, 11, 0.12))',
              border: '1px solid rgba(167, 139, 250, 0.35)',
              color: '#A78BFA',
            }}
          >
            KJ
          </div>
          <span
            className="font-display font-semibold text-sm tracking-wide hidden sm:block"
            style={{ color: 'rgba(240, 237, 248, 0.75)' }}
          >
            Kamronbek
          </span>
        </motion.a>

        {/* Desktop nav items */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeSection === item.href.replace('#', '');
            return (
              <motion.button
                key={item.label}
                onClick={() => scrollTo(item.href)}
                className="relative px-4 py-2 rounded-lg font-display text-sm font-medium transition-colors duration-200"
                style={{
                  color: isActive ? '#A78BFA' : 'rgba(240, 237, 248, 0.55)',
                  background: isActive ? 'rgba(167, 139, 250, 0.08)' : 'transparent',
                }}
                whileHover={{ color: '#A78BFA', background: 'rgba(167, 139, 250, 0.06)' }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ background: '#F59E0B', boxShadow: '0 0 6px rgba(245, 158, 11, 0.8)' }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}

          {/* CTA button */}
          <motion.a
            href="/assets/KamronbekJumanov_CV.docx"
            download
            className="ml-3 px-4 py-1.5 rounded-lg font-display text-sm font-semibold"
            style={{
              background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.2), rgba(245, 158, 11, 0.12))',
              border: '1px solid rgba(167, 139, 250, 0.35)',
              color: '#A78BFA',
            }}
            whileHover={{
              background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.3), rgba(245, 158, 11, 0.2))',
              boxShadow: '0 0 18px rgba(167, 139, 250, 0.3)',
            }}
            whileTap={{ scale: 0.95 }}
          >
            Resume ↓
          </motion.a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen((p) => !p)}
          aria-label="Toggle menu"
        >
          <motion.span
            className="block w-5 h-0.5 rounded-full"
            style={{ background: '#A78BFA' }}
            animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.25 }}
          />
          <motion.span
            className="block w-5 h-0.5 rounded-full"
            style={{ background: '#A78BFA' }}
            animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="block w-5 h-0.5 rounded-full"
            style={{ background: '#F59E0B' }}
            animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.25 }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="md:hidden nav-glass border-t px-5 py-4 flex flex-col gap-1"
            style={{ borderColor: 'rgba(167, 139, 250, 0.1)' }}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollTo(item.href)}
                className="text-left px-3 py-2.5 rounded-lg font-display text-sm font-medium"
                style={{ color: 'rgba(240, 237, 248, 0.7)' }}
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
