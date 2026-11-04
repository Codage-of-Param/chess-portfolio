import React, { useMemo } from 'react';
import { useInView } from '../hooks/useAnimations';

type Animation = 'fadeUp' | 'fadeDown' | 'fadeLeft' | 'fadeRight' | 'scaleUp' | 'blur';

interface Props {
  children: React.ReactNode;
  className?: string;
  animation?: Animation;
  delay?: number;
  duration?: number;
  threshold?: number;
}

const hiddenStyles: Record<Animation, React.CSSProperties> = {
  fadeUp: { opacity: 0, transform: 'translateY(40px)' },
  fadeDown: { opacity: 0, transform: 'translateY(-40px)' },
  fadeLeft: { opacity: 0, transform: 'translateX(-40px)' },
  fadeRight: { opacity: 0, transform: 'translateX(40px)' },
  scaleUp: { opacity: 0, transform: 'scale(0.9)' },
  blur: { opacity: 0, filter: 'blur(10px)' },
};

const visibleStyles: Record<Animation, React.CSSProperties> = {
  fadeUp: { opacity: 1, transform: 'translateY(0)' },
  fadeDown: { opacity: 1, transform: 'translateY(0)' },
  fadeLeft: { opacity: 1, transform: 'translateX(0)' },
  fadeRight: { opacity: 1, transform: 'translateX(0)' },
  scaleUp: { opacity: 1, transform: 'scale(1)' },
  blur: { opacity: 1, filter: 'blur(0px)' },
};

export default function AnimatedSection({
  children,
  className = '',
  animation = 'fadeUp',
  delay = 0,
  duration = 700,
  threshold = 0.1,
}: Props) {
  const { ref, isInView } = useInView({ threshold, triggerOnce: true });

  const style = useMemo<React.CSSProperties>(() => {
    const base = isInView ? visibleStyles[animation] : hiddenStyles[animation];
    return {
      ...base,
      transition: `opacity ${duration}ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, filter ${duration}ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      willChange: 'opacity, transform, filter',
    };
  }, [isInView, animation, delay, duration]);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
