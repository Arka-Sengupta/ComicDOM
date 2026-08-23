import { motion } from 'framer-motion'
import { BlogPost } from '../../data/blogs'

const CAT_COLORS: Record<string, string> = {
  Leak:   '#ED1D24',
  Rumor:  '#FF6B00',
  Expo:   '#0476F2',
  Review: '#22C55E',
}

interface Props {
  post: BlogPost
  index?: number
}

export default function BlogCard({ post, index = 0 }: Props) {
  const accent = CAT_COLORS[post.category] ?? '#1A1A1A'

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12 }}
      whileHover={{ y: -6 }}
      style={{
        position: 'relative',
        backgroundColor: '#FFF8E7',
        border: '3px solid #1A1A1A',
        boxShadow: '6px 6px 0 #1A1A1A',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Breaking ribbon */}
      {post.featured && (
        <div
          style={{
            position: 'absolute',
            top: 18,
            right: -36,
            transform: 'rotate(45deg)',
            backgroundColor: '#ED1D24',
            color: '#fff',
            fontFamily: 'Bangers, cursive',
            fontSize: '0.75rem',
            letterSpacing: '0.06em',
            padding: '3px 44px',
            border: '2px solid #1A1A1A',
            zIndex: 10,
          }}
        >
          BREAKING!
        </div>
      )}

      {/* Accent strip */}
      <div style={{ height: 6, backgroundColor: accent }} />

      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Category + meta */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span
            style={{
              fontFamily: 'Bangers, cursive',
              fontSize: '0.8rem',
              letterSpacing: '0.08em',
              color: '#fff',
              backgroundColor: accent,
              border: '2px solid #1A1A1A',
              padding: '2px 10px',
            }}
          >
            {post.category.toUpperCase()}
          </span>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontFamily: 'Comic Neue, cursive', fontSize: '0.75rem', color: '#888' }}>{post.readTime}</span>
            <span
              style={{
                fontFamily: 'Bangers, cursive',
                fontSize: '0.75rem',
                letterSpacing: '0.06em',
                color: '#1A1A1A',
                backgroundColor: '#FFD700',
                border: '2px solid #1A1A1A',
                padding: '1px 8px',
              }}
            >
              {post.date}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3
          style={{
            fontFamily: 'Bangers, cursive',
            fontSize: '1.4rem',
            letterSpacing: '0.06em',
            color: '#1A1A1A',
            lineHeight: 1.25,
            marginBottom: '0.6rem',
          }}
        >
          {post.title}
        </h3>

        {/* Excerpt */}
        <p style={{ fontFamily: 'Comic Neue, cursive', fontSize: '0.875rem', color: '#555', lineHeight: 1.65, flex: 1, marginBottom: '1rem' }}>
          {post.excerpt}
        </p>

        {/* CTA */}
        <motion.div
          whileHover={{ backgroundColor: accent, color: '#fff' }}
          style={{
            fontFamily: 'Bangers, cursive',
            fontSize: '0.9rem',
            letterSpacing: '0.08em',
            color: '#fff',
            backgroundColor: '#1A1A1A',
            padding: '6px 16px',
            alignSelf: 'flex-start',
            transition: 'background-color 0.2s, color 0.2s',
          }}
        >
          READ FULL POST →
        </motion.div>
      </div>
    </motion.article>
  )
}
