import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageTransition from '../components/ui/PageTransition'
import HalftoneSection from '../components/ui/HalftoneSection'
import ActionWord from '../components/ui/ActionWord'

export default function NotFound() {
  return (
    <PageTransition>
      <HalftoneSection color="cream" style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 1rem' }}>
        
        <div style={{ position: 'relative', marginBottom: '3rem' }}>
          <ActionWord word="404!" color="#ED1D24" size="xl" rotate={-8} />
        </div>

        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 20 }}
          style={{
            backgroundColor: '#FFF8E7',
            border: '5px solid #1A1A1A',
            boxShadow: '12px 12px 0 #1A1A1A',
            padding: '1rem',
            position: 'relative',
            maxWidth: '350px',
            width: '100%',
            marginBottom: '3rem',
            transform: 'rotate(2deg)'
          }}
        >
          {/* Spidey hanging upside down! */}
          <img 
            src="/assets/spidey.gif" 
            alt="Spider-Man upside down" 
            style={{ width: '100%', height: 'auto', border: '3px solid #1A1A1A', display: 'block' }} 
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ textAlign: 'center', maxWidth: '600px' }}
        >
          <h2 style={{
            fontFamily: 'Bangers, cursive',
            fontSize: '3rem',
            letterSpacing: '0.05em',
            color: '#1A1A1A',
            marginBottom: '1rem',
            lineHeight: 1.1
          }}>
            UH OH! LOOKS LIKE YOU'RE LOST IN THE MULTIVERSE!
          </h2>
          
          <p style={{
            fontFamily: 'Comic Neue, cursive',
            fontSize: '1.2rem',
            color: '#444',
            fontWeight: 700,
            marginBottom: '2.5rem'
          }}>
            The page you're looking for doesn't exist. Spidey says it's a dead end!
          </p>

          <Link to="/" style={{ textDecoration: 'none' }}>
            <motion.button
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              style={{
                fontFamily: 'Bangers, cursive',
                fontSize: '1.4rem',
                padding: '12px 40px',
                backgroundColor: '#ED1D24',
                color: '#fff',
                border: '3px solid #1A1A1A',
                boxShadow: '5px 5px 0 #1A1A1A',
                cursor: 'pointer',
                letterSpacing: '0.08em',
                transition: 'box-shadow 0.15s ease'
              }}
            >
              SWING BACK HOME
            </motion.button>
          </Link>
        </motion.div>
      </HalftoneSection>
    </PageTransition>
  )
}
