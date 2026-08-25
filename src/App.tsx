import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { AuthProvider } from "./context/AuthContext"
import Navbar from "./components/layout/Navbar"
import Footer from "./components/layout/Footer"
import ScrollProgress from "./components/ui/ScrollProgress"
import Home from "./pages/Home"
import Marvel from "./pages/Marvel"
import DC from "./pages/DC"
import DevBlogs from "./pages/DevBlogs"
import BlogPost from "./pages/BlogPost"
import Profile from "./pages/Profile"
import NotFound from "./pages/404"

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/marvel" element={<Marvel />} />
        <Route path="/dc" element={<DC />} />
        <Route path="/dev-blogs" element={<DevBlogs />} />
        <Route path="/dev-blogs/:id" element={<BlogPost />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  )
}

function AppShell() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <ScrollProgress />
      <Navbar />
      <main style={{ flex: 1 }}>
        <AnimatedRoutes />
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  )
}
