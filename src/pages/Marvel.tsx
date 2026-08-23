import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '../components/ui/PageTransition'
import HalftoneSection from '../components/ui/HalftoneSection'
import ComicCard from '../components/ui/ComicCard'
import ActionWord from '../components/ui/ActionWord'
import { marvelMovies } from '../data/marvel'

type Filter = 'ALL' | 'Phase 5' | 'Phase 6' | 'Upcoming'
const FILTERS: Filter[] = ['ALL', 'Phase 5', 'Phase 6', 'Upcoming']

export default function Marvel() {
  const [active, setActive] = useState<Filter>('ALL')

  const filtered = active === 'ALL'
    ? marvelMovies
    : marvelMovies.filter(m => m.badge === active)

  return (
    <PageTransition>
      {/* Header */}
      <section
        style={{
          position: 'relative',
          padding: '5rem 1rem 4rem',
          overflow: 'hidden',
          backgroundColor: '#ED1D24',
          backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.25) 1.5px, transparent 1.5px)',
          backgroundSize: '14px 14px',
          borderBottom: '4px solid #1A1A1A',
          textAlign: 'center',
        }}
      >
        <div style={{ position: 'absolute', top: 20, right: 20, opacity: 0.35 }}>
          <ActionWord word="EXCELSIOR!" color="#FFD700" size="lg" rotate={-8} />
        </div>

        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          style={{
            fontFamily: 'Bangers, cursive',
            fontSize: 'clamp(4rem, 14vw, 10rem)',
            letterSpacing: '0.06em',
            color: '#fff',
            WebkitTextStroke: '3px #1A1A1A',
            textShadow: '7px 7px 0 #1A1A1A',
            margin: 0,
            lineHeight: 1,
          }}
        >
          MARVEL
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          style={{
            fontFamily: 'Bangers, cursive',
            fontSize: '1.8rem',
            letterSpacing: '0.12em',
            color: '#FFD700',
            textShadow: '2px 2px 0 #1A1A1A',
            marginTop: '0.25rem',
          }}
        >
          THE CINEMATIC UNIVERSE
        </motion.p>
      </section>

      {/* Filter Bar */}
      <HalftoneSection color="cream" style={{ padding: '1.5rem 1rem', borderBottom: '4px solid #1A1A1A' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '0.6rem', justifyContent: 'center' }}>
          {FILTERS.map(f => (
            <motion.button
              key={f}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActive(f)}
              style={{
                fontFamily: 'Bangers, cursive',
                fontSize: '1.05rem',
                letterSpacing: '0.1em',
                padding: '6px 20px',
                border: '3px solid #1A1A1A',
                boxShadow: active === f ? '4px 4px 0 #ED1D24' : '3px 3px 0 #1A1A1A',
                backgroundColor: active === f ? '#ED1D24' : '#fff',
                color: active === f ? '#fff' : '#1A1A1A',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {f}
            </motion.button>
          ))}
        </div>
      </HalftoneSection>

      {/* Grid */}
      <HalftoneSection color="cream" style={{ padding: '4rem 1rem 5rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}
            >
              {filtered.map((movie, i) => (
                <ComicCard
                  key={movie.id}
                  title={movie.title}
                  description={movie.description}
                  date={movie.date}
                  badge={movie.badge}
                  accentColor="red"
                  index={i}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', paddingTop: '4rem' }}>
              <ActionWord word="OOPS!" color="#ED1D24" size="xl" rotate={-5} />
              <p style={{ fontFamily: 'Bangers, cursive', fontSize: '1.5rem', letterSpacing: '0.1em', color: '#1A1A1A', marginTop: '1.5rem' }}>
                NO MOVIES IN THIS CATEGORY YET!
              </p>
            </div>
          )}
        </div>
      </HalftoneSection>
    </PageTransition>
  )
}
