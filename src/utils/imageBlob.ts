import { Bytes } from 'firebase/firestore'
import { BlogImageAttachment } from '../types/blog'

/**
 * Compresses an image client-side to ensure it stays within Firestore document size limits (< 500KB),
 * and converts it to a Firestore Bytes object.
 */
export async function fileToFirestoreBytes(file: File, maxDimension = 1000, quality = 0.75): Promise<{
  bytes: Bytes
  mimeType: string
  name: string
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        let { width, height } = img

        // Calculate aspect ratio scaling
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width)
            width = maxDimension
          } else {
            width = Math.round((width * maxDimension) / height)
            height = maxDimension
          }
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Canvas context not available'))
          return
        }

        ctx.drawImage(img, 0, 0, width, height)

        const outputMime = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
        canvas.toBlob(
          async (blob) => {
            if (!blob) {
              reject(new Error('Failed to generate image blob'))
              return
            }
            const arrayBuffer = await blob.arrayBuffer()
            const uint8 = new Uint8Array(arrayBuffer)
            const bytes = Bytes.fromUint8Array(uint8)
            resolve({
              bytes,
              mimeType: outputMime,
              name: file.name,
            })
          },
          outputMime,
          quality
        )
      }
      img.onerror = () => reject(new Error('Failed to load image file'))
      img.src = e.target?.result as string
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

/**
 * Converts a Firestore binary Bytes object into a browser Blob URL (blob:...)
 */
export function bytesToBlobUrl(imageAttachment?: BlogImageAttachment | null): string | null {
  if (!imageAttachment || !imageAttachment.data) return null

  try {
    const rawData = imageAttachment.data as any
    let uint8: Uint8Array

    if (rawData && typeof rawData.toUint8Array === 'function') {
      uint8 = rawData.toUint8Array()
    } else if (typeof rawData === 'string') {
      // Base64 string fallback
      const base64Clean = rawData.includes(',')
        ? rawData.split(',')[1]
        : rawData
      const binaryString = atob(base64Clean)
      uint8 = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        uint8[i] = binaryString.charCodeAt(i)
      }
    } else if (rawData instanceof Uint8Array) {
      uint8 = rawData
    } else {
      uint8 = new Uint8Array(rawData)
    }

    const mime = imageAttachment.mimeType || 'image/jpeg'
    const blob = new Blob([uint8 as unknown as BlobPart], { type: mime })
    return URL.createObjectURL(blob)
  } catch (err) {
    console.error('Error generating blob URL from binary data:', err)
    return null
  }
}
