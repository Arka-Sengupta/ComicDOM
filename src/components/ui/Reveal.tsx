import { ReactNode, CSSProperties } from 'react'
import { motion, useReducedMotion, Variants, Transition } from 'framer-motion'

type Direction = 'up' | 'down' | 'left' | 'right' | 'scale' | 'pop'

interface Props {
  children: ReactNode
  /** Where the element travels in from. */
  direction?: Direction
  delay?: number
  duration?: number
  /** Trigger only the first time it scrolls into view. */
  once?: boolean
  /** Fraction of the element that must be visible to trigger (0-1). */
  amount?: number
  className?: string
  style?: CSSProperties
}

const OFFSET = 46

const hiddenByDirection: Record<Direction, Record<string, number>> = {
  up:    { opacity: 0, y: OFFSET },
  down:  { opacity: 0, y: -OFFSET },
  left:  { opacity: 0, x: OFFSET },
  right: { opacity: 0, x: -OFFSET },
  scale: { opacity: 0, scale: 0.9 },
  pop:   { opacity: 0, scale: 0.4 },
}

function buildVariants(direction: Direction, duration: number, delay: number): Variants {
  const springy = direction === 'pop'
  const transition: Transition = springy
    ? { type: 'spring', stiffness: 260, damping: 16, delay }
    : { duration, ease: [0.22, 1, 0.36, 1], delay }

  return {
    hidden: hiddenByDirection[direction],
    visible: { opacity: 1, x: 0, y: 0, scale: 1, transition },
  }
}

/**
 * A reusable scroll-triggered reveal wrapper that keeps entrance
 * animations consistent across the site and respects reduced-motion.
 */
export default function Reveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.55,
  once = true,
  amount = 0.2,
  className,
  style,
}: Props) {
  const reduce = useReducedMotion()

  if (reduce) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      className={className}
      style={style}
      variants={buildVariants(direction, duration, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
    >
      {children}
    </motion.div>
  )
}
