import { motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'

interface Props {
  title: string
  description: string
  date: string
  badge?: string
  accentColor?: 'red' | 'blue' | string
  earth?: string
  characters?: string[]
  universe?: string
  index?: number
}

const ACTION = ['POW!', 'ZAP!', 'BAM!', 'WHAM!', 'KA-BOOM!', 'THWACK!', 'KAPOW!', 'EXCELSIOR!']

export default function ComicCard({
  title,
  description,
  date,
  badge,
  accentColor = 'red',
  earth,
  characters = [],
  universe,
  index = 0,
}: Props) {
  const [hovered, setHovered] = useState(false)
  const reduce = useReducedMotion()
  const hex = accentColor === 'red' ? '#ED1D24' : accentColor === 'blue' ? '#0476F2' : accentColor
  const word = ACTION[index % ACTION.length]

  return (
    <motion.article
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: (index % 6) * 0.06 }}
      whileHover={reduce ? undefined : { y: -8, rotate: -0.75, transition: { type: 'spring', stiffness: 300, damping: 18 } }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        backgroundColor: '#FFF8E7',
        border: '3px solid #1A1A1A',
        boxShadow: hovered ? '9px 9px 0 #1A1A1A' : '4px 4px 0 #1A1A1A',
        transition: 'box-shadow 0.18s ease',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <motion.div style={{ height: 6, backgroundColor: hex }} animate={{ opacity: hovered ? 1 : 0.85 }} />

      {/* Top Banner Box */}
      <div
        style={{
          position: 'relative',
          padding: '1.2rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: 110,
          overflow: 'hidden',
          backgroundColor: hex + '16',
          backgroundImage: `radial-gradient(circle, ${hex}25 1.5px, transparent 1.5px)`,
          backgroundSize: '12px 12px',
          borderBottom: '2px solid #1A1A1A',
        }}
      >
        <span
          style={{
            position: 'absolute',
            right: 6,
            bottom: -8,
            fontFamily: 'Bangers, cursive',
            fontSize: '4.2rem',
            color: '#1A1A1A',
            opacity: 0.08,
            letterSpacing: '0.08em',
            userSelect: 'none',
            lineHeight: 1,
          }}
        >
          {universe || title.slice(0, 3).toUpperCase()}
        </span>

        {/* Earth / Universe Tags */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem', position: 'relative', zIndex: 1 }}>
          {earth ? (
            <span
              style={{
                fontFamily: 'Bangers, cursive',
                fontSize: '0.82rem',
                letterSpacing: '0.06em',
                color: '#1A1A1A',
                backgroundColor: '#FFD700',
                border: '2px solid #1A1A1A',
                padding: '1px 7px',
              }}
            >
              {earth.toUpperCase()}
            </span>
          ) : (
            <div />
          )}

          {badge && (
            <span
              style={{
                fontFamily: 'Bangers, cursive',
                fontSize: '0.78rem',
                letterSpacing: '0.06em',
                color: '#fff',
                backgroundColor: hex,
                border: '2px solid #1A1A1A',
                padding: '1px 7px',
              }}
            >
              {badge}
            </span>
          )}
        </div>

        {/* Hover Action Word */}
        {hovered && (
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: -10 }}
            style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}
          >
            <span
              style={{
                fontFamily: 'Bangers, cursive',
                fontSize: '2.4rem',
                letterSpacing: '0.06em',
                color: '#FFD700',
                WebkitTextStroke: '2px #1A1A1A',
                textShadow: '3px 3px 0 #1A1A1A',
              }}
            >
              {word}
            </span>
          </motion.div>
        )}
      </div>

      {/* Body Content */}
      <div style={{ padding: '1.1rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3
          style={{
            fontFamily: 'Bangers, cursive',
            fontSize: '1.4rem',
            letterSpacing: '0.06em',
            color: '#1A1A1A',
            lineHeight: 1.2,
            marginBottom: '0.4rem',
          }}
        >
          {title}
        </h3>

        <p style={{ fontFamily: 'Comic Neue, cursive', fontSize: '0.88rem', color: '#444', lineHeight: 1.6, flex: 1, marginBottom: '0.9rem' }}>
          {description}
        </p>

        {/* Key Characters Tags */}
        {characters.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.9rem' }}>
            {characters.map((char) => (
              <span
                key={char}
                style={{
                  fontFamily: 'Comic Neue, cursive',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  backgroundColor: '#fff',
                  border: '1.5px solid #1A1A1A',
                  color: '#222',
                  padding: '1px 6px',
                }}
              >
                {char}
              </span>
            ))}
          </div>
        )}

        {/* Card Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '2px dashed #1A1A1A', paddingTop: '0.6rem' }}>
          <span
            style={{
              fontFamily: 'Bangers, cursive',
              fontSize: '0.8rem',
              letterSpacing: '0.06em',
              color: '#fff',
              backgroundColor: '#1A1A1A',
              padding: '2px 8px',
            }}
          >
            {date}
          </span>
          <span
            style={{
              fontFamily: 'Bangers, cursive',
              fontSize: '0.82rem',
              letterSpacing: '0.06em',
              color: hex,
            }}
          >
            FILE DECLASSIFIED
          </span>
        </div>
      </div>
    </motion.article>
  )
}
