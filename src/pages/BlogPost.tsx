import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  doc,
  getDoc,
  collection,
  addDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "../firebase"
import { useAuth } from "../context/AuthContext"
import { BlogDoc, CommentDoc } from "../types/blog"
import PageTransition from "../components/ui/PageTransition"
import HalftoneSection from "../components/ui/HalftoneSection"
import ActionWord from "../components/ui/ActionWord"
import SpeechBubble from "../components/ui/SpeechBubble"
import AuthModal from "../components/ui/AuthModal"
import ComicRichContent from "../components/ui/ComicRichContent"
import { showComicConfirm, showComicAlert, showComicToast } from "../utils/comicAlert"
import { bytesToBlobUrl } from "../utils/imageBlob"

const CAT_COLORS: Record<string, string> = {
  Leak: "#ED1D24",
  Rumor: "#FF6B00",
  Expo: "#0476F2",
  Review: "#22C55E",
}

export default function BlogPost() {
  const { id } = useParams<{ id: string }>()
  const { user, userProfile, isAdmin } = useAuth()

  const [post, setPost] = useState<BlogDoc | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  // Author details (real-time/fetched from users collection)
  const [authorName, setAuthorName] = useState("")
  const [authorPhoto, setAuthorPhoto] = useState("/avatars/avatar-12.svg")

  // Comments state
  const [comments, setComments] = useState<CommentDoc[]>([])
  const [commentText, setCommentText] = useState("")
  const [submittingComment, setSubmittingComment] = useState(false)
  const [commentError, setCommentError] = useState("")
  const [authModalOpen, setAuthModalOpen] = useState(false)

  useEffect(() => {
    if (!id) return
    getDoc(doc(db, "blogs", id))
      .then((snap) => {
        if (snap.exists()) {
          const postData = { id: snap.id, ...snap.data() } as BlogDoc
          setPost(postData)

          // Try to fetch latest author profile from users collection
          if (postData.authorUid) {
            getDoc(doc(db, "users", postData.authorUid))
              .then((userSnap) => {
                if (userSnap.exists()) {
                  const userData = userSnap.data()
                  setAuthorName(userData.displayName || postData.authorName || "Chief Editor")
                  setAuthorPhoto(userData.photoURL || postData.authorPhotoURL || "/avatars/avatar-12.svg")
                } else {
                  setAuthorName(postData.authorName || "Chief Editor")
                  setAuthorPhoto(postData.authorPhotoURL || "/avatars/avatar-12.svg")
                }
              })
              .catch(() => {
                setAuthorName(postData.authorName || "Chief Editor")
                setAuthorPhoto(postData.authorPhotoURL || "/avatars/avatar-12.svg")
              })
          }
        } else {
          setNotFound(true)
        }
        setLoading(false)
      })
      .catch(() => {
        setNotFound(true)
        setLoading(false)
      })

    // Listen to live comments subcollection
    const q = query(
      collection(db, "blogs", id, "comments"),
      orderBy("createdAt", "asc")
    )
    const unsubComments = onSnapshot(
      q,
      (snap) => {
        setComments(
          snap.docs.map((d) => ({
            id: d.id,
            blogId: id,
            ...d.data(),
          })) as CommentDoc[]
        )
      },
      () => {
        // Handle read error gracefully
      }
    )

    return () => unsubComments()
  }, [id])

  async function handleAddComment(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !id || !commentText.trim()) return

    setSubmittingComment(true)
    setCommentError("")

    try {
      const commenterName =
        userProfile?.displayName ||
        user.displayName ||
        user.email?.split("@")[0] ||
        "Comic Operative"
      const commenterPhoto =
        userProfile?.photoURL || user.photoURL || "/avatars/avatar-12.svg"

      await addDoc(collection(db, "blogs", id, "comments"), {
        blogId: id,
        content: commentText.trim(),
        authorUid: user.uid,
        authorName: commenterName,
        authorPhotoURL: commenterPhoto,
        authorIsAdmin: isAdmin,
        createdAt: serverTimestamp(),
      })

      setCommentText("")
    } catch (err: unknown) {
      setCommentError((err as Error).message || "Failed to transmit comment.")
    } finally {
      setSubmittingComment(false)
    }
  }

  async function handleDeleteComment(comment: CommentDoc) {
    if (!id || !user) return

    const isAuthor = user.uid === comment.authorUid
    const canDelete = isAdmin || isAuthor
    if (!canDelete) {
      showComicAlert({
        title: "SECURITY VIOLATION!",
        text: "You only have clearance to delete your own transmission!",
        icon: "error",
      })
      return
    }

    const confirmed = await showComicConfirm({
      title: isAdmin && !isAuthor ? "ADMIN PURGE TRANSMISSION?" : "DELETE YOUR TRANSMISSION?",
      text: isAdmin && !isAuthor
        ? `Supreme Commander Override: Erase transmission by operative "${comment.authorName}"?`
        : "Are you sure you want to permanently delete your transmission?",
      confirmButtonText: "YES, PURGE IT! >",
      cancelButtonText: "CANCEL",
      icon: "warning",
    })
    if (!confirmed) return

    try {
      await deleteDoc(doc(db, "blogs", id, "comments", comment.id))
      showComicToast({ title: "TRANSMISSION PURGED!", icon: "success" })
    } catch (err: unknown) {
      showComicAlert({
        title: "PURGE FAILED!",
        text: (err as Error).message || "Failed to delete transmission.",
        icon: "error",
      })
    }
  }

  if (loading) {
    return (
      <PageTransition>
        <HalftoneSection color="cream" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <motion.p animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}
            style={{ fontFamily: "Bangers, cursive", fontSize: "2.5rem", letterSpacing: "0.1em", color: "#ED1D24" }}>
            DECRYPTING DISPATCH...
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
            DISPATCH NOT FOUND!
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
    : "Recent"

  return (
    <PageTransition>
      {/* ── HERO BANNER ── */}
      <section style={{
        backgroundColor: accent,
        backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.22) 1.5px, transparent 1.5px)",
        backgroundSize: "14px 14px",
        padding: "4rem 1rem 3rem",
        borderBottom: "4px solid #1A1A1A",
      }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <Link to="/dev-blogs"
            style={{ fontFamily: "Bangers, cursive", fontSize: "1rem", letterSpacing: "0.1em", color: "#FFD700", textDecoration: "none", display: "inline-block", marginBottom: "1rem", border: "2px solid #FFD700", padding: "3px 14px", backgroundColor: "rgba(0,0,0,0.3)" }}>
            &larr; THE GAZETTE
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "Bangers, cursive", fontSize: "0.85rem", letterSpacing: "0.08em", color: "#fff", backgroundColor: "rgba(0,0,0,0.4)", border: "2px solid rgba(255,255,255,0.4)", padding: "2px 10px" }}>
              {post.category.toUpperCase()}
            </span>
            {post.featured && (
              <span style={{ fontFamily: "Bangers, cursive", fontSize: "0.85rem", letterSpacing: "0.08em", color: "#FFD700", border: "2px solid #FFD700", padding: "2px 10px", backgroundColor: "#1A1A1A" }}>
                BREAKING!
              </span>
            )}
          </div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            style={{ fontFamily: "Bangers, cursive", fontSize: "clamp(2.2rem, 6vw, 4.2rem)", letterSpacing: "0.04em", color: "#fff", WebkitTextStroke: "1px rgba(0,0,0,0.4)", lineHeight: 1.1, marginBottom: "1.2rem" }}>
            {post.title}
          </motion.h1>

          {/* Author Box & Meta Info */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", borderTop: "2px solid rgba(255,255,255,0.3)", paddingTop: "1rem" }}>
            {/* Written by Admin */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  border: "3px solid #1A1A1A",
                  boxShadow: "2px 2px 0 #FFD700",
                  overflow: "hidden",
                  backgroundColor: "#FFD700",
                  flexShrink: 0,
                }}
              >
                <img
                  src={authorPhoto}
                  alt={authorName}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/avatars/avatar-12.svg"
                  }}
                />
              </div>
              <div>
                <span style={{ fontFamily: "Comic Neue, cursive", fontSize: "0.78rem", letterSpacing: "0.08em", color: "rgba(255,255,255,0.9)", textTransform: "uppercase", display: "block" }}>
                  DISPATCH CORRESPONDENT
                </span>
                <span style={{ fontFamily: "Bangers, cursive", fontSize: "1.2rem", letterSpacing: "0.06em", color: "#FFD700", textShadow: "1px 1px 0 #1A1A1A" }}>
                  {authorName || "CHIEF EDITOR"}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1.2rem", alignItems: "center" }}>
              {dateStr && <span style={{ fontFamily: "Comic Neue, cursive", fontSize: "0.9rem", color: "rgba(255,255,255,0.9)", fontWeight: 700 }}>{dateStr}</span>}
              <span style={{ fontFamily: "Bangers, cursive", fontSize: "0.85rem", letterSpacing: "0.06em", color: "#1A1A1A", backgroundColor: "#FFD700", border: "2px solid #1A1A1A", padding: "2px 10px" }}>
                {post.readTime}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── ARTICLE CONTENT ── */}
      <HalftoneSection color="cream" style={{ padding: "3.5rem 1rem 3rem" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>

          {/* Optional Binary Cover Image */}
          {(() => {
            const coverUrl = bytesToBlobUrl(post.coverImage)
            if (!coverUrl) return null
            return (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  marginBottom: "2.5rem",
                  backgroundColor: "#FFF8E7",
                  border: "4px solid #1A1A1A",
                  boxShadow: "7px 7px 0 #1A1A1A",
                  overflow: "hidden",
                }}
              >
                <img
                  src={coverUrl}
                  alt={post.title}
                  style={{
                    width: "100%",
                    maxHeight: "440px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </motion.div>
            )
          })()}

          {/* Lead paragraph */}
          <p style={{ fontFamily: "Comic Neue, cursive", fontSize: "1.2rem", fontWeight: 700, color: "#1A1A1A", lineHeight: 1.75, borderLeft: "6px solid " + accent, paddingLeft: "1.25rem", marginBottom: "2rem", fontStyle: "italic", backgroundColor: "#FFF8E7", padding: "1rem 1.25rem", border: "3px solid #1A1A1A", borderLeftWidth: "6px", boxShadow: "4px 4px 0 #1A1A1A" }}>
            {post.excerpt}
          </p>

          {/* Rich Comic Body (with Bold, Italics, Headings, Quotes, & Binary Image Blobs) */}
          <div style={{ margin: "2.5rem 0" }}>
            <ComicRichContent content={post.content} images={post.images} />
          </div>
        </div>
      </HalftoneSection>

      {/* ── DISCUSSION / COMMENTS THREAD ── */}
      <HalftoneSection color="yellow" style={{ padding: "4rem 1rem 6rem", borderTop: "4px solid #1A1A1A" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>

          {/* Discussion Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem", borderBottom: "3px solid #1A1A1A", paddingBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <ActionWord word="DISCUSS!" color="#ED1D24" size="md" rotate={-5} />
              <div>
                <h2 style={{ fontFamily: "Bangers, cursive", fontSize: "2rem", letterSpacing: "0.08em", color: "#1A1A1A", margin: 0 }}>
                  THE TRANSMISSION BOARD
                </h2>
                <p style={{ fontFamily: "Comic Neue, cursive", fontSize: "0.9rem", color: "#444", margin: 0 }}>
                  {comments.length} {comments.length === 1 ? "TRANSMISSION" : "TRANSMISSIONS"} ON THIS DISPATCH
                </p>
              </div>
            </div>
          </div>

          {/* ── COMMENT INPUT FORM ── */}
          {user ? (
            <motion.form
              onSubmit={handleAddComment}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                backgroundColor: "#FFF8E7",
                border: "4px solid #1A1A1A",
                boxShadow: "6px 6px 0 #1A1A1A",
                padding: "1.5rem",
                marginBottom: "3rem",
              }}
            >
              {/* Commenter info header */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    border: "2px solid #1A1A1A",
                    overflow: "hidden",
                    backgroundColor: "#FFD700",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={userProfile?.photoURL || user.photoURL || "/avatars/avatar-12.svg"}
                    alt="Your Avatar"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div>
                  <span style={{ fontFamily: "Bangers, cursive", fontSize: "1.1rem", letterSpacing: "0.06em", color: "#1A1A1A" }}>
                    {userProfile?.displayName || user.displayName || "HERO"}
                  </span>
                  <span style={{ marginLeft: "0.5rem", fontFamily: "Bangers, cursive", fontSize: "0.75rem", letterSpacing: "0.06em", backgroundColor: isAdmin ? "#ED1D24" : "#0476F2", color: "#fff", padding: "1px 6px", border: "1px solid #1A1A1A" }}>
                    {isAdmin ? "SUPREME COMMANDER" : "OPERATIVE"}
                  </span>
                </div>
              </div>

              {/* Textarea */}
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Transmit your theory, reaction, or intel on this dispatch..."
                rows={3}
                required
                style={{
                  width: "100%",
                  fontFamily: "Comic Neue, cursive",
                  fontSize: "1rem",
                  padding: "10px 12px",
                  border: "3px solid #1A1A1A",
                  backgroundColor: "#fff",
                  boxSizing: "border-box",
                  outline: "none",
                  resize: "vertical",
                  marginBottom: "0.75rem",
                }}
              />

              {commentError && (
                <p style={{ fontFamily: "Comic Neue, cursive", fontSize: "0.85rem", color: "#ED1D24", border: "2px solid #ED1D24", padding: "6px 10px", margin: "0 0 0.75rem" }}>
                  {commentError}
                </p>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={submittingComment}
                  style={{
                    fontFamily: "Bangers, cursive",
                    fontSize: "1.15rem",
                    letterSpacing: "0.1em",
                    padding: "8px 24px",
                    backgroundColor: "#ED1D24",
                    color: "#fff",
                    border: "3px solid #1A1A1A",
                    boxShadow: "4px 4px 0 #1A1A1A",
                    cursor: submittingComment ? "not-allowed" : "pointer",
                    opacity: submittingComment ? 0.7 : 1,
                  }}
                >
                  {submittingComment ? "TRANSMITTING..." : "POST TRANSMISSION"}
                </motion.button>
              </div>
            </motion.form>
          ) : (
            <div
              style={{
                backgroundColor: "#FFF8E7",
                border: "4px solid #1A1A1A",
                boxShadow: "6px 6px 0 #1A1A1A",
                padding: "2rem",
                textAlign: "center",
                marginBottom: "3rem",
              }}
            >
              <SpeechBubble color="#FFD700" tailDirection="bottom-left">
                <span style={{ fontSize: "1.2rem" }}>IDENTIFY YOURSELF TO JOIN THE TRANSMISSION THREAD!</span>
              </SpeechBubble>
              <p style={{ fontFamily: "Comic Neue, cursive", color: "#555", marginTop: "1.2rem", marginBottom: "1.2rem" }}>
                Log in or create your operative account to post reactions, display your avatar, and debate with other comic fans.
              </p>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setAuthModalOpen(true)}
                style={{
                  fontFamily: "Bangers, cursive",
                  fontSize: "1.2rem",
                  letterSpacing: "0.1em",
                  padding: "8px 24px",
                  backgroundColor: "#0476F2",
                  color: "#fff",
                  border: "3px solid #1A1A1A",
                  boxShadow: "4px 4px 0 #1A1A1A",
                  cursor: "pointer",
                }}
              >
                LOG IN TO COMMENT &rarr;
              </motion.button>
            </div>
          )}

          {/* ── COMMENTS LIST ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {comments.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2.5rem 1rem", border: "3px dashed #1A1A1A", backgroundColor: "#FFF8E7" }}>
                <p style={{ fontFamily: "Bangers, cursive", fontSize: "1.6rem", letterSpacing: "0.08em", color: "#1A1A1A", opacity: 0.6, margin: 0 }}>
                  NO TRANSMISSIONS YET — BE THE FIRST TO DROP INTEL!
                </p>
              </div>
            ) : (
              <AnimatePresence>
                {comments.map((comment, index) => {
                  const isAuthor = user?.uid === comment.authorUid
                  const canDelete = !!user && (isAdmin || isAuthor)
                  const commentDate = comment.createdAt
                    ? new Date(comment.createdAt.seconds * 1000).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })
                    : "Just now"

                  return (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      style={{
                        backgroundColor: "#FFF8E7",
                        border: "3px solid #1A1A1A",
                        boxShadow: "5px 5px 0 #1A1A1A",
                        padding: "1.25rem",
                        position: "relative",
                      }}
                    >
                      {/* Comment Header */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem", borderBottom: "2px solid #1A1A1A", paddingBottom: "0.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                          {/* User Avatar */}
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: "50%",
                              border: "2px solid #1A1A1A",
                              overflow: "hidden",
                              backgroundColor: "#FFD700",
                              flexShrink: 0,
                            }}
                          >
                            <img
                              src={comment.authorPhotoURL || "/avatars/avatar-12.svg"}
                              alt={comment.authorName}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = "/avatars/avatar-12.svg"
                              }}
                            />
                          </div>

                          <div>
                            <span style={{ fontFamily: "Bangers, cursive", fontSize: "1.15rem", letterSpacing: "0.06em", color: "#1A1A1A" }}>
                              {comment.authorName}
                            </span>
                            <span style={{ marginLeft: "0.5rem", fontFamily: "Bangers, cursive", fontSize: "0.7rem", letterSpacing: "0.06em", backgroundColor: comment.authorIsAdmin ? "#ED1D24" : "#0476F2", color: "#fff", padding: "1px 5px", border: "1px solid #1A1A1A" }}>
                              {comment.authorIsAdmin ? "SUPREME COMMANDER" : "OPERATIVE"}
                            </span>
                          </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <span style={{ fontFamily: "Comic Neue, cursive", fontSize: "0.8rem", color: "#777" }}>
                            {commentDate}
                          </span>

                          {/* Delete Button (admin or author) */}
                          {canDelete && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDeleteComment(comment)}
                              style={{
                                fontFamily: "Bangers, cursive",
                                fontSize: "0.75rem",
                                letterSpacing: "0.06em",
                                padding: "2px 8px",
                                backgroundColor: isAdmin && !isAuthor ? "#ED1D24" : "#1A1A1A",
                                color: "#fff",
                                border: "1.5px solid #1A1A1A",
                                cursor: "pointer",
                              }}
                            >
                              {isAdmin && !isAuthor ? "ADMIN DEL" : "DELETE"}
                            </motion.button>
                          )}
                        </div>
                      </div>

                      {/* Comment Body */}
                      <p style={{ fontFamily: "Comic Neue, cursive", fontSize: "1rem", color: "#222", lineHeight: 1.6, margin: 0, whiteSpace: "pre-wrap" }}>
                        {comment.content}
                      </p>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            )}
          </div>

          {/* Back button */}
          <div style={{ marginTop: "3rem", textAlign: "center" }}>
            <Link to="/dev-blogs" style={{ textDecoration: "none" }}>
              <motion.div whileHover={{ scale: 1.04, y: -2 }}
                style={{ fontFamily: "Bangers, cursive", fontSize: "1.2rem", letterSpacing: "0.1em", color: "#fff", backgroundColor: "#1A1A1A", padding: "10px 28px", display: "inline-block", border: "3px solid #1A1A1A", boxShadow: "4px 4px 0 #ED1D24" }}>
                &larr; BACK TO THE GAZETTE
              </motion.div>
            </Link>
          </div>

        </div>
      </HalftoneSection>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </PageTransition>
  )
}

