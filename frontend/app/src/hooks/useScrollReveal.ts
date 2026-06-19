import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealOptions {
  y?: number;
  x?: number;
  duration?: number;
  stagger?: number;
  delay?: number;
  scale?: number;
  start?: string;
  childSelector?: string;
}

export function useScrollReveal<T extends HTMLElement>(
  options: ScrollRevealOptions = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const {
      y = 50,
      x = 0,
      duration = 0.8,
      stagger = 0.15,
      delay = 0,
      scale,
      start = 'top 80%',
      childSelector,
    } = options;

    const targets = childSelector
      ? element.querySelectorAll(childSelector)
      : element;

    const fromVars: gsap.TweenVars = {
      opacity: 0,
      y,
      x,
      duration,
      delay,
      ease: 'power3.out',
    };

    if (scale !== undefined) {
      fromVars.scale = scale;
    }

    const toVars: gsap.TweenVars = {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      stagger: childSelector ? stagger : 0,
      scrollTrigger: {
        trigger: element,
        start,
        toggleActions: 'play none none none',
      },
    };

    gsap.fromTo(targets, fromVars, toVars);

    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === element) st.kill();
      });
    };
  }, [options.y, options.x, options.duration, options.stagger, options.delay, options.scale, options.start, options.childSelector]);

  return ref;
}
