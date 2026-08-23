import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../firebase"
import { BlogDoc } from "../types/blog"
import PageTransition from "../components/ui/PageTransition"
import HalftoneSection from "../components/ui/HalftoneSection"

const CAT_COLORS: Record<string, string> = {
  Leak: "#ED1D24", Rumor: "#FF6B00", Expo: "#0476F2", Review: "#22C55E",
}

export default function BlogPost() {
  const { id } = useParams<{ id: string }>()
  const [post, setPost] = useState<BlogDoc | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) return
    getDoc(doc(db, "blogs", id)).then(snap => {
      if (snap.exists()) setPost({ id: snap.id, ...snap.data() } as BlogDoc)
      else setNotFound(true)
      setLoading(false)
    }).catch(() => { setNotFound(true); setLoading(false) })
  }, [id])

  if (loading) {
    return (
      <PageTransition>
        <HalftoneSection color="cream" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <motion.p animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}
            style={{ fontFamily: "Bangers, cursive", fontSize: "2.5rem", letterSpacing: "0.1em", color: "#ED1D24" }}>
            LOADING...
          </motion.p>
        </HalftoneSection>
      </PageTransition>
    )
  }

  if (notFound || !post) {
    return (
      <PageTransition>
        <HalftoneSection color="cream" style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5rem" }}>
          <p style={{ fontFamily: "Bangers, cursive", fontSize: "3rem", letterSpacing: "0.1em", color: "#ED1D24", textShadow: "4px 4px 0 #1A1A1A" }}>
            POST NOT FOUND!
          </p>
          <Link to="/dev-blogs" style={{ fontFamily: "Bangers, cursive", fontSize: "1.2rem", letterSpacing: "0.1em", color: "#fff", backgroundColor: "#1A1A1A", padding: "8px 24px", textDecoration: "none", display: "inline-block" }}>
            BACK TO THE GAZETTE
          </Link>
        </HalftoneSection>
      </PageTransition>
    )
  }

  const accent = CAT_COLORS[post.category] ?? "#1A1A1A"
  const dateStr = post.createdAt
    ? new Date(post.createdAt.seconds * 1000).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : ""

  return (
    <PageTransition>
      {/* Hero banner */}
      <section style={{
        backgroundColor: accent,
        backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.22) 1.5px, transparent 1.5px)",
        backgroundSize: "14px 14px",
        padding: "4rem 1rem 3rem",
        borderBottom: "4px solid #1A1A1A",
      }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <Link to="/dev-blogs"
            style={{ fontFamily: "Bangers, cursive", fontSize: "1rem", letterSpacing: "0.1em", color: "#FFD700", textDecoration: "none", display: "inline-block", marginBottom: "1rem", border: "2px solid #FFD700", padding: "3px 14px" }}>
            &larr; THE GAZETTE
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "Bangers, cursive", fontSize: "0.85rem", letterSpacing: "0.08em", color: "#fff", backgroundColor: "rgba(0,0,0,0.3)", border: "2px solid rgba(255,255,255,0.4)", padding: "2px 10px" }}>
              {post.category.toUpperCase()}
            </span>
            {post.featured && (
              <span style={{ fontFamily: "Bangers, cursive", fontSize: "0.85rem", letterSpacing: "0.08em", color: "#FFD700", border: "2px solid #FFD700", padding: "2px 10px" }}>
                BREAKING!
              </span>
            )}
          </div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            style={{ fontFamily: "Bangers, cursive", fontSize: "clamp(2rem, 6vw, 4rem)", letterSpacing: "0.04em", color: "#fff", WebkitTextStroke: "1px rgba(0,0,0,0.3)", lineHeight: 1.1, marginBottom: "1rem" }}>
            {post.title}
          </motion.h1>

          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            {dateStr && <span style={{ fontFamily: "Comic Neue, cursive", fontSize: "0.9rem", color: "rgba(255,255,255,0.85)" }}>{dateStr}</span>}
            <span style={{ fontFamily: "Comic Neue, cursive", fontSize: "0.9rem", color: "rgba(255,255,255,0.85)" }}>{post.readTime}</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <HalftoneSection color="cream" style={{ padding: "3rem 1rem 5rem" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          {/* Lead paragraph */}
          <p style={{ fontFamily: "Comic Neue, cursive", fontSize: "1.15rem", fontWeight: 700, color: "#1A1A1A", lineHeight: 1.75, borderLeft: "5px solid " + accent, paddingLeft: "1rem", marginBottom: "2rem", fontStyle: "italic" }}>
            {post.excerpt}
          </p>

          <div style={{ height: 3, backgroundColor: "#1A1A1A", marginBottom: "2rem" }} />

          {/* Full body — split on blank lines */}
          <div style={{ fontFamily: "Comic Neue, cursive", fontSize: "1.05rem", color: "#333", lineHeight: 1.9 }}>
            {post.content.split("\n").map((para, i) =>
              para.trim()
                ? <p key={i} style={{ marginBottom: "1.25rem" }}>{para}</p>
                : <br key={i} />
            )}
          </div>

          {/* Back */}
          <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "3px solid #1A1A1A" }}>
            <Link to="/dev-blogs" style={{ textDecoration: "none" }}>
              <motion.div whileHover={{ x: -4 }}
                style={{ fontFamily: "Bangers, cursive", fontSize: "1.1rem", letterSpacing: "0.1em", color: "#fff", backgroundColor: "#1A1A1A", padding: "8px 20px", display: "inline-block" }}>
                &larr; BACK TO THE GAZETTE
              </motion.div>
            </Link>
          </div>
        </div>
      </HalftoneSection>
    </PageTransition>
  )
}
