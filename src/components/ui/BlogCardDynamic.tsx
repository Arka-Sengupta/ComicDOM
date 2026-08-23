import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { deleteDoc, doc } from "firebase/firestore"
import { db } from "../../firebase"
import { useAuth } from "../../context/AuthContext"
import { BlogDoc } from "../../types/blog"

const CAT_COLORS: Record<string, string> = {
  Leak: "#ED1D24", Rumor: "#FF6B00", Expo: "#0476F2", Review: "#22C55E",
}

interface Props {
  post: BlogDoc
  index?: number
  onEdit: (post: BlogDoc) => void
}

export default function BlogCardDynamic({ post, index = 0, onEdit }: Props) {
  const { isAdmin } = useAuth()
  const accent = CAT_COLORS[post.category] ?? "#1A1A1A"
  const dateStr = post.createdAt
    ? new Date(post.createdAt.seconds * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "Recent"

  async function handleDelete() {
    if (!window.confirm("Delete this post forever?")) return
    await deleteDoc(doc(db, "blogs", post.id))
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -6 }}
      style={{ position: "relative", backgroundColor: "#FFF8E7", border: "3px solid #1A1A1A", boxShadow: "6px 6px 0 #1A1A1A", display: "flex", flexDirection: "column", overflow: "hidden" }}
    >
      {/* Breaking ribbon */}
      {post.featured && (
        <div style={{ position: "absolute", top: 18, right: -36, transform: "rotate(45deg)", backgroundColor: "#ED1D24", color: "#fff", fontFamily: "Bangers, cursive", fontSize: "0.75rem", letterSpacing: "0.06em", padding: "3px 44px", border: "2px solid #1A1A1A", zIndex: 10 }}>
          BREAKING!
        </div>
      )}

      {/* Admin controls */}
      {isAdmin && (
        <div style={{ position: "absolute", top: 8, left: 8, display: "flex", gap: "0.4rem", zIndex: 20 }}>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => onEdit(post)}
            style={{ fontFamily: "Bangers, cursive", fontSize: "0.75rem", letterSpacing: "0.06em", padding: "3px 10px", backgroundColor: "#FFD700", color: "#1A1A1A", border: "2px solid #1A1A1A", cursor: "pointer" }}>
            EDIT
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleDelete}
            style={{ fontFamily: "Bangers, cursive", fontSize: "0.75rem", letterSpacing: "0.06em", padding: "3px 10px", backgroundColor: "#ED1D24", color: "#fff", border: "2px solid #1A1A1A", cursor: "pointer" }}>
            DEL
          </motion.button>
        </div>
      )}

      <div style={{ height: 6, backgroundColor: accent }} />

      <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <span style={{ fontFamily: "Bangers, cursive", fontSize: "0.8rem", letterSpacing: "0.08em", color: "#fff", backgroundColor: accent, border: "2px solid #1A1A1A", padding: "2px 10px" }}>
            {post.category.toUpperCase()}
          </span>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ fontFamily: "Comic Neue, cursive", fontSize: "0.75rem", color: "#888" }}>{post.readTime}</span>
            <span style={{ fontFamily: "Bangers, cursive", fontSize: "0.75rem", letterSpacing: "0.06em", color: "#1A1A1A", backgroundColor: "#FFD700", border: "2px solid #1A1A1A", padding: "1px 8px" }}>
              {dateStr}
            </span>
          </div>
        </div>

        <h3 style={{ fontFamily: "Bangers, cursive", fontSize: "1.4rem", letterSpacing: "0.06em", color: "#1A1A1A", lineHeight: 1.25, marginBottom: "0.6rem" }}>
          {post.title}
        </h3>

        <p style={{ fontFamily: "Comic Neue, cursive", fontSize: "0.875rem", color: "#555", lineHeight: 1.65, flex: 1, marginBottom: "1rem" }}>
          {post.excerpt}
        </p>

        <Link to={"/dev-blogs/" + post.id} style={{ textDecoration: "none", alignSelf: "flex-start" }}>
          <motion.div whileHover={{ backgroundColor: accent, color: "#fff" }}
            style={{ fontFamily: "Bangers, cursive", fontSize: "0.9rem", letterSpacing: "0.08em", color: "#fff", backgroundColor: "#1A1A1A", padding: "6px 16px", transition: "background-color 0.2s, color 0.2s" }}>
            READ FULL POST &rarr;
          </motion.div>
        </Link>
      </div>
    </motion.article>
  )
}
