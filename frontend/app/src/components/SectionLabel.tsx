import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SectionLabelProps {
  label: string;
}

export default function SectionLabel({ label }: SectionLabelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftBracketRef = useRef<HTMLSpanElement>(null);
  const rightBracketRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const left = leftBracketRef.current;
    const right = rightBracketRef.current;
    const text = textRef.current;
    if (!container || !left || !right || !text) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });

    tl.fromTo(left, { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' })
      .fromTo(right, { x: 20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, '<')
      .fromTo(text, { opacity: 0 }, { opacity: 1, duration: 0.4 }, '-=0.2');

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className="mb-10">
      <span className="font-display text-base font-medium tracking-[0.05em] uppercase">
        <span ref={leftBracketRef} className="text-[#FF007F] mr-1">[</span>
        <span ref={textRef} className="text-white">{label}</span>
        <span ref={rightBracketRef} className="text-[#00D4FF] ml-1">]</span>
      </span>
    </div>
  );
}
