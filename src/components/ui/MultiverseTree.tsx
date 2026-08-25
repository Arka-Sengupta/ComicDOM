import { useMemo, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls, Scroll, Html, Float } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import ComicCard from './ComicCard'
import { MarvelMovie } from '../../data/marvel'

interface MultiverseTreeProps {
  movies: MarvelMovie[]
  onClose: () => void
}

function GlowingBranch({ curve, color = '#ffffff', thickness = 0.1, opacity = 1 }: { curve: THREE.Curve<THREE.Vector3>, color?: string, thickness?: number, opacity?: number }) {
  const tubeGeo = useMemo(() => new THREE.TubeGeometry(curve, 64, thickness, 8, false), [curve, thickness])
  
  return (
    <mesh geometry={tubeGeo}>
      {/* Multiply color by a high factor to push it into HDR range for the Bloom effect */}
      <meshBasicMaterial 
        color={new THREE.Color(color).multiplyScalar(2.5)} 
        transparent 
        opacity={opacity}
        toneMapped={false}
      />
    </mesh>
  )
}

function TreeScene({ movies }: { movies: MarvelMovie[] }) {
  const length = movies.length * 4 + 10

  // Generate 3 intertwined strands for the main trunk (Yggdrasil roots)
  const trunks = useMemo(() => {
    return [0, 1, 2].map(offset => {
      const points = []
      // We go from Y = 2 down to Y = -length
      for (let i = -2; i <= length; i += 0.5) {
        points.push(new THREE.Vector3(
          Math.sin(i * 0.4 + offset * 2.1) * 0.8,
          -i,
          Math.cos(i * 0.3 + offset * 1.5) * 0.8
        ))
      }
      return new THREE.CatmullRomCurve3(points)
    })
  }, [length])

  // Branches
  const branches = useMemo(() => {
    return movies.map((movie, index) => {
      const isLeft = index % 2 === 0
      const startY = - (index * 4 + 4) // Spaced out every 4 units down
      
      // Starting on the trunk
      const startPoint = new THREE.Vector3(
        Math.sin(-startY * 0.4) * 0.8, 
        startY, 
        Math.cos(-startY * 0.3) * 0.8
      )
      
      // End point outward
      const endX = isLeft ? -5 : 5
      const endPoint = new THREE.Vector3(endX, startY - 0.5, 0)
      
      // Control points for a sweeping, organic curve
      const cp1 = new THREE.Vector3(isLeft ? -1.5 : 1.5, startY + 1.5, 1)
      const cp2 = new THREE.Vector3(isLeft ? -3 : 3, startY - 1.5, -1)
      
      const curve = new THREE.CubicBezierCurve3(startPoint, cp1, cp2, endPoint)
      return { curve, endPoint, movie, isLeft }
    })
  }, [movies])

  return (
    <group>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.4}>
        {trunks.map((curve, i) => (
          <GlowingBranch 
            key={`trunk-${i}`}
            curve={curve} 
            color={i === 0 ? "#4488ff" : i === 1 ? "#aa44ff" : "#44ffee"} 
            thickness={0.08} 
            opacity={0.8}
          />
        ))}

        {branches.map((b, i) => (
          <group key={b.movie.id}>
            <GlowingBranch curve={b.curve} color={b.isLeft ? '#88ccff' : '#aa88ff'} thickness={0.05} />
            
            {/* HTML overlay anchored to the end of the 3D branch */}
            <Html position={b.endPoint} center zIndexRange={[100, 0]}>
              <div 
                style={{ width: 320, cursor: 'pointer' }} 
                onClick={() => {
                  import('../../utils/comicAlert').then(({ showComicAlert }) => {
                    showComicAlert({
                      title: b.movie.title,
                      text: b.movie.description + '\n\nStarring: ' + b.movie.characters.join(', '),
                      icon: 'info'
                    })
                  })
                }}
              >
                <div style={{ pointerEvents: 'none' }}>
                  <ComicCard
                    title={b.movie.title}
                    description={b.movie.description}
                    date={b.movie.date}
                    badge={b.movie.badge}
                    accentColor={b.movie.accentColor}
                    earth={b.movie.earth}
                    characters={b.movie.characters}
                    universe={b.movie.universe}
                    index={i}
                  />
                </div>
              </div>
            </Html>
          </group>
        ))}
      </Float>

      {/* Floating particles (Stars/Dust) */}
      {Array.from({ length: 60 }).map((_, i) => (
        <mesh 
          key={`dust-${i}`} 
          position={[
            (Math.random() - 0.5) * 15, 
            - (Math.random() * length), 
            (Math.random() - 0.5) * 10
          ]}
        >
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

export default function MultiverseTree({ movies, onClose }: MultiverseTreeProps) {
  const pages = Math.max(1, (movies.length * 4 + 10) / 8) // Calculate scroll height based on movie count

  // Hide body overflow to prevent double scrollbars since ScrollControls handles it
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 50, backgroundColor: '#020205', backgroundImage: 'radial-gradient(circle at center, #0a0a2a 0%, #000000 100%)' }}>
      
      {/* Back Button */}
      <button 
        onClick={onClose}
        style={{
          position: 'absolute', top: '2rem', left: '2rem', zIndex: 1000,
          fontFamily: 'Bangers, cursive', fontSize: '1.2rem', padding: '8px 24px',
          backgroundColor: '#ED1D24', color: '#fff', border: '3px solid #1A1A1A',
          boxShadow: '3px 3px 0 #1A1A1A', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'
        }}
      >
        ← ESCAPE THE VOID
      </button>

      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ScrollControls pages={pages} damping={0.25} distance={1.2}>
          <Scroll>
             <TreeScene movies={movies} />
          </Scroll>
        </ScrollControls>

        {/* Cinematic Post-Processing */}
        <EffectComposer>
          <Bloom luminanceThreshold={0.1} mipmapBlur intensity={1.8} radius={0.8} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
