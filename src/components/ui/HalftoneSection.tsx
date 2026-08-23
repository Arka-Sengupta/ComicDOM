import { ReactNode, CSSProperties } from 'react'

type Color = 'cream' | 'red' | 'blue' | 'yellow' | 'black'

interface Props {
  children: ReactNode
  color?: Color
  className?: string
  id?: string
  style?: CSSProperties
}

const palette: Record<Color, { bg: string; dot: string }> = {
  cream:  { bg: '#FFF8E7', dot: 'rgba(0,0,0,0.12)' },
  red:    { bg: '#ED1D24', dot: 'rgba(0,0,0,0.22)' },
  blue:   { bg: '#0476F2', dot: 'rgba(0,0,0,0.22)' },
  yellow: { bg: '#FFD700', dot: 'rgba(0,0,0,0.14)' },
  black:  { bg: '#1A1A1A', dot: 'rgba(255,255,255,0.07)' },
}

export default function HalftoneSection({ children, color = 'cream', className = '', id, style }: Props) {
  const { bg, dot } = palette[color]
  return (
    <section
      id={id}
      className={className}
      style={{
        backgroundColor: bg,
        backgroundImage: `radial-gradient(circle, ${dot} 1.5px, transparent 1.5px)`,
        backgroundSize: '14px 14px',
        ...style,
      }}
    >
      {children}
    </section>
  )
}
