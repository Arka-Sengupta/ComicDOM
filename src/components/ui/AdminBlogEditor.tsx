import { useState } from "react"
import { motion } from "framer-motion"
import { collection, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore"
import { db } from "../../firebase"
import { useAuth } from "../../context/AuthContext"
import { BlogDoc } from "../../types/blog"

interface Props {
  existing?: BlogDoc
  onClose: () => void
}

const CATS = ["Leak", "Rumor", "Expo", "Review"] as const
type Cat = typeof CATS[number]

const fieldStyle: React.CSSProperties = {
  fontFamily: "Comic Neue, cursive",
  fontSize: "0.95rem",
  padding: "8px 12px",
  border: "2px solid #1A1A1A",
  backgroundColor: "#fff",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  display: "block",
  marginTop: "0.2rem",
}

const labelStyle: React.CSSProperties = {
  fontFamily: "Bangers, cursive",
  fontSize: "0.95rem",
  letterSpacing: "0.08em",
  color: "#1A1A1A",
  display: "block",
}

export default function AdminBlogEditor({ existing, onClose }: Props) {
  const { user } = useAuth()
  const [title, setTitle] = useState(existing?.title ?? "")
  const [excerpt, setExcerpt] = useState(existing?.excerpt ?? "")
  const [content, setContent] = useState(existing?.content ?? "")
  const [category, setCategory] = useState<Cat>((existing?.category as Cat) ?? "Leak")
  const [readTime, setReadTime] = useState(existing?.readTime ?? "3 min read")
  const [featured, setFeatured] = useState(existing?.featured ?? false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  async function handleSave() {
    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      setError("Title, excerpt, and content are all required."); return
    }
    setSaving(true); setError("")
    try {
      const payload = {
        title: title.trim(), excerpt: excerpt.trim(), content: content.trim(),
        category, readTime, featured, authorUid: user!.uid, updatedAt: serverTimestamp(),
      }
      if (existing?.id) {
        await updateDoc(doc(db, "blogs", existing.id), payload)
      } else {
        await addDoc(collection(db, "blogs"), { ...payload, createdAt: serverTimestamp() })
      }
      onClose()
    } catch (e: unknown) { setError((e as Error).message) }
    finally { setSaving(false) }
  }

  return (
    <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", backgroundColor: "#FFF8E7" }}>
      <div>
        <label style={labelStyle}>HEADLINE *</label>
        <input value={title} onChange={e => setTitle(e.target.value)} style={fieldStyle} placeholder="Post title..." />
      </div>
      <div>
        <label style={labelStyle}>LEAD PARAGRAPH *</label>
        <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={3} style={{ ...fieldStyle, resize: "vertical" }} placeholder="Short teaser shown on the card..." />
      </div>
      <div>
        <label style={labelStyle}>FULL STORY *</label>
        <textarea value={content} onChange={e => setContent(e.target.value)} rows={10} style={{ ...fieldStyle, resize: "vertical" }} placeholder="Full post body. Use blank lines to separate paragraphs." />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div>
          <label style={labelStyle}>CATEGORY</label>
          <select value={category} onChange={e => setCategory(e.target.value as Cat)} style={fieldStyle}>
            {CATS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>READ TIME</label>
          <input value={readTime} onChange={e => setReadTime(e.target.value)} style={fieldStyle} placeholder="5 min read" />
        </div>
      </div>
      <label style={{ fontFamily: "Comic Neue, cursive", fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
        <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} />
        Mark as BREAKING! (featured ribbon)
      </label>

      {error && (
        <p style={{ fontFamily: "Comic Neue, cursive", fontSize: "0.85rem", color: "#ED1D24", border: "2px solid #ED1D24", padding: "6px 10px", margin: 0 }}>
          {error}
        </p>
      )}

      <div style={{ display: "flex", gap: "0.75rem" }}>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleSave} disabled={saving}
          style={{ flex: 1, fontFamily: "Bangers, cursive", fontSize: "1.1rem", letterSpacing: "0.1em", padding: "10px", backgroundColor: "#ED1D24", color: "#fff", border: "3px solid #1A1A1A", boxShadow: "4px 4px 0 #1A1A1A", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
          {saving ? "SAVING..." : existing?.id ? "UPDATE DISPATCH" : "PUBLISH DISPATCH"}
        </motion.button>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onClose}
          style={{ fontFamily: "Bangers, cursive", fontSize: "1.1rem", letterSpacing: "0.1em", padding: "10px 20px", backgroundColor: "#fff", color: "#1A1A1A", border: "3px solid #1A1A1A", boxShadow: "4px 4px 0 #1A1A1A", cursor: "pointer" }}>
          CANCEL
        </motion.button>
      </div>
    </div>
  )
}
