import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageTransition from '../components/ui/PageTransition'
import HalftoneSection from '../components/ui/HalftoneSection'
import SpeechBubble from '../components/ui/SpeechBubble'
import ActionWord from '../components/ui/ActionWord'
import BlogCard from '../components/ui/BlogCard'
import { blogPosts } from '../data/blogs'

function StarBurst({ style }: { style?: React.CSSProperties }) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 22, ease: 'linear' }}
      style={{ position: 'absolute', pointerEvents: 'none', userSelect: 'none', ...style }}
    >
      {/* <svg width="110" height="110" viewBox="0 0 110 110">
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={i}
            x1="55" y1="55"
            x2={55 + 50 * Math.cos((i * 30 * Math.PI) / 180)}
            y2={55 + 50 * Math.sin((i * 30 * Math.PI) / 180)}
            stroke="#1A1A1A"
            strokeWidth="3"
          />
        ))}
        <circle cx="55" cy="55" r="14" fill="#FFD700" stroke="#1A1A1A" strokeWidth="3" />
      </svg> */}
    </motion.div>
  )
}

const ABOUT = [
  { n: '01', title: 'WHAT?', body: 'ComicDOM is your one-stop knowledge base for everything about American comic book movies — from the MCU to the DCU.', color: '#ED1D24', word: 'SCHWIP!' },
  { n: '02', title: 'WHY?',  body: 'Every comic fan deserves a stylish, organized hub to track movies, timelines, and the latest buzz from the comic movie universe.', color: '#0476F2', word: 'BOOM!' },
  { n: '03', title: 'HOW?',  body: 'Browse Marvel and DC sections, filter by phase or era, and check Dev Blogs for hot leaks and expo news — all in one place.', color: '#1A1A1A', word: '#*@$' },
]

export default function Home() {
  return (
    <PageTransition>
      {/* HERO */}
      <HalftoneSection
        color="yellow"
        style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 1rem', position: 'relative', overflow: 'hidden' }}
      >
        <StarBurst style={{ top: 40, left: 40, opacity: 0.65 }} />
        <StarBurst style={{ bottom: 80, right: 60, opacity: 0.45 }} />
        <StarBurst style={{ top: '45%', right: 20, opacity: 0.25 }} />

        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 180, damping: 20, delay: 0.15 }}
          style={{ textAlign: 'center', marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}
        >
          <h1 style={{ fontFamily: 'Bangers, cursive', lineHeight: 0.9, fontSize: 'clamp(5rem, 18vw, 14rem)', letterSpacing: '0.05em', margin: 0 }}>
            <motion.span
              initial={{ x: -120, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.3 }}
              style={{ display: 'block', color: '#ED1D24', WebkitTextStroke: '4px #1A1A1A', textShadow: '7px 7px 0 #1A1A1A' }}
            >
              COMIC
            </motion.span>
            <motion.span
              initial={{ x: 120, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.5 }}
              style={{ display: 'block', color: '#0476F2', WebkitTextStroke: '4px #1A1A1A', textShadow: '7px 7px 0 #1A1A1A' }}
            >
              DOM
            </motion.span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22, delay: 0.85 }}
          style={{ position: 'relative', zIndex: 1, marginBottom: '2.5rem' }}
        >
          <SpeechBubble color="#ffffff" tailDirection="top-left">
            <span style={{ fontSize: '1.3rem' }}>YOUR UNIVERSE. YOUR KNOWLEDGE BASE!</span>
          </SpeechBubble>
        </motion.div>

        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.45 }}
          style={{ display: 'flex', gap: '1rem', position: 'relative', zIndex: 1, flexWrap: 'wrap', justifyContent: 'center' }}
        >
          {[
            { to: '/marvel', label: 'MARVEL \u2192', bg: '#ED1D24' },
            { to: '/dc',     label: 'DC \u2192',     bg: '#0476F2' },
          ].map(btn => (
            <Link key={btn.to} to={btn.to} style={{ textDecoration: 'none' }}>
              <motion.button
                whileHover={{ scale: 1.06, y: -3 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  fontFamily: 'Bangers, cursive', fontSize: '1.3rem', letterSpacing: '0.1em',
                  padding: '0.6rem 2rem', backgroundColor: btn.bg, color: '#fff',
                  border: '3px solid #1A1A1A', boxShadow: '5px 5px 0 #1A1A1A', cursor: 'pointer',
                }}
              >
                {btn.label}
              </motion.button>
            </Link>
          ))}
        </motion.div>

        {/* <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.6 }}
          style={{ position: 'absolute', bottom: '2rem', fontFamily: 'Bangers, cursive', letterSpacing: '0.1em', fontSize: '0.9rem', color: '#1A1A1A', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
        >
          <span>SCROLL DOWN</span>
          <span style={{ fontSize: '1.4rem' }}>\u2193</span>
        </motion.div> */}
      </HalftoneSection>

      {/* ABOUT STRIP */}
      <HalftoneSection color="cream" style={{ padding: '5rem 1rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ fontFamily: 'Bangers, cursive', fontSize: 'clamp(2.5rem, 6vw, 5rem)', letterSpacing: '0.1em', textAlign: 'center', color: '#1A1A1A', textShadow: '4px 4px 0 #FFD700', marginBottom: '3rem' }}
          >
            WHAT IS COMICDOM?
          </motion.h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', border: '4px solid #1A1A1A' }}>
            {ABOUT.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                style={{
                  position: 'relative', padding: '2rem',
                  borderRight: i < ABOUT.length - 1 ? '4px solid #1A1A1A' : 'none',
                  backgroundColor: p.color + '14', overflow: 'hidden',
                }}
              >
                <span style={{ position: 'absolute', top: -10, right: 0, fontFamily: 'Bangers, cursive', fontSize: '7rem', color: '#1A1A1A', opacity: 0.07, userSelect: 'none', lineHeight: 1 }}>
                  {p.n}
                </span>
                <div style={{ position: 'absolute', top: 12, right: 12 }}>
                  <ActionWord word={p.word} color={p.color === '#1A1A1A' ? '#FFD700' : p.color} size="sm" rotate={-10} />
                </div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <h3 style={{ fontFamily: 'Bangers, cursive', fontSize: '2.8rem', letterSpacing: '0.1em', color: p.color === '#1A1A1A' ? '#FFD700' : p.color, textShadow: '2px 2px 0 #1A1A1A', marginBottom: '0.75rem' }}>
                    {p.title}
                  </h3>
                  <p style={{ fontFamily: 'Comic Neue, cursive', fontSize: '1.05rem', lineHeight: 1.65, color: '#1A1A1A' }}>
                    {p.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </HalftoneSection>

      {/* UNIVERSES */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        {[
          { to: '/marvel', label: 'MARVEL', sub: 'Explore the Marvel Cinematic Universe \u2014 all phases, all heroes.', btn: 'ENTER MARVEL \u2192', hex: '#ED1D24', word: 'I am inevitable!', wrot: -12 },
          { to: '/dc',     label: 'DC',     sub: 'Dive into the DC Universe \u2014 from the classics to the Gunn era.',  btn: 'ENTER DC \u2192',     hex: '#0476F2', word: 'I am Rich!',  wrot: 14 },
        ].map((u, i) => (
          <motion.div
            key={u.to}
            initial={{ opacity: 0, x: i === 0 ? -60 : 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            style={{
              position: 'relative', minHeight: 380, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', padding: '3rem 2rem', overflow: 'hidden',
              backgroundColor: u.hex,
              backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.22) 1.5px, transparent 1.5px)',
              backgroundSize: '14px 14px',
              borderRight: i === 0 ? '4px solid #1A1A1A' : 'none',
            }}
          >
            <div style={{ position: 'absolute', bottom: 16, right: 16, opacity: 0.22 }}>
              <ActionWord word={u.word} color="#FFD700" size="md" rotate={u.wrot} />
            </div>
            <h2 style={{ fontFamily: 'Bangers, cursive', fontSize: 'clamp(4rem, 10vw, 7rem)', letterSpacing: '0.08em', color: '#fff', WebkitTextStroke: '3px #1A1A1A', textShadow: '6px 6px 0 #1A1A1A', marginBottom: '0.5rem', textAlign: 'center' }}>
              {u.label}
            </h2>
            <p style={{ fontFamily: 'Comic Neue, cursive', color: 'rgba(255,255,255,0.9)', textAlign: 'center', maxWidth: 300, marginBottom: '1.5rem', fontSize: '1.05rem' }}>
              {u.sub}
            </p>
            <Link to={u.to} style={{ textDecoration: 'none' }}>
              <motion.button
                whileHover={{ scale: 1.08, y: -3 }}
                whileTap={{ scale: 0.95 }}
                style={{ fontFamily: 'Bangers, cursive', fontSize: '1.2rem', letterSpacing: '0.1em', padding: '0.6rem 1.8rem', backgroundColor: '#FFD700', color: '#1A1A1A', border: '3px solid #1A1A1A', boxShadow: '5px 5px 0 #1A1A1A', cursor: 'pointer' }}
              >
                {u.btn}
              </motion.button>
            </Link>
          </motion.div>
        ))}
      </section>

      {/* BLOG PREVIEW */}
      <HalftoneSection color="black" style={{ padding: '5rem 1rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <motion.h2
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              style={{ fontFamily: 'Bangers, cursive', fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '0.1em', color: '#FFD700', textShadow: '4px 4px 0 #ED1D24', margin: 0 }}
            >
              LATEST DISPATCHES
            </motion.h2>
            <Link to="/dev-blogs" style={{ textDecoration: 'none' }}>
              <motion.span whileHover={{ x: 5 }} style={{ fontFamily: 'Bangers, cursive', fontSize: '1.2rem', letterSpacing: '0.1em', color: '#FFD700', display: 'inline-block' }}>
                CLICK HERE FOR THE FULL COMICDOM GAZETTE
              </motion.span>
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {blogPosts.map((post, i) => (
              <BlogCard key={post.id} post={post} index={i} />
            ))}
          </div>
        </div>
      </HalftoneSection>
    </PageTransition>
  )
}
