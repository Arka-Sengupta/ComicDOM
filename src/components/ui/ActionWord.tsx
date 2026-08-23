import { motion } from 'framer-motion'

interface Props {
  word: string
  color?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  rotate?: number
  className?: string
}

const sizes = { sm: '2rem', md: '3.5rem', lg: '5rem', xl: '8rem' }

export default function ActionWord({ word, color = '#FFD700', size = 'lg', rotate = -8, className = '' }: Props) {
  return (
    <motion.span
      initial={{ scale: 0, rotate: rotate - 10 }}
      whileInView={{ scale: 1, rotate }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      className={className}
      style={{
        fontFamily: 'Bangers, cursive',
        fontSize: sizes[size],
        letterSpacing: '0.06em',
        color,
        WebkitTextStroke: '3px #1A1A1A',
        textShadow: '4px 4px 0 #1A1A1A',
        display: 'inline-block',
        userSelect: 'none',
        pointerEvents: 'none',
      }}
    >
      {word}
    </motion.span>
  )
}
