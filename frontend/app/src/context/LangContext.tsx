import { createContext, useContext, useState, type ReactNode } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
export type Lang = 'en' | 'ru' | 'uz';

interface Translations {
  nav: { about: string; experience: string; skills: string; projects: string; contact: string };
  hero: { role: string; greeting: string; cta: string; cv: string };
  about: { label: string; subtitle: string; description: string };
  experience: { label: string; subtitle: string };
  education: { label: string; subtitle: string };
  skills: { label: string; subtitle: string };
  projects: { label: string; subtitle: string };
  certifications: { label: string; subtitle: string };
  contact: { label: string; subtitle: string; headline: { start: string; highlight: string; end: string }; sub: string };
  footer: { built: string };
}

// ─── Translations ─────────────────────────────────────────────────────────────
const TRANSLATIONS: Record<Lang, Translations> = {
  en: {
    nav: {
      about: 'About',
      experience: 'Experience',
      skills: 'Skills',
      projects: 'Projects',
      contact: 'Contact',
    },
    hero: {
      greeting: "Hi, I'm",
      role: 'Backend Developer & DevOps Engineer',
      cta: 'View My Work',
      cv: 'Download CV',
    },
    about: {
      label: 'About',
      subtitle: 'Who I Am',
      description: `Backend developer and DevOps enthusiast from Uzbekistan. I build scalable systems, enjoy cybersecurity, and am passionate about creating real-world impact through technology. Currently studying Software Engineering at Inha University in Tashkent.`,
    },
    experience: { label: 'Experience', subtitle: 'Where I\'ve Worked' },
    education:  { label: 'Education',  subtitle: 'Academic Background' },
    skills:     { label: 'Skills',     subtitle: 'Technical Expertise' },
    projects:   { label: 'Projects',   subtitle: 'Things I\'ve Built' },
    certifications: { label: 'Certifications', subtitle: 'Verified Skills' },
    contact: {
      label: 'Contact',
      subtitle: 'Get In Touch',
      headline: {
        start: "Let's build something ",
        highlight: "remarkable",
        end: " together.",
      },
      sub: "I'm open to internships, freelance projects, and full-time opportunities. Type a command below to connect.",
    },
    footer: { built: 'Built with' },
  },

  ru: {
    nav: {
      about: 'О себе',
      experience: 'Опыт',
      skills: 'Навыки',
      projects: 'Проекты',
      contact: 'Контакты',
    },
    hero: {
      greeting: 'Привет, я',
      role: 'Backend-разработчик и DevOps-инженер',
      cta: 'Мои работы',
      cv: 'Скачать резюме',
    },
    about: {
      label: 'О себе',
      subtitle: 'Кто я',
      description: `Backend-разработчик и энтузиаст DevOps из Узбекистана. Создаю масштабируемые системы, интересуюсь кибербезопасностью и стремлюсь создавать реальный impact через технологии. Учусь на факультете программной инженерии в Университете Инха в Ташкенте.`,
    },
    experience: { label: 'Опыт',    subtitle: 'Где я работал' },
    education:  { label: 'Образование', subtitle: 'Академический фон' },
    skills:     { label: 'Навыки',  subtitle: 'Технические компетенции' },
    projects:   { label: 'Проекты', subtitle: 'Что я создал' },
    certifications: { label: 'Сертификаты', subtitle: 'Подтверждённые навыки' },
    contact: {
      label: 'Контакты',
      subtitle: 'Связаться',
      headline: {
        start: 'Давайте создадим что-то ',
        highlight: 'выдающееся',
        end: ' вместе.',
      },
      sub: 'Открыт для стажировок, фриланс-проектов и постоянной работы. Введите команду ниже для связи.',
    },
    footer: { built: 'Создано с помощью' },
  },

  uz: {
    nav: {
      about: 'Men haqimda',
      experience: 'Tajriba',
      skills: 'Ko\'nikmalar',
      projects: 'Loyihalar',
      contact: 'Aloqa',
    },
    hero: {
      greeting: 'Salom, men',
      role: 'Backend Dasturchi va DevOps Muhandis',
      cta: 'Ishlarimni Ko\'ring',
      cv: 'CV Yuklab Olish',
    },
    about: {
      label: 'Men haqimda',
      subtitle: 'Kimman',
      description: `O'zbekistonlik backend dasturchi va DevOps ishqibozi. Kengaytiriladigan tizimlar yarataman, kiberxavfsizlik bilan qiziqaman va texnologiya orqali haqiqiy natijaga erishishga intilamam. Hozirda Toshkentdagi Inha universitetida dasturiy ta'minot muhandisligi yo'nalishida o'qiyman.`,
    },
    experience: { label: 'Tajriba',   subtitle: 'Qayerlarda ishladim' },
    education:  { label: 'Ta\'lim',   subtitle: 'Akademik fon' },
    skills:     { label: 'Ko\'nikmalar', subtitle: 'Texnik bilimlar' },
    projects:   { label: 'Loyihalar', subtitle: 'Nima yaratdim' },
    certifications: { label: 'Sertifikatlar', subtitle: 'Tasdiqlangan ko\'nikmalar' },
    contact: {
      label: 'Aloqa',
      subtitle: 'Bog\'lanish',
      headline: {
        start: 'Keling, birgalikda ',
        highlight: 'ajoyib loyihalar',
        end: ' yarataylik.',
      },
      sub: 'Amaliyot, frilanser loyihalar va doimiy ish uchun ochiqman. Bog\'lanish uchun quyidagi buyruqni kiriting.',
    },
    footer: { built: 'Quyidagi texnologiyalar bilan yaratildi' },
  },
};

// ─── Context ──────────────────────────────────────────────────────────────────
interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
}

const LangContext = createContext<LangContextValue>({
  lang: 'en',
  setLang: () => {},
  t: TRANSLATIONS.en,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');
  return (
    <LangContext.Provider value={{ lang, setLang, t: TRANSLATIONS[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
