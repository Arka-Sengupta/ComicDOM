import { ReactNode, CSSProperties } from 'react'
import { motion } from 'framer-motion'

type Tail = 'bottom-left' | 'bottom-right' | 'top-left'

interface Props {
  children: ReactNode
  color?: string
  tailDirection?: Tail
  className?: string
  animate?: boolean
}

function getTailStyle(dir: Tail, color: string): { outer: CSSProperties; inner: CSSProperties } {
  const base: CSSProperties = { position: 'absolute', width: 0, height: 0 }
  if (dir === 'bottom-left') {
    return {
      outer: { ...base, bottom: -17, left: 22, borderLeft: '11px solid transparent', borderRight: '11px solid transparent', borderTop: '17px solid #1A1A1A' },
      inner: { ...base, bottom: -13, left: 25, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: `13px solid $color}` },
    }
  }
  if (dir === 'bottom-right') {
    return {
      outer: { ...base, bottom: -17, right: 22, borderLeft: '11px solid transparent', borderRight: '11px solid transparent', borderTop: '17px solid #1A1A1A' },
      inner: { ...base, bottom: -13, right: 25, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: `13px solid $color}` },
    }
  }
  return {
    outer: { ...base, top: -17, left: 22, borderLeft: '11px solid transparent', borderRight: '11px solid transparent', borderBottom: '17px solid #1A1A1A' },
    inner: { ...base, top: -13, left: 25, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderBottom: `13px solid $color}` },
  }
}

export default function SpeechBubble({
  children,
  color = '#FFD700',
  tailDirection = 'bottom-left',
  className = '',
  animate = false,
}: Props) {
  const { outer, inner } = getTailStyle(tailDirection, color)
  const Wrapper = animate ? motion.div : 'div'
  const motionProps = animate
    ? { initial: { scale: 0, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { type: 'spring' as const, stiffness: 350, damping: 22 } }
    : {}

  return (
    <div className={'relative inline-block ' + className}>
      <Wrapper
        {...motionProps}
        style={{
          position: 'relative',
          display: 'inline-block',
          backgroundColor: color,
          border: '3px solid #1A1A1A',
          boxShadow: '4px 4px 0 #1A1A1A',
          borderRadius: 12,
          padding: '10px 20px',
          fontFamily: 'Bangers, cursive',
          letterSpacing: '0.08em',
          color: '#1A1A1A',
        }}
      >
        {children}
        <div style={outer} />
        <div style={inner} />
      </Wrapper>
    </div>
  )
}
