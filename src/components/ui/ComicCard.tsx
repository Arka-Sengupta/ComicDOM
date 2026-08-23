import { motion } from 'framer-motion'
import { useState } from 'react'

interface Props {
  title: string
  description: string
  date: string
  badge?: string
  accentColor?: 'red' | 'blue'
  index?: number
}

const ACTION = ['POW!', 'ZAP!', 'BAM!', 'WHAM!', 'KA-BOOM!', 'THWACK!']

export default function ComicCard({ title, description, date, badge, accentColor = 'red', index = 0 }: Props) {
  const [hovered, setHovered] = useState(false)
  const hex = accentColor === 'red' ? '#ED1D24' : '#0476F2'
  const word = ACTION[index % ACTION.length]

  return (
    <motion.article
      initial={{ opacity: 0, y: 40, rotate: -2 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -8, rotate: 1 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        backgroundColor: '#FFF8E7',
        border: '3px solid #1A1A1A',
        boxShadow: hovered ? '8px 8px 0 #1A1A1A' : '5px 5px 0 #1A1A1A',
        transition: 'box-shadow 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ height: 6, backgroundColor: hex }} />

      <div
        style={{
          position: 'relative',
          height: 180,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          backgroundColor: hex + '18',
          backgroundImage: `radial-gradient(circle, $hex}28 1.5px, transparent 1.5px)`,
          backgroundSize: '12px 12px',
        }}
      >
        <span
          style={{
            fontFamily: 'Bangers, cursive',
            fontSize: '5rem',
            color: '#1A1A1A',
            opacity: 0.12,
            letterSpacing: '0.1em',
            userSelect: 'none',
          }}
        >
          {title.slice(0, 2).toUpperCase()}
        </span>

        {badge && (
          <span
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              fontFamily: 'Bangers, cursive',
              fontSize: '0.75rem',
              letterSpacing: '0.08em',
              color: '#fff',
              backgroundColor: hex,
              border: '2px solid #1A1A1A',
              padding: '2px 8px',
            }}
          >
            {badge}
          </span>
        )}

        {hovered && (
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: -12 }}
            style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <span
              style={{
                fontFamily: 'Bangers, cursive',
                fontSize: '3rem',
                letterSpacing: '0.06em',
                color: '#FFD700',
                WebkitTextStroke: '3px #1A1A1A',
                textShadow: '3px 3px 0 #1A1A1A',
              }}
            >
              {word}
            </span>
          </motion.div>
        )}
      </div>

      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3
          style={{
            fontFamily: 'Bangers, cursive',
            fontSize: '1.5rem',
            letterSpacing: '0.08em',
            color: '#1A1A1A',
            lineHeight: 1.2,
            marginBottom: '0.4rem',
          }}
        >
          {title}
        </h3>
        <p style={{ fontFamily: 'Comic Neue, cursive', fontSize: '0.875rem', color: '#444', lineHeight: 1.6, flex: 1, marginBottom: '0.75rem' }}>
          {description}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
          <motion.span
            animate={hovered ? { x: 4 } : { x: 0 }}
            style={{ fontFamily: 'Bangers, cursive', fontSize: '0.85rem', letterSpacing: '0.06em', color: hex }}
          >
            READ MORE →
          </motion.span>
        </div>
      </div>
    </motion.article>
  )
}
