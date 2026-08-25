import { motion, useScroll, useSpring } from 'framer-motion'

/**
 * A comic-styled reading-progress meter pinned to the very top of the
 * viewport. Fills red → yellow as the page is scrolled.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    restDelta: 0.001,
  })

  return (
    <motion.div
      aria-hidden
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 6,
        transformOrigin: '0% 50%',
        scaleX,
        zIndex: 200,
        background: 'linear-gradient(90deg, #ED1D24 0%, #FF6B00 55%, #FFD700 100%)',
        borderBottom: '2px solid #1A1A1A',
        pointerEvents: 'none',
      }}
    />
  )
}
