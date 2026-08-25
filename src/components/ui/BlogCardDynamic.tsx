import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { deleteDoc, doc } from "firebase/firestore"
import { db } from "../../firebase"
import { useAuth } from "../../context/AuthContext"
import { BlogDoc } from "../../types/blog"
import { showComicConfirm, showComicToast, showComicAlert } from "../../utils/comicAlert"
import { bytesToBlobUrl } from "../../utils/imageBlob"

const CAT_COLORS: Record<string, string> = {
  Leak: "#ED1D24", Rumor: "#FF6B00", Expo: "#0476F2", Review: "#22C55E",
}

interface Props {
  post: BlogDoc
  index?: number
  onEdit?: (post: BlogDoc) => void
}

export default function BlogCardDynamic({ post, index = 0, onEdit }: Props) {
  const { isAdmin } = useAuth()
  const accent = CAT_COLORS[post.category] ?? "#1A1A1A"
  const dateStr = post.createdAt
    ? new Date(post.createdAt.seconds * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "Recent"

  const coverUrl = bytesToBlobUrl(post.coverImage)

  async function handleDelete() {
    const confirmed = await showComicConfirm({
      title: "DELETE THIS DISPATCH?",
      text: `Are you sure you want to permanently erase "${post.title}" from the Gazette records?`,
      confirmButtonText: "YES, INCINERATE! >",
      cancelButtonText: "KEEP DISPATCH",
      icon: "warning",
    })
    if (!confirmed) return

    try {
      await deleteDoc(doc(db, "blogs", post.id))
      showComicToast({ title: "DISPATCH PERMANENTLY ERASED!", icon: "success" })
    } catch (err: unknown) {
      showComicAlert({ title: "ERASURE FAILED!", text: (err as Error).message, icon: "error" })
    }
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
          {onEdit && (
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => onEdit(post)}
              style={{ fontFamily: "Bangers, cursive", fontSize: "0.75rem", letterSpacing: "0.06em", padding: "3px 10px", backgroundColor: "#FFD700", color: "#1A1A1A", border: "2px solid #1A1A1A", cursor: "pointer" }}>
              EDIT
            </motion.button>
          )}
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleDelete}
            style={{ fontFamily: "Bangers, cursive", fontSize: "0.75rem", letterSpacing: "0.06em", padding: "3px 10px", backgroundColor: "#ED1D24", color: "#fff", border: "2px solid #1A1A1A", cursor: "pointer" }}>
            DEL
          </motion.button>
        </div>
      )}

      {/* Cover Image Thumbnail */}
      {coverUrl ? (
        <div style={{ width: "100%", height: "150px", overflow: "hidden", borderBottom: "3px solid #1A1A1A", backgroundColor: "#1A1A1A" }}>
          <img src={coverUrl} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      ) : (
        <div style={{ height: 6, backgroundColor: accent }} />
      )}

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

        <h3 style={{ fontFamily: "Bangers, cursive", fontSize: "1.4rem", letterSpacing: "0.06em", color: "#1A1A1A", lineHeight: 1.25, marginBottom: "0.4rem" }}>
          {post.title}
        </h3>

        {/* Author Byline */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              border: "2px solid #1A1A1A",
              overflow: "hidden",
              backgroundColor: "#FFD700",
              flexShrink: 0,
            }}
          >
            <img
              src={post.authorPhotoURL || "/avatars/avatar-12.svg"}
              alt={post.authorName || "Author"}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/avatars/avatar-12.svg"
              }}
            />
          </div>
          <span style={{ fontFamily: "Comic Neue, cursive", fontSize: "0.8rem", fontWeight: 700, color: "#666" }}>
            REPORTED BY: <span style={{ fontFamily: "Bangers, cursive", fontSize: "0.95rem", letterSpacing: "0.06em", color: "#ED1D24" }}>{post.authorName?.toUpperCase() || "ADMIN"}</span>
          </span>
        </div>

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
