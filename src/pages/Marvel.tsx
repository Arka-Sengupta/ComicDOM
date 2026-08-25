import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '../components/ui/PageTransition'
import HalftoneSection from '../components/ui/HalftoneSection'
import ActionWord from '../components/ui/ActionWord'
import ComicCard from '../components/ui/ComicCard'
import { marvelMovies, MarvelUniverse } from '../data/marvel'

export default function Marvel() {
  const [selectedUniverse, setSelectedUniverse] = useState<'NONE' | MarvelUniverse>('NONE')

  const universes = [
    { id: 'MCU', name: 'Marvel Cinematic Universe', logo: '/assets/Marvel_Cinematic_Universe_Logo.webp', color: '#ED1D24' },
    { id: 'FOX', name: 'Fox Universe', logo: '/assets/20th_Century_Studios.svg', color: '#0476F2' },
    { id: 'SONY', name: 'Sony Spiderman Universe', logo: '/assets/Sony_Pictures-Logo.svg', color: '#1A1A1A' }
  ] as const

  return (
    <PageTransition>
      {/* Header */}
      <section
        style={{
          position: 'relative',
          padding: '2rem 1rem',
          overflow: 'hidden',
          backgroundColor: '#ED1D24',
          backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.25) 1.5px, transparent 1.5px)',
          backgroundSize: '14px 14px',
          borderBottom: '4px solid #1A1A1A',
          textAlign: 'center',
        }}
      >
        <div className="animate-float" style={{ position: 'absolute', top: 20, right: 20, opacity: 0.35, zIndex: 20 }}>
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
          <img src="/assets/Marvel_Logo.webp" alt="MarvelLogo" style={{ display: 'block', margin: '0 auto', transform: 'scale(0.5)' }} />
        </motion.h1>
      </section>

      <HalftoneSection color="cream" style={{ padding: '3rem 1rem 5rem', minHeight: '80vh' }}>
        <AnimatePresence mode="wait">
          {selectedUniverse === 'NONE' ? (
            <motion.div
              key="universes"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                maxWidth: 1200,
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
                paddingTop: '2rem'
              }}
            >
              {universes.map((u, i) => (
                <motion.div
                  key={u.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  onClick={() => setSelectedUniverse(u.id as MarvelUniverse)}
                  style={{
                    backgroundColor: '#FFF8E7',
                    border: '4px solid #1A1A1A',
                    boxShadow: `8px 8px 0 ${u.color}`,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '3rem 2rem',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ position: 'absolute', top: -20, left: -20, opacity: 0.1, fontSize: '10rem', fontFamily: 'Bangers, cursive', color: u.color }}>
                    {u.id}
                  </div>
                  <div style={{
                    // width: 150,
                    // height: 150,
                    // borderRadius: '50%',
                    // backgroundColor: u.color + '33',
                    // border: `4px solid ${u.color}`,
                    // marginBottom: '2rem',
                    // display: 'flex',
                    // alignItems: 'center',
                    // justifyContent: 'center',
                    // overflow: 'hidden'
                  }}>
                    {/* Company logo */}
                  <img
                    src={u.logo}
                    alt={u.name}
                    style={{
                      width: '80%',
                      height: '80%',
                      objectFit: 'contain',
                      transform: u.id === 'SONY' ? 'scale(2)' : 'scale(1.4)',
                    }}
                  />
                  </div>
                  <h2 style={{
                    fontFamily: 'Bangers, cursive',
                    fontSize: '2.5rem',
                    letterSpacing: '0.05em',
                    color: '#1A1A1A',
                    lineHeight: 1.1,
                    textShadow: '2px 2px 0px #fff'
                  }}>
                    {u.name}
                  </h2>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="timeline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ maxWidth: 1000, margin: '0 auto', position: 'relative' }}
            >
              <button
                onClick={() => setSelectedUniverse('NONE')}
                style={{
                  fontFamily: 'Bangers, cursive',
                  fontSize: '1.2rem',
                  padding: '8px 24px',
                  backgroundColor: '#ED1D24',
                  color: '#fff',
                  border: '3px solid #1A1A1A',
                  boxShadow: '3px 3px 0 #1A1A1A',
                  cursor: 'pointer',
                  marginBottom: '3rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  position: 'relative',
                  zIndex: 10
                }}
              >
                ← BACK TO MULTIVERSE
              </button>

              <div style={{ textAlign: 'center', marginBottom: '4rem', position: 'relative', zIndex: 10 }}>
                <h2 style={{
                  fontFamily: 'Bangers, cursive',
                  fontSize: '3rem',
                  letterSpacing: '0.05em',
                  color: '#1A1A1A',
                  textShadow: '3px 3px 0px #FFD700',
                  display: 'inline-block',
                  borderBottom: '4px solid #1A1A1A',
                  paddingBottom: '0.5rem'
                }}>
                  {selectedUniverse === 'MCU' ? 'EARTH-616 TIMELINE' : `${selectedUniverse} TIMELINE`}
                </h2>
              </div>

              {/* Timeline Container */}
              <div className="relative py-8 md:py-16 flex flex-col items-center">
                
                {/* Visual Timeline Background - Hidden on mobile */}
                <div className="hidden md:flex absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[100vw] flex-col z-0 pointer-events-none overflow-hidden"
                     style={{ filter: 'blur(6px) brightness(0.8)' }}>
                  <img 
                    src="/assets/timeline.png" 
                    alt="Timeline Start" 
                    className="w-full h-auto block object-cover" 
                  />
                  <div className="flex-1 w-full bg-[url('/assets/extension.png')] bg-repeat-y bg-[100%_auto] bg-top" />
                </div>

                {marvelMovies
                  .filter(m => m.universe === selectedUniverse)
                  .map((movie, index) => {
                    const isLeft = index % 2 === 0;
                    return (
                      <div key={movie.id} 
                           className={`w-full flex mb-8 md:mb-16 relative z-10 justify-center ${isLeft ? 'md:justify-start' : 'md:justify-end'}`}>
                        
                        {/* Node / Card */}
                        <motion.div
                          initial={{ opacity: 0, y: 50, scale: 0.8 }}
                          whileInView={{ opacity: 1, y: 0, scale: 1 }}
                          viewport={{ once: false, margin: '-100px' }}
                          transition={{ duration: 0.5, delay: 0.1, type: 'spring' }}
                          className={`w-full px-4 md:px-0 md:w-[calc(50%-2rem)] ${isLeft ? 'md:pr-4' : 'md:pl-4'}`}
                        >
                          <div
                            onClick={() => {
                              import('../utils/comicAlert').then(({ showComicAlert }) => {
                                showComicAlert({
                                  title: movie.title,
                                  text: movie.description + '\n\nStarring: ' + movie.characters.join(', '),
                                  icon: 'info'
                                })
                              })
                            }}
                            className="cursor-pointer"
                          >
                            <ComicCard
                              title={movie.title}
                              description={movie.description}
                              date={movie.date}
                              badge={movie.badge}
                              accentColor={movie.accentColor}
                              earth={movie.earth}
                              characters={movie.characters}
                              universe={movie.universe}
                              index={index}
                            />
                          </div>
                        </motion.div>
                      </div>
                    )
                  })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </HalftoneSection>
    </PageTransition>
  )
}
