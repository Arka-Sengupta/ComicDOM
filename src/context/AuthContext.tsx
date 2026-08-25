import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { User, onAuthStateChanged } from "firebase/auth"
import { doc, onSnapshot } from "firebase/firestore"
import { auth, db } from "../firebase"

const ADMIN_UID = import.meta.env.VITE_ADMIN_UID as string

export interface UserProfileData {
  uid: string
  email: string | null
  displayName: string
  photoURL: string
  bio?: string
  favoriteUniverse?: "Marvel" | "DC" | "Both"
}

interface AuthContextType {
  user: User | null
  userProfile: UserProfileData | null
  isAdmin: boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  isAdmin: false,
  loading: true,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let firestoreUnsub: (() => void) | null = null

    const authUnsub = onAuthStateChanged(auth, (u) => {
      setUser(u)

      if (firestoreUnsub) {
        firestoreUnsub()
        firestoreUnsub = null
      }

      if (u) {
        // Real-time listener for user document in Firestore
        firestoreUnsub = onSnapshot(
          doc(db, "users", u.uid),
          (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data()
              setUserProfile({
                uid: u.uid,
                email: data.email || u.email,
                displayName: data.displayName || u.displayName || u.email?.split("@")[0] || "Hero",
                photoURL: data.photoURL || u.photoURL || "/avatars/avatar-12.svg",
                bio: data.bio || "",
                favoriteUniverse: data.favoriteUniverse || "Both",
              })
            } else {
              setUserProfile({
                uid: u.uid,
                email: u.email,
                displayName: u.displayName || u.email?.split("@")[0] || "Hero",
                photoURL: u.photoURL || "/avatars/avatar-12.svg",
                bio: "",
                favoriteUniverse: "Both",
              })
            }
            setLoading(false)
          },
          () => {
            // Fallback to Auth object if Firestore rules or offline
            setUserProfile({
              uid: u.uid,
              email: u.email,
              displayName: u.displayName || u.email?.split("@")[0] || "Hero",
              photoURL: u.photoURL || "/avatars/avatar-12.svg",
              bio: "",
              favoriteUniverse: "Both",
            })
            setLoading(false)
          }
        )
      } else {
        setUserProfile(null)
        setLoading(false)
      }
    })

    return () => {
      authUnsub()
      if (firestoreUnsub) firestoreUnsub()
    }
  }, [])

  const isAdmin = !!user && !!ADMIN_UID && user.uid === ADMIN_UID

  return (
    <AuthContext.Provider value={{ user, userProfile, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
