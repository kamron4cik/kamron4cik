import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang, type Lang } from '@/context/LangContext';

const NAV_HREFS = ['about', 'experience', 'skills', 'projects', 'contact'] as const;

const LANG_FLAGS: Record<Lang, { flag: string; label: string }> = {
  en: { flag: '🇬🇧', label: 'EN' },
  ru: { flag: '🇷🇺', label: 'RU' },
  uz: { flag: '🇺🇿', label: 'UZ' },
};

export default function Navbar() {
  const { lang, setLang, t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const navItems = [
    { label: t.nav.about,      href: 'about' },
    { label: t.nav.experience, href: 'experience' },
    { label: t.nav.skills,     href: 'skills' },
    { label: t.nav.projects,   href: 'projects' },
    { label: t.nav.contact,    href: 'contact' },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    NAV_HREFS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.4 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const switchLang = (l: Lang) => { setLang(l); setLangMenuOpen(false); };

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-[50] nav-glass"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.5 }}
      style={{ boxShadow: scrolled ? '0 0 30px rgba(167, 139, 250, 0.06)' : 'none' }}
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
              background: 'linear-gradient(135deg, rgba(167,139,250,0.2), rgba(245,158,11,0.12))',
              border: '1px solid rgba(167,139,250,0.35)',
              color: '#A78BFA',
            }}
          >
            KJ
          </div>
          <span className="font-display font-semibold text-sm tracking-wide hidden sm:block" style={{ color: 'rgba(240,237,248,0.75)' }}>
            Kamronbek
          </span>
        </motion.a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeSection === item.href;
            return (
              <motion.button
                key={item.href}
                onClick={() => scrollTo(item.href)}
                className="relative px-4 py-2 rounded-lg font-display text-sm font-medium transition-colors duration-200"
                style={{
                  color: isActive ? '#A78BFA' : 'rgba(240,237,248,0.55)',
                  background: isActive ? 'rgba(167,139,250,0.08)' : 'transparent',
                }}
                whileHover={{ color: '#A78BFA', background: 'rgba(167,139,250,0.06)' } as object}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ background: '#F59E0B', boxShadow: '0 0 6px rgba(245,158,11,0.8)' }}
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

          {/* ── Language switcher ── */}
          <div className="relative ml-1">
            <motion.button
              onClick={() => setLangMenuOpen((p) => !p)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-semibold tracking-widest"
              style={{
                background: 'rgba(167,139,250,0.07)',
                border: '1px solid rgba(167,139,250,0.2)',
                color: '#A78BFA',
              }}
              whileHover={{ background: 'rgba(167,139,250,0.14)' } as object}
              whileTap={{ scale: 0.95 }}
            >
              <span>{LANG_FLAGS[lang].flag}</span>
              <span>{LANG_FLAGS[lang].label}</span>
              <motion.span
                animate={{ rotate: langMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-[10px]"
              >
                ▼
              </motion.span>
            </motion.button>

            <AnimatePresence>
              {langMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="absolute top-full mt-2 right-0 rounded-xl overflow-hidden z-[60]"
                  style={{
                    background: 'rgba(13,11,26,0.96)',
                    border: '1px solid rgba(167,139,250,0.25)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5), 0 0 15px rgba(167,139,250,0.1)',
                    minWidth: '110px',
                  }}
                >
                  {(['en', 'ru', 'uz'] as Lang[]).map((l) => (
                    <motion.button
                      key={l}
                      onClick={() => switchLang(l)}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 font-mono text-xs font-medium"
                      style={{
                        color: lang === l ? '#A78BFA' : 'rgba(240,237,248,0.6)',
                        background: lang === l ? 'rgba(167,139,250,0.1)' : 'transparent',
                      }}
                      whileHover={{ background: 'rgba(167,139,250,0.08)', color: '#ffffff' } as object}
                    >
                      <span className="text-base">{LANG_FLAGS[l].flag}</span>
                      <span className="tracking-widest">{LANG_FLAGS[l].label}</span>
                      {lang === l && (
                        <span className="ml-auto text-[#F59E0B]">✓</span>
                      )}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Resume CTA */}
          <motion.a
            href="/assets/KamronbekJumanov_CV.docx"
            download
            className="ml-2 px-4 py-1.5 rounded-lg font-display text-sm font-semibold"
            style={{
              background: 'linear-gradient(135deg, rgba(167,139,250,0.2), rgba(245,158,11,0.12))',
              border: '1px solid rgba(167,139,250,0.35)',
              color: '#A78BFA',
            }}
            whileHover={{
              background: 'linear-gradient(135deg, rgba(167,139,250,0.3), rgba(245,158,11,0.2))',
              boxShadow: '0 0 18px rgba(167,139,250,0.3)',
            } as object}
            whileTap={{ scale: 0.95 }}
          >
            {t.hero.cv} ↓
          </motion.a>
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden flex items-center gap-3">
          {/* Language pill — mobile */}
          <motion.button
            onClick={() => setLangMenuOpen((p) => !p)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg font-mono text-[11px] font-semibold"
            style={{
              background: 'rgba(167,139,250,0.07)',
              border: '1px solid rgba(167,139,250,0.2)',
              color: '#A78BFA',
            }}
            whileTap={{ scale: 0.95 }}
          >
            {LANG_FLAGS[lang].flag} {LANG_FLAGS[lang].label}
          </motion.button>

          <button
            className="flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            <motion.span className="block w-5 h-0.5 rounded-full" style={{ background: '#A78BFA' }}
              animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }} transition={{ duration: 0.25 }}
            />
            <motion.span className="block w-5 h-0.5 rounded-full" style={{ background: '#A78BFA' }}
              animate={menuOpen ? { opacity: 0 } : { opacity: 1 }} transition={{ duration: 0.2 }}
            />
            <motion.span className="block w-5 h-0.5 rounded-full" style={{ background: '#F59E0B' }}
              animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }} transition={{ duration: 0.25 }}
            />
          </button>
        </div>
      </div>

      {/* Mobile language picker dropdown */}
      <AnimatePresence>
        {langMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden nav-glass border-t px-5 py-2 flex gap-3"
            style={{ borderColor: 'rgba(167,139,250,0.1)' }}
          >
            {(['en', 'ru', 'uz'] as Lang[]).map((l) => (
              <motion.button
                key={l}
                onClick={() => switchLang(l)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg font-mono text-xs font-semibold"
                style={{
                  background: lang === l ? 'rgba(167,139,250,0.15)' : 'rgba(167,139,250,0.05)',
                  border: `1px solid ${lang === l ? 'rgba(167,139,250,0.4)' : 'rgba(167,139,250,0.12)'}`,
                  color: lang === l ? '#A78BFA' : 'rgba(240,237,248,0.55)',
                }}
                whileTap={{ scale: 0.95 }}
              >
                {LANG_FLAGS[l].flag} {LANG_FLAGS[l].label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile nav menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="md:hidden nav-glass border-t px-5 py-4 flex flex-col gap-1"
            style={{ borderColor: 'rgba(167,139,250,0.1)' }}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollTo(item.href)}
                className="text-left px-3 py-2.5 rounded-lg font-display text-sm font-medium"
                style={{ color: 'rgba(240,237,248,0.7)' }}
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
