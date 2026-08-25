import { motion, useReducedMotion } from 'framer-motion'
import { ReactNode } from 'react'

const variants = {
  initial: { opacity: 0, y: 24, scale: 0.985 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit:    { opacity: 0, y: -16, scale: 0.985 },
}

export default function PageTransition({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion()

  if (reduce) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
