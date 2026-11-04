import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

/* ─────────────────────────────────────────────
 * useInView
 * ───────────────────────────────────────────── */
interface UseInViewOptions {
  threshold?: number;
  triggerOnce?: boolean;
  rootMargin?: string;
}

export function useInView(options: UseInViewOptions = {}) {
  const { threshold = 0.1, triggerOnce = true, rootMargin = '0px' } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (triggerOnce) observer.unobserve(node);
        } else if (!triggerOnce) {
          setIsInView(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, triggerOnce, rootMargin]);

  return { ref, isInView };
}

/* ─────────────────────────────────────────────
 * useAnimatedCounter
 * ───────────────────────────────────────────── */
function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export function useAnimatedCounter(
  end: number,
  duration = 2000,
  startOnView = true,
) {
  const { ref, isInView } = useInView({ triggerOnce: true });
  const [count, setCount] = useState(0);
  const prevEndRef = useRef<number | null>(null);

  useEffect(() => {
    const shouldStart = startOnView ? isInView : true;
    if (!shouldStart) return;

    let startTime: number | null = null;
    let rafId: number;
    const startVal = prevEndRef.current ?? 0;
    prevEndRef.current = end;

    const tick = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);

      setCount(Math.round(startVal + easedProgress * (end - startVal)));

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setCount(end);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [end, duration, isInView, startOnView]);

  return { ref, count };
}

/* ─────────────────────────────────────────────
 * useStaggerChildren
 * ───────────────────────────────────────────── */
export function useStaggerChildren(
  isVisible: boolean,
  count: number,
  delayPerItem = 100,
) {
  const [visibleItems, setVisibleItems] = useState<boolean[]>(
    () => new Array(count).fill(false),
  );

  useEffect(() => {
    if (!isVisible) {
      setVisibleItems(new Array(count).fill(false));
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];

    for (let i = 0; i < count; i++) {
      timers.push(
        setTimeout(() => {
          setVisibleItems((prev) => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
        }, i * delayPerItem),
      );
    }

    return () => timers.forEach(clearTimeout);
  }, [isVisible, count, delayPerItem]);

  return visibleItems;
}

/* ─────────────────────────────────────────────
 * useParallax
 * ───────────────────────────────────────────── */
export function useParallax(speed = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let rafId: number;
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      rafId = requestAnimationFrame(() => {
        const node = ref.current;
        if (node) {
          const rect = node.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const elementCenter = rect.top + rect.height / 2;
          const viewportCenter = windowHeight / 2;
          setOffset((elementCenter - viewportCenter) * speed);
        }
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [speed]);

  return { ref, offset };
}

/* ─────────────────────────────────────────────
 * useMouseGlow
 * ───────────────────────────────────────────── */
export function useMouseGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const [x, setX] = useState(50);
  const [y, setY] = useState(50);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = node.getBoundingClientRect();
      const percentX = ((e.clientX - rect.left) / rect.width) * 100;
      const percentY = ((e.clientY - rect.top) / rect.height) * 100;
      setX(Math.max(0, Math.min(100, percentX)));
      setY(Math.max(0, Math.min(100, percentY)));
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    node.addEventListener('mousemove', handleMouseMove);
    node.addEventListener('mouseenter', handleMouseEnter);
    node.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      node.removeEventListener('mousemove', handleMouseMove);
      node.removeEventListener('mouseenter', handleMouseEnter);
      node.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return { ref, x, y, isHovering };
}

/* ─────────────────────────────────────────────
 * useSmoothScroll
 * ───────────────────────────────────────────── */
export function useSmoothScroll() {
  const scrollTo = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return scrollTo;
}

/* ─────────────────────────────────────────────
 * useTypewriter
 * ───────────────────────────────────────────── */
export function useTypewriter(text: string, speed = 50) {
  const { ref, isInView } = useInView({ triggerOnce: true });
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!isInView || hasStarted.current) return;
    hasStarted.current = true;

    let index = 0;
    setDisplayText('');
    setIsComplete(false);

    const interval = setInterval(() => {
      index++;
      setDisplayText(text.slice(0, index));
      if (index >= text.length) {
        clearInterval(interval);
        setIsComplete(true);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, isInView]);

  return { ref, displayText, isComplete };
}
