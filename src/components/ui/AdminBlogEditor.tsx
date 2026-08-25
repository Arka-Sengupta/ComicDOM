import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { collection, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore"
import { db } from "../../firebase"
import { useAuth } from "../../context/AuthContext"
import { BlogDoc, BlogImageAttachment } from "../../types/blog"
import { showComicToast, showComicAlert } from "../../utils/comicAlert"
import { fileToFirestoreBytes, bytesToBlobUrl } from "../../utils/imageBlob"
import ComicRichContent from "./ComicRichContent"

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
  const { user, userProfile } = useAuth()
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write")

  const [title, setTitle] = useState(existing?.title ?? "")
  const [excerpt, setExcerpt] = useState(existing?.excerpt ?? "")
  const [content, setContent] = useState(existing?.content ?? "")
  const [category, setCategory] = useState<Cat>((existing?.category as Cat) ?? "Leak")
  const [readTime, setReadTime] = useState(existing?.readTime ?? "3 min read")
  const [featured, setFeatured] = useState(existing?.featured ?? false)

  // Binary Image Attachments
  const [coverImage, setCoverImage] = useState<BlogImageAttachment | null>(existing?.coverImage ?? null)
  const [images, setImages] = useState<BlogImageAttachment[]>(existing?.images ?? [])
  const [uploadingImage, setUploadingImage] = useState(false)

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)
  const inlineImageInputRef = useRef<HTMLInputElement>(null)

  // Insert markdown tag helper
  function insertFormatting(prefix: string, suffix: string = "", placeholder: string = "") {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = content.substring(start, end) || placeholder
    const replacement = `${prefix}${selected}${suffix}`

    const newContent = content.substring(0, start) + replacement + content.substring(end)
    setContent(newContent)

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length)
    }, 10)
  }

  // Handle Cover Image upload to Firestore binary Bytes
  async function handleCoverImageSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const { bytes, mimeType, name } = await fileToFirestoreBytes(file, 1200, 0.8)
      const attachment: BlogImageAttachment = {
        id: `cover_${Date.now()}`,
        name,
        mimeType,
        data: bytes,
      }
      setCoverImage(attachment)
      showComicToast({ title: "COVER IMAGE ATTACHED!", icon: "success" })
    } catch (err: unknown) {
      showComicAlert({ title: "IMAGE ERROR", text: (err as Error).message || "Failed to process image.", icon: "error" })
    } finally {
      setUploadingImage(false)
      if (coverInputRef.current) coverInputRef.current.value = ""
    }
  }

  // Handle Inline Image upload to Firestore binary Bytes
  async function handleInlineImageSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const { bytes, mimeType, name } = await fileToFirestoreBytes(file, 1000, 0.75)
      const imgId = `img_${Date.now()}`
      const attachment: BlogImageAttachment = {
        id: imgId,
        name,
        mimeType,
        data: bytes,
      }

      setImages((prev) => [...prev, attachment])

      // Insert markdown tag into content
      const imageTag = `\n![${file.name.replace(/\.[^/.]+$/, "")}](${imgId})\n`
      setContent((prev) => prev + imageTag)

      showComicToast({ title: "IMAGE ATTACHED TO DISPATCH!", icon: "success" })
    } catch (err: unknown) {
      showComicAlert({ title: "ATTACHMENT ERROR", text: (err as Error).message || "Failed to attach image.", icon: "error" })
    } finally {
      setUploadingImage(false)
      if (inlineImageInputRef.current) inlineImageInputRef.current.value = ""
    }
  }

  async function handleSave() {
    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      setError("Title, excerpt, and content are all required.")
      showComicAlert({ title: "INCOMPLETE DISPATCH!", text: "Headline, lead paragraph, and full story are all required.", icon: "warning" })
      return
    }

    setSaving(true)
    setError("")

    try {
      const authorName = userProfile?.displayName || user?.displayName || user?.email?.split("@")[0] || "Chief Editor"
      const authorPhotoURL = userProfile?.photoURL || user?.photoURL || "/avatars/avatar-12.svg"

      const payload: Record<string, any> = {
        title: title.trim(),
        excerpt: excerpt.trim(),
        content: content.trim(),
        category,
        readTime,
        featured,
        authorUid: user!.uid,
        authorName,
        authorPhotoURL,
        updatedAt: serverTimestamp(),
      }

      if (coverImage) {
        payload.coverImage = coverImage
      }

      if (images && images.length > 0) {
        payload.images = images
      }

      if (existing?.id) {
        await updateDoc(doc(db, "blogs", existing.id), payload)
        showComicToast({ title: "DISPATCH UPDATED! POW!", icon: "success" })
      } else {
        await addDoc(collection(db, "blogs"), { ...payload, createdAt: serverTimestamp() })
        showComicToast({ title: "NEW DISPATCH PUBLISHED! KAPOW!", icon: "success" })
      }
      onClose()
    } catch (e: unknown) {
      const msg = (e as Error).message
      setError(msg)
      showComicAlert({ title: "TRANSMISSION ERROR!", text: msg, icon: "error" })
    } finally {
      setSaving(false)
    }
  }

  const coverBlobUrl = bytesToBlobUrl(coverImage)

  return (
    <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.2rem", backgroundColor: "#FFF8E7" }}>

      {/* TABS: WRITE VS PREVIEW */}
      <div style={{ display: "flex", border: "3px solid #1A1A1A" }}>
        <button
          type="button"
          onClick={() => setActiveTab("write")}
          style={{
            flex: 1,
            fontFamily: "Bangers, cursive",
            fontSize: "1.1rem",
            letterSpacing: "0.08em",
            padding: "8px",
            backgroundColor: activeTab === "write" ? "#1A1A1A" : "#fff",
            color: activeTab === "write" ? "#FFD700" : "#1A1A1A",
            border: "none",
            borderRight: "2px solid #1A1A1A",
            cursor: "pointer",
          }}
        >
          WRITE &amp; EDIT DISPATCH
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("preview")}
          style={{
            flex: 1,
            fontFamily: "Bangers, cursive",
            fontSize: "1.1rem",
            letterSpacing: "0.08em",
            padding: "8px",
            backgroundColor: activeTab === "preview" ? "#1A1A1A" : "#fff",
            color: activeTab === "preview" ? "#FFD700" : "#1A1A1A",
            border: "none",
            cursor: "pointer",
          }}
        >
          LIVE COMIC PREVIEW
        </button>
      </div>

      {activeTab === "write" ? (
        <>
          {/* Headline */}
          <div>
            <label style={labelStyle}>HEADLINE / TITLE *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} style={fieldStyle} placeholder="e.g. SECRET MCU LEAK REVEALS MULTIVERSE CLASH!" />
          </div>

          {/* Lead Paragraph */}
          <div>
            <label style={labelStyle}>LEAD PARAGRAPH (CARD SUMMARY) *</label>
            <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} style={{ ...fieldStyle, resize: "vertical" }} placeholder="Short teaser shown on the Gazette front page..." />
          </div>

          {/* Cover Image Upload */}
          <div style={{ backgroundColor: "#FFD70014", border: "2px dashed #1A1A1A", padding: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <label style={labelStyle}>COVER PHOTO</label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverImageSelected} style={{ display: "none" }} />
                <button
                  type="button"
                  disabled={uploadingImage}
                  onClick={() => coverInputRef.current?.click()}
                  style={{
                    fontFamily: "Bangers, cursive",
                    fontSize: "0.85rem",
                    letterSpacing: "0.06em",
                    padding: "4px 12px",
                    backgroundColor: "#0476F2",
                    color: "#fff",
                    border: "2px solid #1A1A1A",
                    cursor: "pointer",
                  }}
                >
                  {uploadingImage ? "PROCESSING..." : coverImage ? "CHANGE COVER IMAGE" : "+ UPLOAD COVER PHOTO"}
                </button>
                {coverImage && (
                  <button
                    type="button"
                    onClick={() => setCoverImage(null)}
                    style={{
                      fontFamily: "Bangers, cursive",
                      fontSize: "0.85rem",
                      letterSpacing: "0.06em",
                      padding: "4px 10px",
                      backgroundColor: "#ED1D24",
                      color: "#fff",
                      border: "2px solid #1A1A1A",
                      cursor: "pointer",
                    }}
                  >
                    REMOVE
                  </button>
                )}
              </div>
            </div>

            {coverBlobUrl && (
              <div style={{ marginTop: "0.5rem", position: "relative", width: "100%", maxHeight: "180px", overflow: "hidden", border: "2px solid #1A1A1A", backgroundColor: "#1A1A1A" }}>
                <img src={coverBlobUrl} alt="Cover Preview" style={{ width: "100%", height: "180px", objectFit: "cover" }} />
                <span style={{ position: "absolute", bottom: 6, right: 6, fontFamily: "Bangers, cursive", fontSize: "0.75rem", backgroundColor: "#FFD700", color: "#1A1A1A", padding: "2px 8px", border: "1px solid #1A1A1A" }}>
                  BINARY BLOB READY
                </span>
              </div>
            )}
          </div>

          {/* Full Story with Comic Formatting Toolbar */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.3rem" }}>
              <label style={labelStyle}>FULL STORY (RICH COMIC FORMATTING) *</label>

              {/* Formatting Buttons */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                <button type="button" onClick={() => insertFormatting("**", "**", "bold text")} title="Bold" style={toolbarBtnStyle}>
                  <strong>B</strong>
                </button>
                <button type="button" onClick={() => insertFormatting("*", "*", "italic text")} title="Italic" style={toolbarBtnStyle}>
                  <em>I</em>
                </button>
                <button type="button" onClick={() => insertFormatting("## ", "", "Major Heading")} title="H2 Heading" style={toolbarBtnStyle}>
                  H2
                </button>
                <button type="button" onClick={() => insertFormatting("### ", "", "Subheading")} title="H3 Heading" style={toolbarBtnStyle}>
                  H3
                </button>
                <button type="button" onClick={() => insertFormatting("> ", "", "Notable quote / speech callout")} title="Quote Callout" style={toolbarBtnStyle}>
                  &ldquo; &rdquo;
                </button>
                <button type="button" onClick={() => insertFormatting("- ", "", "Intel bullet item")} title="Bullet List" style={toolbarBtnStyle}>
                  &bull; List
                </button>
                <button type="button" onClick={() => insertFormatting("[POW!] ", "")} title="Action Badge" style={{ ...toolbarBtnStyle, backgroundColor: "#ED1D24", color: "#fff" }}>
                  [POW!]
                </button>
                <button type="button" onClick={() => insertFormatting("[BREAKING!] ", "")} title="Breaking Badge" style={{ ...toolbarBtnStyle, backgroundColor: "#FFD700", color: "#1A1A1A" }}>
                  [BREAKING!]
                </button>

                {/* Inline Image Attachment Button */}
                <input ref={inlineImageInputRef} type="file" accept="image/*" onChange={handleInlineImageSelected} style={{ display: "none" }} />
                <button
                  type="button"
                  onClick={() => inlineImageInputRef.current?.click()}
                  title="Attach Inline Image"
                  style={{ ...toolbarBtnStyle, backgroundColor: "#0476F2", color: "#fff" }}
                >
                  ATTACH PHOTO
                </button>
              </div>
            </div>

            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              style={{ ...fieldStyle, resize: "vertical", fontFamily: "monospace", fontSize: "0.95rem" }}
              placeholder="Write your dispatch story here... Use the toolbar above for **bold**, *italics*, quotes, headings, and image attachments."
            />
          </div>

          {/* Metadata Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={labelStyle}>CATEGORY</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as Cat)} style={fieldStyle}>
                {CATS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>READ TIME</label>
              <input value={readTime} onChange={(e) => setReadTime(e.target.value)} style={fieldStyle} placeholder="5 min read" />
            </div>
          </div>

          {/* Breaking Checkbox */}
          <label style={{ fontFamily: "Comic Neue, cursive", fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
            Mark as BREAKING! (featured ribbon)
          </label>
        </>
      ) : (
        /* LIVE COMIC PREVIEW */
        <div style={{ backgroundColor: "#fff", border: "3px solid #1A1A1A", padding: "1.5rem" }}>
          {coverBlobUrl && (
            <div style={{ width: "100%", maxHeight: "300px", overflow: "hidden", border: "3px solid #1A1A1A", marginBottom: "1.5rem" }}>
              <img src={coverBlobUrl} alt="Cover" style={{ width: "100%", height: "300px", objectFit: "cover" }} />
            </div>
          )}

          <span style={{ fontFamily: "Bangers, cursive", fontSize: "0.85rem", letterSpacing: "0.08em", backgroundColor: "#ED1D24", color: "#fff", padding: "2px 10px", border: "2px solid #1A1A1A" }}>
            {category.toUpperCase()}
          </span>

          <h1 style={{ fontFamily: "Bangers, cursive", fontSize: "2.4rem", letterSpacing: "0.06em", color: "#1A1A1A", margin: "0.5rem 0" }}>
            {title || "Untitled Dispatch Headline"}
          </h1>

          <p style={{ fontFamily: "Comic Neue, cursive", fontSize: "1.1rem", fontWeight: 700, fontStyle: "italic", borderLeft: "5px solid #ED1D24", paddingLeft: "1rem", backgroundColor: "#FFF8E7", padding: "0.8rem", border: "2px solid #1A1A1A", borderLeftWidth: "5px" }}>
            {excerpt || "Lead paragraph teaser..."}
          </p>

          <div style={{ height: 2, backgroundColor: "#1A1A1A", margin: "1.5rem 0" }} />

          <ComicRichContent content={content || "No story content written yet."} images={images} />
        </div>
      )}

      {error && (
        <p style={{ fontFamily: "Comic Neue, cursive", fontSize: "0.85rem", color: "#ED1D24", border: "2px solid #ED1D24", padding: "6px 10px", margin: 0 }}>
          {error}
        </p>
      )}

      {/* Action buttons */}
      <div style={{ display: "flex", gap: "0.75rem" }}>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          disabled={saving}
          style={{
            flex: 1,
            fontFamily: "Bangers, cursive",
            fontSize: "1.15rem",
            letterSpacing: "0.1em",
            padding: "10px",
            backgroundColor: "#ED1D24",
            color: "#fff",
            border: "3px solid #1A1A1A",
            boxShadow: "4px 4px 0 #1A1A1A",
            cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? "SAVING ENCRYPTED BINARY..." : existing?.id ? "UPDATE DISPATCH" : "PUBLISH DISPATCH &rarr;"}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onClose}
          style={{
            fontFamily: "Bangers, cursive",
            fontSize: "1.15rem",
            letterSpacing: "0.1em",
            padding: "10px 20px",
            backgroundColor: "#fff",
            color: "#1A1A1A",
            border: "3px solid #1A1A1A",
            boxShadow: "4px 4px 0 #1A1A1A",
            cursor: "pointer",
          }}
        >
          CANCEL
        </motion.button>
      </div>
    </div>
  )
}

const toolbarBtnStyle: React.CSSProperties = {
  fontFamily: "Bangers, cursive",
  fontSize: "0.85rem",
  letterSpacing: "0.06em",
  padding: "3px 8px",
  backgroundColor: "#fff",
  color: "#1A1A1A",
  border: "2px solid #1A1A1A",
  boxShadow: "2px 2px 0 #1A1A1A",
  cursor: "pointer",
}
