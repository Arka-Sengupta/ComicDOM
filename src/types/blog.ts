import { Timestamp, Bytes } from "firebase/firestore"

export interface BlogImageAttachment {
  id: string
  name: string
  mimeType: string
  data: Bytes | string
}

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
  authorName?: string
  authorPhotoURL?: string
  coverImage?: BlogImageAttachment
  images?: BlogImageAttachment[]
}

export interface CommentDoc {
  id: string
  blogId: string
  content: string
  authorUid: string
  authorName: string
  authorPhotoURL: string
  authorIsAdmin?: boolean
  createdAt?: Timestamp
}
