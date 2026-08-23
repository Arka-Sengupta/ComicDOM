import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { collection, onSnapshot, orderBy, query } from "firebase/firestore"
import { db } from "../firebase"
import { useAuth } from "../context/AuthContext"
import { BlogDoc } from "../types/blog"
import PageTransition from "../components/ui/PageTransition"
import HalftoneSection from "../components/ui/HalftoneSection"
import ActionWord from "../components/ui/ActionWord"
import BlogCardDynamic from "../components/ui/BlogCardDynamic"
import AdminBlogEditor from "../components/ui/AdminBlogEditor"

export default function DevBlogs() {
  const { isAdmin } = useAuth()
  const [posts, setPosts] = useState<BlogDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogDoc | undefined>(undefined)

  useEffect(() => {
    const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"))
    const unsub = onSnapshot(q,
      snap => { setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() } as BlogDoc))); setLoading(false) },
      () => setLoading(false)
    )
    return unsub
  }, [])

  function openNew() { setEditingPost(undefined); setEditorOpen(true) }
  function openEdit(p: BlogDoc) { setEditingPost(p); setEditorOpen(true) }
  function closeEditor() { setEditorOpen(false); setEditingPost(undefined) }

  return (
    <PageTransition>
      {/* ── NEWSPAPER HEADER ── */}
      <HalftoneSection color="cream" style={{ padding: "3rem 1rem 2.5rem", borderBottom: "4px solid #1A1A1A" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>

          <div style={{ borderTop: "4px solid #1A1A1A", borderBottom: "2px solid #1A1A1A", padding: "0.4rem 0", marginBottom: "1rem" }}>
            <p style={{ fontFamily: "Comic Neue, cursive", fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#666", margin: 0 }}>
              Volume I &bull; Est. 2026 &bull; The Official ComicDOM Newsletter
            </p>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.1 }}>
            <h1 style={{ fontFamily: "Bangers, cursive", fontSize: "clamp(3.5rem, 10vw, 7rem)", letterSpacing: "0.06em", color: "#1A1A1A", textShadow: "4px 4px 0 #FFD700", margin: 0, lineHeight: 0.95 }}>
              THE COMICDOM
            </h1>
            <h1 style={{ fontFamily: "Bangers, cursive", fontSize: "clamp(3.5rem, 10vw, 7rem)", letterSpacing: "0.06em", color: "#ED1D24", WebkitTextStroke: "2px #1A1A1A", textShadow: "4px 4px 0 #1A1A1A", margin: 0, lineHeight: 0.95 }}>
              GAZETTE
            </h1>
          </motion.div>

          <div style={{ borderTop: "2px solid #1A1A1A", borderBottom: "4px solid #1A1A1A", padding: "0.4rem 0", marginTop: "1rem" }}>
            <p style={{ fontFamily: "Comic Neue, cursive", fontSize: "0.9rem", fontStyle: "italic", color: "#555", margin: 0 }}>
              "All the Leaks, Rumors, and Expo News - Straight from the Source"
            </p>
          </div>

          {/* Admin: write new post */}
          {isAdmin && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ marginTop: "1.5rem" }}>
              <motion.button whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} onClick={openNew}
                style={{ fontFamily: "Bangers, cursive", fontSize: "1.15rem", letterSpacing: "0.1em", padding: "8px 28px", backgroundColor: "#ED1D24", color: "#fff", border: "3px solid #1A1A1A", boxShadow: "4px 4px 0 #1A1A1A", cursor: "pointer" }}>
                + WRITE NEW DISPATCH
              </motion.button>
            </motion.div>
          )}
        </div>
      </HalftoneSection>

      {/* ── ADMIN EDITOR PANEL ── */}
      <AnimatePresence>
        {editorOpen && (
          <motion.div key="editor" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
            style={{ overflow: "hidden", borderBottom: "4px solid #1A1A1A" }}>
            <div style={{ maxWidth: 860, margin: "0 auto" }}>
              <div style={{ padding: "0.75rem 1.5rem", backgroundColor: "#FFD700", borderBottom: "3px solid #1A1A1A", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "Bangers, cursive", fontSize: "1.3rem", letterSpacing: "0.1em" }}>
                  {editingPost ? "EDIT DISPATCH" : "NEW DISPATCH"}
                </span>
              </div>
              <AdminBlogEditor existing={editingPost} onClose={closeEditor} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── POSTS GRID ── */}
      <HalftoneSection color="cream" style={{ padding: "4rem 1rem 5rem" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2.5rem" }}>
            <div style={{ flex: 1, height: 3, backgroundColor: "#1A1A1A" }} />
            <ActionWord word="HOT TAKES!" color="#ED1D24" size="md" rotate={-4} />
            <div style={{ flex: 1, height: 3, backgroundColor: "#1A1A1A" }} />
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "4rem 0" }}>
              <motion.p animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}
                style={{ fontFamily: "Bangers, cursive", fontSize: "2.5rem", letterSpacing: "0.1em", color: "#ED1D24" }}>
                LOADING DISPATCHES...
              </motion.p>
            </div>
          ) : posts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem 1rem", border: "3px dashed #1A1A1A", backgroundColor: "#FFD70018" }}>
              <p style={{ fontFamily: "Bangers, cursive", fontSize: "2rem", letterSpacing: "0.1em", color: "#1A1A1A", opacity: 0.5, margin: 0 }}>
                {isAdmin ? "NO DISPATCHES YET — WRITE THE FIRST ONE!" : "NO DISPATCHES YET... CHECK BACK SOON!"}
              </p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem" }}>
              {posts.map((post, i) => (
                <BlogCardDynamic key={post.id} post={post} index={i} onEdit={openEdit} />
              ))}
            </div>
          )}
        </div>
      </HalftoneSection>
    </PageTransition>
  )
}
