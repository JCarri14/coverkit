import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { MediaCard } from '@coverkit/react';
import type { MediaCardProps } from '@coverkit/react';

export type MediaEntrance = 'none' | 'fade-up' | 'scale-in';
export type MediaAnimationTrigger = 'mount' | 'in-view';

/** Animation is an optional presentation layer; MediaCard retains its navigation callbacks. */
export interface AnimatedMediaCardProps extends MediaCardProps {
  animation?: MediaEntrance;
  trigger?: MediaAnimationTrigger;
  /** Duration in seconds. */
  duration?: number;
  /** Delay in seconds. */
  delay?: number;
  /** Only applies to the in-view trigger. */
  once?: boolean;
  viewportAmount?: number;
  /** For staggered galleries; use a stable item order. */
  staggerIndex?: number;
  staggerInterval?: number;
  /** Subtle press feedback on the wrapper; disabled when reduced motion is preferred. */
  pressFeedback?: boolean;
  wrapperClassName?: string;
}

export function AnimatedMediaCard({
  animation = 'fade-up', trigger = 'in-view', duration = 0.35, delay = 0,
  once = true, viewportAmount = 0.2, staggerIndex = 0, staggerInterval = 0.07,
  pressFeedback = false, wrapperClassName = '', ...cardProps
}: AnimatedMediaCardProps) {
  const reduceMotion = useReducedMotion();
  const [ready, setReady] = useState(false);
  // Server-render the entire card visibly. Activate motion only after hydration,
  // so an HTML-only reader never receives an invisible card.
  useEffect(() => setReady(true), []);
  const enabled = ready && reduceMotion !== true && animation !== 'none';
  const hidden = animation === 'scale-in' ? { opacity: 0, scale: 0.965 } : { opacity: 0, y: 12 };
  const visible = { opacity: 1, scale: 1, y: 0 };
  const safeDuration = Math.max(0, Math.min(2, duration));
  const safeDelay = Math.max(0, Math.min(8, delay + Math.max(0, staggerIndex) * staggerInterval));
  return <motion.div
    key={enabled ? 'animated' : 'static'}
    className={`ck-animated-card ${wrapperClassName}`.trim()}
    style={{ width: '100%', minWidth: 0 }}
    initial={enabled ? hidden : false}
    animate={enabled && trigger === 'mount' ? visible : undefined}
    whileInView={enabled && trigger === 'in-view' ? visible : undefined}
    viewport={{ once, amount: Math.max(0, Math.min(1, viewportAmount)) }}
    transition={{ duration: safeDuration, delay: safeDelay, ease: [0.22, 1, 0.36, 1] as const }}
    whileTap={pressFeedback && ready && reduceMotion !== true ? { scale: 0.985 } : undefined}
  >
    <MediaCard {...cardProps} />
  </motion.div>;
}
