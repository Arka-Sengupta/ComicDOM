import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth"
import { auth, googleProvider } from "../../firebase"
import { useAuth } from "../../context/AuthContext"

interface Props {
  isOpen: boolean
  onClose: () => void
}

type Tab = "login" | "signup"

const inputStyle: React.CSSProperties = {
  fontFamily: "Comic Neue, cursive",
  fontSize: "0.95rem",
  padding: "10px 12px",
  border: "3px solid #1A1A1A",
  backgroundColor: "#fff",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  display: "block",
}

export default function AuthModal({ isOpen, onClose }: Props) {
  const { user } = useAuth()
  const [tab, setTab] = useState<Tab>("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  function reset() { setEmail(""); setPassword(""); setError(""); setBusy(false) }

  async function handleGoogle() {
    setBusy(true); setError("")
    try { await signInWithPopup(auth, googleProvider); onClose() }
    catch (e: unknown) { setError((e as Error).message) }
    finally { setBusy(false) }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError("")
    try {
      if (tab === "login") await signInWithEmailAndPassword(auth, email, password)
      else await createUserWithEmailAndPassword(auth, email, password)
      reset(); onClose()
    } catch (e: unknown) {
      const msg = (e as Error).message.replace("Firebase: ", "").replace(/\(auth\/.*?\)\.?/, "").trim()
      setError(msg)
    } finally { setBusy(false) }
  }

  async function handleLogout() { await signOut(auth); onClose() }

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.72)",
            }}
          />

          <motion.div
            key="modal"
            initial={{ scale: 0.7, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            style={{
              position: "relative",
              zIndex: 1,
              width: "100%",
              maxWidth: 430,
              backgroundColor: "#FFF8E7",
              border: "4px solid #1A1A1A",
              boxShadow: "8px 8px 0 #1A1A1A",
            }}
          >
            {/* Modal Header */}
            <div style={{ backgroundColor: "#FFD700", borderBottom: "3px solid #1A1A1A", padding: "0.9rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "Bangers, cursive", fontSize: "1.7rem", letterSpacing: "0.1em", color: "#1A1A1A" }}>
                {user ? "YOUR ACCOUNT" : tab === "login" ? "LOG IN!" : "JOIN UP!"}
              </span>
              <button onClick={onClose} style={{ background: "none", border: "none", fontFamily: "Bangers, cursive", fontSize: "1.4rem", cursor: "pointer", color: "#1A1A1A", lineHeight: 1 }}>
                X
              </button>
            </div>

            <div style={{ padding: "1.5rem" }}>
              {user ? (
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontFamily: "Bangers, cursive", fontSize: "1rem", letterSpacing: "0.08em", color: "#1A1A1A", marginBottom: "0.3rem" }}>LOGGED IN AS:</p>
                  <p style={{ fontFamily: "Comic Neue, cursive", color: "#555", marginBottom: "1.5rem", wordBreak: "break-all" }}>
                    {user.displayName || user.email}
                  </p>
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={handleLogout}
                    style={{ fontFamily: "Bangers, cursive", fontSize: "1.1rem", letterSpacing: "0.1em", padding: "9px 24px", backgroundColor: "#ED1D24", color: "#fff", border: "3px solid #1A1A1A", boxShadow: "4px 4px 0 #1A1A1A", cursor: "pointer", width: "100%" }}>
                    SIGN OUT
                  </motion.button>
                </div>
              ) : (
                <>
                  {/* Tabs */}
                  <div style={{ display: "flex", border: "3px solid #1A1A1A", marginBottom: "1.25rem" }}>
                    {(["login", "signup"] as Tab[]).map((t, i) => (
                      <button key={t} onClick={() => { setTab(t); setError("") }}
                        style={{ flex: 1, fontFamily: "Bangers, cursive", fontSize: "1.1rem", letterSpacing: "0.1em", padding: "8px", backgroundColor: tab === t ? "#1A1A1A" : "#fff", color: tab === t ? "#FFD700" : "#1A1A1A", border: "none", borderRight: i === 0 ? "2px solid #1A1A1A" : "none", cursor: "pointer" }}>
                        {t === "login" ? "LOG IN" : "SIGN UP"}
                      </button>
                    ))}
                  </div>

                  {/* Google */}
                  <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} onClick={handleGoogle} disabled={busy}
                    style={{ width: "100%", fontFamily: "Bangers, cursive", fontSize: "1rem", letterSpacing: "0.08em", padding: "10px", backgroundColor: "#fff", color: "#1A1A1A", border: "3px solid #1A1A1A", boxShadow: "4px 4px 0 #1A1A1A", cursor: "pointer", marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                    <svg width="18" height="18" viewBox="0 0 48 48">
                      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.3 9 3.4l6.7-6.7C35.8 2.3 30.3 0 24 0 14.7 0 6.8 5.5 3 13.5l7.8 6C12.8 13.2 17.9 9.5 24 9.5z"/>
                      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8C43.7 37.4 46.5 31.4 46.5 24.5z"/>
                      <path fill="#FBBC05" d="M10.8 28.5C10.3 27 10 25.5 10 24s.3-3 .8-4.5L3 13.5C1.1 17.1 0 21.4 0 26c0 4.7 1.1 9.1 3 12.7l7.8-6.2z"/>
                      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.2 1.5-5 2.3-8.4 2.3-6.1 0-11.2-3.7-13.2-8.9l-7.8 6.2C6.8 42.5 14.7 48 24 48z"/>
                    </svg>
                    CONTINUE WITH GOOGLE
                  </motion.button>

                  {/* Divider */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                    <div style={{ flex: 1, height: 2, backgroundColor: "#1A1A1A" }} />
                    <span style={{ fontFamily: "Bangers, cursive", fontSize: "0.9rem", letterSpacing: "0.1em" }}>OR</span>
                    <div style={{ flex: 1, height: 2, backgroundColor: "#1A1A1A" }} />
                  </div>

                  {/* Email form */}
                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <input type="email" placeholder="EMAIL ADDRESS" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} />
                    <input type="password" placeholder="PASSWORD" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle} />

                    {error && (
                      <p style={{ fontFamily: "Comic Neue, cursive", fontSize: "0.85rem", color: "#ED1D24", border: "2px solid #ED1D24", padding: "6px 10px", margin: 0 }}>
                        {error}
                      </p>
                    )}

                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} type="submit" disabled={busy}
                      style={{ fontFamily: "Bangers, cursive", fontSize: "1.1rem", letterSpacing: "0.1em", padding: "10px", backgroundColor: tab === "login" ? "#ED1D24" : "#0476F2", color: "#fff", border: "3px solid #1A1A1A", boxShadow: "4px 4px 0 #1A1A1A", cursor: busy ? "not-allowed" : "pointer", opacity: busy ? 0.7 : 1 }}>
                      {busy ? "LOADING..." : tab === "login" ? "LOG IN >" : "CREATE ACCOUNT >"}
                    </motion.button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
