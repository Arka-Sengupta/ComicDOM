import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { updateProfile } from "firebase/auth"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from "../firebase"
import { useAuth } from "../context/AuthContext"
import { AVATAR_PRESETS, DEFAULT_AVATAR, AvatarPreset } from "../data/avatars"
import PageTransition from "../components/ui/PageTransition"
import HalftoneSection from "../components/ui/HalftoneSection"
import ActionWord from "../components/ui/ActionWord"
import SpeechBubble from "../components/ui/SpeechBubble"
import AuthModal from "../components/ui/AuthModal"
import { showComicToast, showComicAlert } from "../utils/comicAlert"

type CategoryFilter = "ALL" | "HEROES" | "VILLAINS" | "RETRO" | "CUSTOM"

export default function Profile() {
  const { user, userProfile, isAdmin, loading } = useAuth()
  const [authModalOpen, setAuthModalOpen] = useState(false)

  // Profile Form States
  const [displayName, setDisplayName] = useState("")
  const [selectedAvatar, setSelectedAvatar] = useState(DEFAULT_AVATAR)
  const [customAvatarUrl, setCustomAvatarUrl] = useState("")
  const [bio, setBio] = useState("")
  const [favoriteUniverse, setFavoriteUniverse] = useState<"Marvel" | "DC" | "Both">("Both")

  // UI state
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("ALL")
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [copiedUid, setCopiedUid] = useState(false)

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || "")
      setSelectedAvatar(userProfile.photoURL || DEFAULT_AVATAR)
      if (userProfile.bio !== undefined) setBio(userProfile.bio)
      if (userProfile.favoriteUniverse) setFavoriteUniverse(userProfile.favoriteUniverse)
    } else if (user) {
      setDisplayName(user.displayName || "")
      setSelectedAvatar(user.photoURL || DEFAULT_AVATAR)
    }
  }, [userProfile, user])

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return

    setSaving(true)
    setErrorMsg("")
    setSuccessMsg("")

    try {
      const finalAvatar = categoryFilter === "CUSTOM" && customAvatarUrl.trim()
        ? customAvatarUrl.trim()
        : selectedAvatar

      const finalName = displayName.trim() || user.email?.split("@")[0] || "Comic Fan"

      // 1. Update Firebase Auth Profile
      await updateProfile(user, {
        displayName: finalName,
        photoURL: finalAvatar,
      })

      // 2. Sync to Firestore 'users' collection
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: finalName,
        photoURL: finalAvatar,
        bio: bio.trim(),
        favoriteUniverse,
        updatedAt: serverTimestamp(),
      }, { merge: true })

      setSuccessMsg("HERO DOSSIER & FIRESTORE PROFILE SAVED! POW!")
      showComicToast({ title: "DOSSIER UPDATED! POW!", icon: "success" })
      setTimeout(() => setSuccessMsg(""), 4000)
    } catch (err: unknown) {
      const msg = (err as Error).message || "Failed to update profile."
      setErrorMsg(msg)
      showComicAlert({ title: "DOSSIER UPDATE FAILED!", text: msg, icon: "error" })
    } finally {
      setSaving(false)
    }
  }

  function handleSelectPreset(preset: AvatarPreset) {
    setSelectedAvatar(preset.url)
    if (categoryFilter === "CUSTOM") {
      setCategoryFilter("ALL")
    }
  }

  function copyUid() {
    if (user?.uid) {
      navigator.clipboard.writeText(user.uid)
      setCopiedUid(true)
      setTimeout(() => setCopiedUid(false), 2000)
    }
  }

  const filteredAvatars = categoryFilter === "ALL"
    ? AVATAR_PRESETS
    : AVATAR_PRESETS.filter(a => a.category === categoryFilter)

  if (loading) {
    return (
      <PageTransition>
        <HalftoneSection color="yellow" style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <motion.div animate={{ scale: [1, 1.1, 1], rotate: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 1.2 }}>
            <ActionWord word="DECRYPTING..." color="#ED1D24" size="lg" />
          </motion.div>
        </HalftoneSection>
      </PageTransition>
    )
  }

  if (!user) {
    return (
      <PageTransition>
        <HalftoneSection color="cream" style={{ minHeight: "85vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 1rem" }}>
          <div style={{ maxWidth: 650, width: "100%", backgroundColor: "#FFF8E7", border: "4px solid #1A1A1A", boxShadow: "8px 8px 0 #1A1A1A", padding: "2.5rem 1.5rem", textAlign: "center" }}>
            <ActionWord word="HALT, CITIZEN!" color="#ED1D24" size="md" rotate={-5} />
            <div style={{ margin: "1.5rem 0" }}>
              <SpeechBubble color="#FFD700" tailDirection="bottom-left">
                <span style={{ fontSize: "1.3rem" }}>IDENTIFY YOURSELF TO ACCESS SECRET DOSSIER!</span>
              </SpeechBubble>
            </div>
            <p style={{ fontFamily: "Comic Neue, cursive", fontSize: "1.1rem", color: "#444", maxWidth: 450, margin: "0 auto 2rem" }}>
              You need an active ComicDOM operative account to customize your avatar, superhero codename, and universe preferences.
            </p>
            <motion.button
              whileHover={{ scale: 1.06, y: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setAuthModalOpen(true)}
              style={{
                fontFamily: "Bangers, cursive",
                fontSize: "1.4rem",
                letterSpacing: "0.1em",
                padding: "10px 32px",
                backgroundColor: "#ED1D24",
                color: "#fff",
                border: "3px solid #1A1A1A",
                boxShadow: "5px 5px 0 #1A1A1A",
                cursor: "pointer",
              }}
            >
              LOG IN OR JOIN UP &rarr;
            </motion.button>
          </div>
          <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
        </HalftoneSection>
      </PageTransition>
    )
  }

  const currentAvatarDisplay = categoryFilter === "CUSTOM" && customAvatarUrl.trim()
    ? customAvatarUrl.trim()
    : selectedAvatar

  return (
    <PageTransition>
      {/* ── HEADER BANNER ── */}
      <section
        style={{
          position: "relative",
          padding: "4rem 1rem 3rem",
          overflow: "hidden",
          backgroundColor: "#FFD700",
          backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.18) 1.5px, transparent 1.5px)",
          backgroundSize: "14px 14px",
          borderBottom: "4px solid #1A1A1A",
          textAlign: "center",
        }}
      >
        <div className="animate-float" style={{ position: "absolute", top: 15, right: 25, opacity: 0.35 }}>
          <ActionWord word="KAPOW!" color="#ED1D24" size="lg" rotate={-8} />
        </div>
        <div className="animate-wobble" style={{ position: "absolute", bottom: 10, left: 20, opacity: 0.3 }}>
          <ActionWord word="IDENTITY!" color="#0476F2" size="md" rotate={6} />
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220 }}>
          <span style={{ fontFamily: "Comic Neue, cursive", fontSize: "0.85rem", letterSpacing: "0.15em", textTransform: "uppercase", backgroundColor: "#1A1A1A", color: "#FFD700", padding: "3px 12px", border: "2px solid #1A1A1A" }}>
            CLASSIFIED PERSONNEL FILE #00{user.uid.slice(0, 4).toUpperCase()}
          </span>
          <h1
            style={{
              fontFamily: "Bangers, cursive",
              fontSize: "clamp(3rem, 8vw, 6rem)",
              letterSpacing: "0.06em",
              color: "#1A1A1A",
              textShadow: "4px 4px 0 #ED1D24",
              margin: "0.4rem 0 0.2rem",
              lineHeight: 1,
            }}
          >
            HERO DOSSIER &amp; PROFILE HQ
          </h1>
          <p style={{ fontFamily: "Comic Neue, cursive", fontSize: "1.05rem", color: "#333", fontWeight: 700 }}>
            Equip your retro comic avatar &bull; Update your superhero codename &bull; Manage credentials
          </p>
        </motion.div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <HalftoneSection color="cream" style={{ padding: "3.5rem 1rem 5rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2.5rem", alignItems: "start" }}>

          {/* ── LEFT COLUMN: ID BADGE & PROFILE FORM ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

            {/* TOP SECRET ID CARD */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                backgroundColor: "#FFF8E7",
                border: "4px solid #1A1A1A",
                boxShadow: "7px 7px 0 #1A1A1A",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {/* Header stripe */}
              <div style={{ backgroundColor: isAdmin ? "#ED1D24" : "#0476F2", padding: "0.6rem 1rem", borderBottom: "3px solid #1A1A1A", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "Bangers, cursive", fontSize: "1.1rem", letterSpacing: "0.1em", color: "#fff" }}>
                  {isAdmin ? "★ SUPREME COMMANDER ★" : "OPERATIVE ID BADGE"}
                </span>
                <span style={{ fontFamily: "Bangers, cursive", fontSize: "0.85rem", letterSpacing: "0.08em", backgroundColor: "#FFD700", color: "#1A1A1A", padding: "1px 8px", border: "2px solid #1A1A1A" }}>
                  {isAdmin ? "ADMIN ACCESS" : "CITIZEN GRADE"}
                </span>
              </div>

              <div style={{ padding: "1.5rem", display: "flex", gap: "1.25rem", alignItems: "center", flexWrap: "wrap" }}>
                {/* Avatar Preview */}
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  style={{
                    position: "relative",
                    width: 105,
                    height: 105,
                    borderRadius: "50%",
                    border: "4px solid #1A1A1A",
                    boxShadow: "4px 4px 0 #1A1A1A",
                    backgroundColor: "#FFD700",
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={currentAvatarDisplay}
                    alt="Current Avatar"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = DEFAULT_AVATAR
                    }}
                  />
                </motion.div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 180 }}>
                  <span style={{ fontFamily: "Bangers, cursive", fontSize: "0.8rem", letterSpacing: "0.1em", color: "#888" }}>
                    CODENAME
                  </span>
                  <h3 style={{ fontFamily: "Bangers, cursive", fontSize: "1.8rem", letterSpacing: "0.06em", color: "#1A1A1A", margin: "0 0 0.3rem", lineHeight: 1.1 }}>
                    {displayName || "Unnamed Hero"}
                  </h3>
                  <p style={{ fontFamily: "Comic Neue, cursive", fontSize: "0.9rem", color: "#555", margin: "0 0 0.5rem", wordBreak: "break-all" }}>
                    {user.email}
                  </p>

                  {/* <div style={{ display: "flex", gap: "0.4rem", alignItems: "center", flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "Bangers, cursive", fontSize: "0.75rem", letterSpacing: "0.06em", backgroundColor: "#1A1A1A", color: "#FFD700", padding: "2px 8px" }}>
                      UID: {user.uid.slice(0, 8)}...
                    </span>
                    <button
                      type="button"
                      onClick={copyUid}
                      style={{
                        fontFamily: "Bangers, cursive",
                        fontSize: "0.75rem",
                        letterSpacing: "0.06em",
                        backgroundColor: copiedUid ? "#22C55E" : "#fff",
                        color: copiedUid ? "#fff" : "#1A1A1A",
                        border: "2px solid #1A1A1A",
                        padding: "2px 8px",
                        cursor: "pointer",
                      }}
                    >
                      {copiedUid ? "COPIED!" : "COPY UID"}
                    </button>
                  </div> */}
                </div>
              </div>
            </motion.div>

            {/* EDIT DOSSIER FORM */}
            <motion.form
              onSubmit={handleSaveProfile}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                backgroundColor: "#FFF8E7",
                border: "4px solid #1A1A1A",
                boxShadow: "7px 7px 0 #1A1A1A",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "1.2rem",
              }}
            >
              <div style={{ borderBottom: "3px solid #1A1A1A", paddingBottom: "0.6rem" }}>
                <h2 style={{ fontFamily: "Bangers, cursive", fontSize: "1.6rem", letterSpacing: "0.08em", color: "#1A1A1A", margin: 0 }}>
                  UPDATE SECRET IDENTIFIER
                </h2>
              </div>

              {/* Display Name */}
              <div>
                <label style={{ fontFamily: "Bangers, cursive", fontSize: "1rem", letterSpacing: "0.08em", display: "block", marginBottom: "0.3rem" }}>
                  HERO CODENAME / DISPLAY NAME *
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Captain Cosmic, Bat-Fan 66"
                  required
                  style={{
                    width: "100%",
                    fontFamily: "Comic Neue, cursive",
                    fontSize: "1rem",
                    padding: "9px 12px",
                    border: "3px solid #1A1A1A",
                    backgroundColor: "#fff",
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                />
              </div>

              {/* Bio / Battle Cry */}
              <div>
                <label style={{ fontFamily: "Bangers, cursive", fontSize: "1rem", letterSpacing: "0.08em", display: "block", marginBottom: "0.3rem" }}>
                  BATTLE CRY / CATCHPHRASE
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  placeholder="e.g. 'I can do this all day!' or 'I am vengeance!'"
                  style={{
                    width: "100%",
                    fontFamily: "Comic Neue, cursive",
                    fontSize: "0.95rem",
                    padding: "9px 12px",
                    border: "3px solid #1A1A1A",
                    backgroundColor: "#fff",
                    boxSizing: "border-box",
                    outline: "none",
                    resize: "vertical",
                  }}
                />
              </div>

              {/* Universe Allegiance */}
              <div>
                <label style={{ fontFamily: "Bangers, cursive", fontSize: "1rem", letterSpacing: "0.08em", display: "block", marginBottom: "0.4rem" }}>
                  PRIMARY UNIVERSE ALLEGIANCE
                </label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {(["Marvel", "DC", "Both"] as const).map((univ) => (
                    <button
                      key={univ}
                      type="button"
                      onClick={() => setFavoriteUniverse(univ)}
                      style={{
                        flex: 1,
                        fontFamily: "Bangers, cursive",
                        fontSize: "1.1rem",
                        letterSpacing: "0.08em",
                        padding: "7px 4px",
                        border: "3px solid #1A1A1A",
                        cursor: "pointer",
                        backgroundColor:
                          favoriteUniverse === univ
                            ? univ === "Marvel"
                              ? "#ED1D24"
                              : univ === "DC"
                              ? "#0476F2"
                              : "#FFD700"
                            : "#fff",
                        color:
                          favoriteUniverse === univ
                            ? univ === "Both"
                              ? "#1A1A1A"
                              : "#fff"
                            : "#1A1A1A",
                        boxShadow: favoriteUniverse === univ ? "3px 3px 0 #1A1A1A" : "none",
                      }}
                    >
                      {univ.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Success / Error Banners */}
              <AnimatePresence>
                {successMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      backgroundColor: "#22C55E",
                      color: "#fff",
                      fontFamily: "Bangers, cursive",
                      fontSize: "1.1rem",
                      letterSpacing: "0.08em",
                      padding: "8px 14px",
                      border: "3px solid #1A1A1A",
                      textAlign: "center",
                    }}
                  >
                    {successMsg}
                  </motion.div>
                )}
                {errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      backgroundColor: "#ED1D24",
                      color: "#fff",
                      fontFamily: "Comic Neue, cursive",
                      fontSize: "0.9rem",
                      padding: "8px 12px",
                      border: "3px solid #1A1A1A",
                    }}
                  >
                    {errorMsg}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={saving}
                style={{
                  fontFamily: "Bangers, cursive",
                  fontSize: "1.3rem",
                  letterSpacing: "0.1em",
                  padding: "12px",
                  backgroundColor: "#ED1D24",
                  color: "#fff",
                  border: "3px solid #1A1A1A",
                  boxShadow: "5px 5px 0 #1A1A1A",
                  cursor: saving ? "not-allowed" : "pointer",
                  opacity: saving ? 0.7 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
              >
                {saving ? "SAVING ENCRYPTED DATA..." : "SAVE DOSSIER CHANGES"}
              </motion.button>
            </motion.form>
          </div>

          {/* ── RIGHT COLUMN: AVATAR SELECTION VAULT ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            <div
              style={{
                backgroundColor: "#FFF8E7",
                border: "4px solid #1A1A1A",
                boxShadow: "7px 7px 0 #1A1A1A",
                padding: "1.5rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem", borderBottom: "3px solid #1A1A1A", paddingBottom: "0.8rem", marginBottom: "1.2rem" }}>
                <div>
                  <h2 style={{ fontFamily: "Bangers, cursive", fontSize: "1.7rem", letterSpacing: "0.08em", color: "#1A1A1A", margin: 0 }}>
                    COMIC AVATAR VAULT
                  </h2>
                  <p style={{ fontFamily: "Comic Neue, cursive", fontSize: "0.85rem", color: "#666", margin: 0 }}>
                    Choose a vintage comic avatar or provide an external image URL.
                  </p>
                </div>
                <ActionWord word="POW!" color="#0476F2" size="sm" rotate={8} />
              </div>

              {/* Filter Tabs */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1.5rem" }}>
                {(["ALL", "HEROES", "VILLAINS", "RETRO", "CUSTOM"] as CategoryFilter[]).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setCategoryFilter(tab)}
                    style={{
                      fontFamily: "Bangers, cursive",
                      fontSize: "0.95rem",
                      letterSpacing: "0.08em",
                      padding: "5px 14px",
                      border: "2px solid #1A1A1A",
                      cursor: "pointer",
                      backgroundColor: categoryFilter === tab ? "#1A1A1A" : "#fff",
                      color: categoryFilter === tab ? "#FFD700" : "#1A1A1A",
                      boxShadow: categoryFilter === tab ? "2px 2px 0 #ED1D24" : "none",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {tab === "CUSTOM" ? "+ CUSTOM URL" : tab}
                  </button>
                ))}
              </div>

              {/* CUSTOM URL INPUT PANEL */}
              {categoryFilter === "CUSTOM" ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    backgroundColor: "#FFD70018",
                    border: "3px dashed #1A1A1A",
                    padding: "1.5rem",
                    marginBottom: "1rem",
                  }}
                >
                  <label style={{ fontFamily: "Bangers, cursive", fontSize: "1.1rem", letterSpacing: "0.08em", display: "block", marginBottom: "0.5rem" }}>
                    ENTER EXTERNAL IMAGE URL
                  </label>
                  <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                    <input
                      type="url"
                      value={customAvatarUrl}
                      onChange={(e) => setCustomAvatarUrl(e.target.value)}
                      placeholder="https://example.com/my-avatar.png"
                      style={{
                        flex: 1,
                        minWidth: 200,
                        fontFamily: "Comic Neue, cursive",
                        fontSize: "0.95rem",
                        padding: "9px 12px",
                        border: "3px solid #1A1A1A",
                        backgroundColor: "#fff",
                        outline: "none",
                      }}
                    />
                  </div>
                  <p style={{ fontFamily: "Comic Neue, cursive", fontSize: "0.8rem", color: "#666", marginTop: "0.5rem" }}>
                    Supports direct links to PNG, JPG, WebP, or SVG from image hosting services.
                  </p>

                  {customAvatarUrl && (
                    <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                      <div style={{ width: 64, height: 64, borderRadius: "50%", border: "3px solid #1A1A1A", overflow: "hidden", backgroundColor: "#fff" }}>
                        <img
                          src={customAvatarUrl}
                          alt="Custom Preview"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = DEFAULT_AVATAR
                          }}
                        />
                      </div>
                      <span style={{ fontFamily: "Bangers, cursive", fontSize: "0.95rem", color: "#22C55E" }}>
                        &larr; LIVE PREVIEW LOADED
                      </span>
                    </div>
                  )}
                </motion.div>
              ) : null}

              {/* AVATARS GRID */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
                  gap: "1rem",
                  maxHeight: "520px",
                  overflowY: "auto",
                  paddingRight: "4px",
                }}
              >
                {filteredAvatars.map((preset) => {
                  const isSelected = selectedAvatar === preset.url && categoryFilter !== "CUSTOM"
                  return (
                    <motion.div
                      key={preset.id}
                      whileHover={{ scale: 1.05, y: -4 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSelectPreset(preset)}
                      style={{
                        position: "relative",
                        cursor: "pointer",
                        backgroundColor: "#fff",
                        border: isSelected ? "4px solid #ED1D24" : "3px solid #1A1A1A",
                        boxShadow: isSelected ? "5px 5px 0 #ED1D24" : "3px 3px 0 #1A1A1A",
                        padding: "0.75rem 0.5rem",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        transition: "border 0.2s, box-shadow 0.2s",
                      }}
                    >
                      {/* Equipped Ribbon */}
                      {isSelected && (
                        <div
                          style={{
                            position: "absolute",
                            top: -2,
                            right: -2,
                            backgroundColor: "#ED1D24",
                            color: "#fff",
                            fontFamily: "Bangers, cursive",
                            fontSize: "0.65rem",
                            letterSpacing: "0.08em",
                            padding: "2px 6px",
                            border: "1.5px solid #1A1A1A",
                            zIndex: 10,
                          }}
                        >
                          ACTIVE
                        </div>
                      )}

                      {/* Image Frame */}
                      <div
                        style={{
                          width: 72,
                          height: 72,
                          borderRadius: "50%",
                          border: "3px solid #1A1A1A",
                          backgroundColor: preset.color + "22",
                          overflow: "hidden",
                          marginBottom: "0.5rem",
                        }}
                      >
                        <img
                          src={preset.url}
                          alt={preset.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>

                      {/* Title */}
                      <h4
                        style={{
                          fontFamily: "Bangers, cursive",
                          fontSize: "0.95rem",
                          letterSpacing: "0.04em",
                          color: "#1A1A1A",
                          margin: "0 0 0.2rem",
                          lineHeight: 1.1,
                        }}
                      >
                        {preset.name}
                      </h4>

                      {/* Tag */}
                      <span
                        style={{
                          fontFamily: "Bangers, cursive",
                          fontSize: "0.7rem",
                          letterSpacing: "0.06em",
                          backgroundColor: preset.color,
                          color: "#fff",
                          padding: "1px 6px",
                          border: "1px solid #1A1A1A",
                        }}
                      >
                        {preset.tag}
                      </span>
                    </motion.div>
                  )
                })}
              </div>

              
            </div>

          </div>

        </div>
      </HalftoneSection>
    </PageTransition>
  )
}
