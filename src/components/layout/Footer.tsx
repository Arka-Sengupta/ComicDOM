import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Reveal from '../ui/Reveal'

const LINKS = [
  { to: '/',          label: 'Home' },
  { to: '/marvel',    label: 'Marvel' },
  { to: '/dc',        label: 'DC' },
  { to: '/dev-blogs', label: 'The Comicdom gazette' },
]

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#1A1A1A',
        borderTop: '4px solid #FFD700',
        padding: '3rem 1rem 1.5rem',
        marginTop: 'auto',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>

        {/* Brand */}
        <Reveal direction="up" delay={0}>
          <div style={{ fontFamily: 'Bangers, cursive', fontSize: '3rem', letterSpacing: '0.08em', lineHeight: 1, marginBottom: '0.5rem' }}>
            <span style={{ color: '#ED1D24' }}>COMIC</span>
            <span style={{ color: '#0476F2' }}>DOM</span>
          </div>
          <p style={{ fontFamily: 'Comic Neue, cursive', fontSize: '0.9rem', color: '#aaa', maxWidth: 240 }}>
            Your retro-styled, modern knowledge base for all things comic book cinema.
          </p>
        </Reveal>

        {/* Quick Links */}
        <Reveal direction="up" delay={0.1}>
          <h4 style={{ fontFamily: 'Bangers, cursive', fontSize: '1.5rem', letterSpacing: '0.1em', color: '#FFD700', marginBottom: '0.75rem' }}>
            NAVIGATE
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {LINKS.map(l => (
              <Link
                key={l.to}
                to={l.to}
                style={{
                  fontFamily: 'Comic Neue, cursive',
                  color: '#ccc',
                  textDecoration: 'underline',
                  fontSize: '0.95rem',
                  width: 'fit-content',
                  transition: 'color 0.15s, transform 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#FFD700'; e.currentTarget.style.transform = 'translateX(5px)' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#ccc'; e.currentTarget.style.transform = 'translateX(0)' }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </Reveal>

        {/* Wobble badge */}
        <Reveal direction="up" delay={0.2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div
            animate={{ rotate: [-2, 2, -2] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            whileHover={{ scale: 1.05 }}
            style={{
              backgroundColor: '#fff',
              border: '3px solid #FFD700',
              boxShadow: '4px 4px 0 #FFD700',
              padding: '1rem 1.5rem',
              textAlign: 'center',
            }}
          >
            <p style={{ fontFamily: 'Bangers, cursive', fontSize: '1.3rem', letterSpacing: '0.1em', color: '#ED1D24', margin: 0 }}>
              MADE BY AN UNEMPLOYED ENGINEER WHO LOVES SUPERHEROES!
            </p>
            <p style={{ fontFamily: 'Bangers, cursive', fontSize: '1.3rem', letterSpacing: '0.1em', color: '#1A1A1A', margin: 0 }}>
              LOVE Y'ALL 3000
            </p>
          </motion.div>
        </Reveal>
      </div>

      <div style={{ maxWidth: 1200, margin: '2rem auto 0', borderTop: '2px solid #333', paddingTop: '1rem', textAlign: 'center' }}>
        <p style={{ fontFamily: 'Comic Neue, cursive', fontSize: '0.8rem', color: '#555' }}>
          © 2026 ComicDOM. All Rights Reserved.
        </p>
      </div>
    </footer>
  )
}
