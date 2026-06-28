import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SectionLabelProps {
  label: string;
  subtitle?: string;
}

export default function SectionLabel({ label, subtitle }: SectionLabelProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    const text = textRef.current;
    if (!bar || !text) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: bar,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });

    tl.fromTo(bar,
      { scaleY: 0, opacity: 0 },
      { scaleY: 1, opacity: 1, duration: 0.5, ease: 'power3.out', transformOrigin: 'top center' }
    )
    .fromTo(text,
      { x: -16, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
      '-=0.25'
    );

    return () => { tl.kill(); };
  }, []);

  return (
    <div className="section-label-wrapper">
      <div
        ref={barRef}
        className="section-label-bar"
        style={{ willChange: 'transform, opacity' }}
      />
      <div ref={textRef} style={{ willChange: 'transform, opacity' }}>
        <div className="section-label-text">{label}</div>
        {subtitle && (
          <div className="section-label-title mt-0.5">{subtitle}</div>
        )}
      </div>
    </div>
  );
}
