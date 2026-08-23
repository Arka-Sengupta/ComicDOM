import { Timestamp } from "firebase/firestore"

export interface BlogDoc {
  id: string
  title: string
  excerpt: string
  content: string
  category: "Leak" | "Rumor" | "Expo" | "Review"
  createdAt?: Timestamp
  updatedAt?: Timestamp
  readTime: string
  featured: boolean
  authorUid: string
}
