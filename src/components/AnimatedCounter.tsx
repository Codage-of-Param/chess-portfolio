import React, { useState, useEffect } from 'react';
import { useAnimatedCounter } from '../hooks/useAnimations';

interface Props {
  value: number;
  suffix?: string;
  prefix?: string;
  label?: string;
  duration?: number;
  className?: string;
  formatNumber?: boolean;
}

export default function AnimatedCounter({
  value,
  suffix = '',
  prefix = '',
  label = '',
  duration = 2000,
  className = '',
  formatNumber = false,
}: Props) {
  const { ref, count } = useAnimatedCounter(value, duration);
  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    if (count === value && value !== 0) {
      setBounce(true);
      const timer = setTimeout(() => setBounce(false), 400);
      return () => clearTimeout(timer);
    }
  }, [count, value]);

  const displayValue = formatNumber ? count.toLocaleString() : String(count);

  return (
    <div ref={ref} className={className}>
      <span
        className="inline-block tabular-nums"
        style={{
          transition: 'transform 400ms cubic-bezier(0.34,1.56,0.64,1)',
          transform: bounce ? 'scale(1.15)' : 'scale(1)',
        }}
      >
        {prefix}
        {displayValue}
        {suffix}
      </span>
      {label ? <span className="block">{label}</span> : null}
    </div>
  );
}
