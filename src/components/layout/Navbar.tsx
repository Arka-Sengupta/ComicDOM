import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "../../context/AuthContext"
import AuthModal from "../ui/AuthModal"

const NAV = [
  { path: "/",          label: "HOME" },
  { path: "/marvel",    label: "MARVEL" },
  { path: "/dc",        label: "DC" },
  { path: "/dev-blogs", label: "GAZETTE" },
  // { path: "/profile",   label: "DOSSIER HQ" },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const { user, userProfile, isAdmin, loading } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)

  const displayName = userProfile?.displayName?.split(" ")[0] || user?.displayName?.split(" ")[0] || user?.email?.split("@")[0] || "USER"
  const avatarUrl = userProfile?.photoURL || user?.photoURL || "/avatars/avatar-12.svg"

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        style={{ position: "sticky", top: 0, zIndex: 100, backgroundColor: "#FFD700", borderBottom: "4px solid #1A1A1A", boxShadow: "0 4px 0 #1A1A1A" }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0.6rem 1rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>

          {/* Logo */}
          <Link to="/" style={{ textDecoration: "none", flexShrink: 0 }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              style={{ fontFamily: "Bangers, cursive", fontSize: "2.4rem", letterSpacing: "0.08em", lineHeight: 1, userSelect: "none" }}>
              <span style={{ color: "#ED1D24", WebkitTextStroke: "2px #1A1A1A" }}>COMIC</span>
              <span style={{ color: "#0476F2", WebkitTextStroke: "2px #1A1A1A" }}>DOM</span>
            </motion.div>
          </Link>

          {/* Desktop nav + auth */}
          <div className="hidden-mobile" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {NAV.map(link => {
              const active = pathname === link.path
              return (
                <Link key={link.path} to={link.path} style={{ textDecoration: "none" }}>
                  <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.95 }}
                    style={{ position: "relative", fontFamily: "Bangers, cursive", fontSize: "1.1rem", letterSpacing: "0.1em", padding: "6px 14px", border: "3px solid #1A1A1A", boxShadow: active ? "3px 3px 0 #ED1D24" : "3px 3px 0 #1A1A1A", backgroundColor: active ? "#1A1A1A" : "#fff", color: active ? "#FFD700" : "#1A1A1A", transition: "all 0.15s ease" }}>
                    {link.label}
                    {active && (
                      <motion.div
                        layoutId="navActiveBar"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        style={{ position: "absolute", left: 5, right: 5, bottom: 3, height: 4, backgroundColor: "#FFD700" }}
                      />
                    )}
                  </motion.div>
                </Link>
              )
            })}

            {/* Auth button */}
            {!loading && (
              <motion.button whileHover={{ y: -3 }} whileTap={{ scale: 0.95 }} onClick={() => setAuthOpen(true)}
                style={{
                  fontFamily: "Bangers, cursive", fontSize: "1.05rem", letterSpacing: "0.1em",
                  padding: "5px 12px", border: "3px solid #1A1A1A", cursor: "pointer",
                  boxShadow: "3px 3px 0 #1A1A1A",
                  backgroundColor: user ? (isAdmin ? "#ED1D24" : "#0476F2") : "#1A1A1A",
                  color: user ? "#fff" : "#FFD700",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.45rem",
                }}>
                {user && (
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      border: "2px solid #1A1A1A",
                      overflow: "hidden",
                      backgroundColor: "#fff",
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                )}
                <span>{!user ? "LOG IN" : isAdmin ? "ADMIN " + displayName.toUpperCase() : displayName.toUpperCase()}</span>
              </motion.button>
            )}
          </div>

          {/* Hamburger */}
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setMenuOpen(o => !o)} className="show-mobile"
            style={{ fontFamily: "Bangers, cursive", fontSize: "1.5rem", padding: "4px 12px", border: "3px solid #1A1A1A", backgroundColor: "#fff", cursor: "pointer" }}>
            {menuOpen ? "X" : "="}
          </motion.button>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div key="drawer" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              style={{ overflow: "hidden", borderTop: "3px solid #1A1A1A", backgroundColor: "#FFD700" }}>
              {NAV.map(link => {
                const active = pathname === link.path
                return (
                  <Link key={link.path} to={link.path} onClick={() => setMenuOpen(false)}
                    style={{ display: "block", fontFamily: "Bangers, cursive", fontSize: "1.3rem", letterSpacing: "0.1em", padding: "0.75rem 1.5rem", borderBottom: "2px solid #1A1A1A", backgroundColor: active ? "#1A1A1A" : "transparent", color: active ? "#FFD700" : "#1A1A1A", textDecoration: "none" }}>
                    {link.label}
                  </Link>
                )
              })}
              {!loading && (
                <button onClick={() => { setMenuOpen(false); setAuthOpen(true) }}
                  style={{ display: "block", width: "100%", textAlign: "left", fontFamily: "Bangers, cursive", fontSize: "1.3rem", letterSpacing: "0.1em", padding: "0.75rem 1.5rem", borderBottom: "2px solid #1A1A1A", backgroundColor: user ? "#ED1D24" : "#1A1A1A", color: user ? "#fff" : "#FFD700", border: "none", cursor: "pointer" }}>
                  {user ? "ACCOUNT / LOGOUT" : "LOG IN"}
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <style>{`
          @media (min-width: 768px) { .show-mobile { display: none !important; } }
          @media (max-width: 767px) { .hidden-mobile { display: none !important; } }
        `}</style>
      </motion.nav>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  )
}
