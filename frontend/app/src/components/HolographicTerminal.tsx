import { useState, useEffect } from 'react';
import { useTypewriter } from '@/hooks/useTypewriter';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const COMMANDS = [
  {
    name: 'linkedin',
    response: 'Connecting to LinkedIn...',
    link: 'https://www.linkedin.com/in/kamronbek-jumanov-a4ab362b6/',
    linkText: 'linkedin.com/in/kamronbek-jumanov-a4ab362b6',
  },
  {
    name: 'github',
    response: 'Accessing GitHub repository...',
    link: 'https://github.com/kamron4cik',
    linkText: 'github.com/kamron4cik',
  },
  {
    name: 'email',
    response: 'Opening email client...',
    link: 'mailto:jumanovkamronbek8@gmail.com',
    linkText: 'jumanovkamronbek8@gmail.com',
  },
  {
    name: 'telegram',
    response: 'Launching Telegram...',
    link: 'https://t.me/Kamronbek_cs',
    linkText: 't.me/Kamronbek_cs',
  },
];

export default function HolographicTerminal() {
  const [activeCommand, setActiveCommand] = useState<number | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const terminalRef = useScrollReveal<HTMLDivElement>({ y: 40, duration: 0.8 });
  const [showWelcome, setShowWelcome] = useState(false);
  const [showCommands, setShowCommands] = useState(false);

  const welcome = useTypewriter({
    text: 'Welcome to my terminal! Type a command or click one below to get in touch.',
    speed: 30,
    enabled: showWelcome,
    hideCursorAfter: 0,
  });

  const commandType = useTypewriter({
    text: activeCommand !== null ? COMMANDS[activeCommand].name : '',
    speed: 30,
    enabled: activeCommand !== null && isTyping,
    hideCursorAfter: 0,
  });

  const responseType = useTypewriter({
    text: activeCommand !== null ? COMMANDS[activeCommand].response : '',
    speed: 30,
    startDelay: 500,
    enabled: activeCommand !== null && commandType.isComplete,
    hideCursorAfter: 0,
  });

  useEffect(() => {
    if (terminalRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => setShowWelcome(true), 800);
            observer.disconnect();
          }
        },
        { threshold: 0.5 }
      );
      observer.observe(terminalRef.current);
      return () => observer.disconnect();
    }
  }, []);

  useEffect(() => {
    if (welcome.isComplete) {
      setTimeout(() => setShowCommands(true), 200);
    }
  }, [welcome.isComplete]);

  useEffect(() => {
    if (activeCommand !== null) {
      setIsTyping(true);
    }
  }, [activeCommand]);

  const handleCommand = (index: number) => {
    if (isTyping && activeCommand === null) return;
    setActiveCommand(index);
    setIsTyping(true);
  };

  return (
    <div
      ref={terminalRef}
      className="relative max-w-[700px] mx-auto rounded-2xl p-8 overflow-hidden scanlines"
      style={{
        background: 'rgba(19, 17, 28, 0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(167, 139, 250, 0.15)',
        boxShadow: '0 0 40px rgba(124, 58, 237, 0.18), inset 0 0 20px rgba(167, 139, 250, 0.05)',
      }}
    >
      {/* Animated border gradient */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          padding: '1.5px',
          background: 'linear-gradient(90deg, #A78BFA, #C084FC, #F59E0B, #A78BFA)',
          backgroundSize: '300% 300%',
          animation: 'gradientRotate 4s linear infinite',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      <div className="flex gap-2 mb-6">
        <span className="w-3 h-3 rounded-full bg-red-500/80" />
        <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <span className="w-3 h-3 rounded-full bg-green-500/80" />
      </div>

      {showWelcome && (
        <div className="mb-6 font-mono text-sm font-light" style={{ color: 'rgba(240, 237, 248, 0.65)' }}>
          <span className="mr-2" style={{ color: '#F59E0B' }}>&gt;</span>
          {welcome.displayText}
          {welcome.showCursor && (
            <span className="animate-blink-cursor" style={{ color: '#F59E0B' }}>_</span>
          )}
        </div>
      )}

      {showCommands && (
        <div className="flex flex-wrap gap-5 mb-6">
          {COMMANDS.map((cmd, index) => (
            <button
              key={cmd.name}
              onClick={() => handleCommand(index)}
              className="font-mono text-sm font-medium transition-all duration-300"
              style={{ color: '#A78BFA' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#F59E0B'; (e.currentTarget as HTMLButtonElement).style.filter = 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.5))'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#A78BFA'; (e.currentTarget as HTMLButtonElement).style.filter = 'none'; }}
            >
              <span className="mr-1" style={{ color: '#F59E0B' }}>&gt;</span>
              {cmd.name}
            </button>
          ))}
        </div>
      )}

      {activeCommand !== null && (
        <div className="font-mono text-sm">
          {!commandType.isComplete && (
            <div className="mb-2" style={{ color: '#F59E0B' }}>
              <span className="mr-2">&gt;</span>
              {commandType.displayText}
              {commandType.showCursor && (
                <span className="animate-blink-cursor">_</span>
              )}
            </div>
          )}

          {commandType.isComplete && (
            <div style={{ color: 'rgba(240, 237, 248, 0.75)' }}>
              {responseType.displayText}
              {responseType.showCursor && !responseType.isComplete && (
                <span className="animate-blink-cursor" style={{ color: '#F59E0B' }}>_</span>
              )}
              {responseType.isComplete && (
                <div className="mt-2">
                  <a
                    href={COMMANDS[activeCommand].link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline transition-all"
                    style={{ color: '#A78BFA' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#C084FC'; (e.currentTarget as HTMLAnchorElement).style.filter = 'drop-shadow(0 0 8px rgba(167, 139, 250, 0.5))'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#A78BFA'; (e.currentTarget as HTMLAnchorElement).style.filter = 'none'; }}
                  >
                    {COMMANDS[activeCommand].linkText}
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeCommand === null && showCommands && (
        <div className="animate-blink-cursor" style={{ color: '#F59E0B' }}>_</div>
      )}
    </div>
  );
}
