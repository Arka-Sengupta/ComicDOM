import React, { useMemo } from 'react'
import { BlogImageAttachment } from '../../types/blog'
import { bytesToBlobUrl } from '../../utils/imageBlob'

interface Props {
  content: string
  images?: BlogImageAttachment[]
  className?: string
}

export default function ComicRichContent({ content, images = [], className = '' }: Props) {
  // Map attachment ID to generated Blob URL
  const imageBlobMap = useMemo(() => {
    const map = new Map<string, string>()
    images.forEach((img) => {
      const url = bytesToBlobUrl(img)
      if (url) {
        map.set(img.id, url)
        map.set(img.name, url)
      }
    })
    return map
  }, [images])

  // Simple, robust Comic Markdown parser
  const renderFormattedLine = (line: string, lineIndex: number) => {
    const trimmed = line.trim()
    if (!trimmed) {
      return <div key={lineIndex} style={{ height: '1.2rem' }} />
    }

    // 1. Image reference: ![alt](image_id) or ![alt](url)
    const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/)
    if (imgMatch) {
      const altText = imgMatch[1]
      const imgRef = imgMatch[2]
      const blobUrl = imageBlobMap.get(imgRef) || imgRef

      return (
        <figure
          key={lineIndex}
          style={{
            margin: '1.8rem 0',
            backgroundColor: '#FFF8E7',
            border: '3px solid #1A1A1A',
            boxShadow: '6px 6px 0 #1A1A1A',
            padding: '0.6rem',
            textAlign: 'center',
          }}
        >
          <img
            src={blobUrl}
            alt={altText}
            style={{
              width: '100%',
              maxHeight: '520px',
              objectFit: 'contain',
              border: '2px solid #1A1A1A',
              backgroundColor: '#1A1A1A',
              display: 'block',
            }}
          />
          {altText && (
            <figcaption
              style={{
                fontFamily: 'Comic Neue, cursive',
                fontSize: '0.9rem',
                fontWeight: 700,
                color: '#444',
                marginTop: '0.5rem',
                fontStyle: 'italic',
              }}
            >
              &bull; {altText} &bull;
            </figcaption>
          )}
        </figure>
      )
    }

    // 2. Headings
    if (trimmed.startsWith('### ')) {
      return (
        <h3
          key={lineIndex}
          style={{
            fontFamily: 'Bangers, cursive',
            fontSize: '1.8rem',
            letterSpacing: '0.06em',
            color: '#1A1A1A',
            borderBottom: '3px solid #1A1A1A',
            paddingBottom: '0.3rem',
            margin: '2rem 0 0.8rem',
          }}
        >
          {parseInlineText(trimmed.replace(/^###\s+/, ''))}
        </h3>
      )
    }

    if (trimmed.startsWith('## ')) {
      return (
        <h2
          key={lineIndex}
          style={{
            fontFamily: 'Bangers, cursive',
            fontSize: '2.3rem',
            letterSpacing: '0.06em',
            color: '#ED1D24',
            textShadow: '1px 1px 0 #1A1A1A',
            margin: '2.4rem 0 0.8rem',
          }}
        >
          {parseInlineText(trimmed.replace(/^##\s+/, ''))}
        </h2>
      )
    }

    if (trimmed.startsWith('# ')) {
      return (
        <h1
          key={lineIndex}
          style={{
            fontFamily: 'Bangers, cursive',
            fontSize: '2.8rem',
            letterSpacing: '0.06em',
            color: '#1A1A1A',
            textShadow: '2px 2px 0 #FFD700',
            margin: '2.5rem 0 1rem',
          }}
        >
          {parseInlineText(trimmed.replace(/^#\s+/, ''))}
        </h1>
      )
    }

    // 3. Blockquotes / Speech Callouts
    if (trimmed.startsWith('> ')) {
      return (
        <blockquote
          key={lineIndex}
          style={{
            margin: '1.4rem 0',
            padding: '1rem 1.25rem',
            backgroundColor: '#FFD70020',
            border: '3px solid #1A1A1A',
            borderLeft: '7px solid #FFD700',
            boxShadow: '4px 4px 0 #1A1A1A',
            fontFamily: 'Comic Neue, cursive',
            fontSize: '1.1rem',
            fontWeight: 700,
            fontStyle: 'italic',
            color: '#1A1A1A',
          }}
        >
          {parseInlineText(trimmed.replace(/^>\s+/, ''))}
        </blockquote>
      )
    }

    // 4. Bullet list item
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      return (
        <li
          key={lineIndex}
          style={{
            marginLeft: '1.5rem',
            marginBottom: '0.5rem',
            fontFamily: 'Comic Neue, cursive',
            fontSize: '1.05rem',
            color: '#333',
            lineHeight: 1.7,
          }}
        >
          {parseInlineText(trimmed.replace(/^[-*]\s+/, ''))}
        </li>
      )
    }

    // 5. Standard Paragraph
    return (
      <p
        key={lineIndex}
        style={{
          fontFamily: 'Comic Neue, cursive',
          fontSize: '1.05rem',
          color: '#222',
          lineHeight: 1.85,
          marginBottom: '1rem',
        }}
      >
        {parseInlineText(line)}
      </p>
    )
  }

  // Parses inline Bold (**text**), Italic (*text* or _text_), Code (`text`), and Action Badges ([POW!])
  const parseInlineText = (text: string): React.ReactNode[] => {
    // Regex splits by bold (**), italic (* or _), code (`), or action words ([WORD!])
    const parts = text.split(/(\*{2}.+?\*{2}|\*.+?\*|_.+?_|`.+?`|\[[A-Z0-9!#$? ]+\])/g)

    return parts.map((part, i) => {
      // Bold: **text**
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        return (
          <strong
            key={i}
            style={{
              fontWeight: 800,
              color: '#ED1D24',
              backgroundColor: '#FFD70026',
              padding: '0 3px',
            }}
          >
            {part.slice(2, -2)}
          </strong>
        )
      }

      // Italic: *text* or _text_
      if ((part.startsWith('*') && part.endsWith('*') && part.length > 2) ||
          (part.startsWith('_') && part.endsWith('_') && part.length > 2)) {
        return (
          <em
            key={i}
            style={{
              fontStyle: 'italic',
              fontWeight: 700,
              color: '#0476F2',
            }}
          >
            {part.slice(1, -1)}
          </em>
        )
      }

      // Code: `code`
      if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
        return (
          <code
            key={i}
            style={{
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              backgroundColor: '#1A1A1A',
              color: '#FFD700',
              padding: '2px 6px',
              border: '1px solid #1A1A1A',
            }}
          >
            {part.slice(1, -1)}
          </code>
        )
      }

      // Comic Action Badges: [POW!], [ZAP!], [BREAKING!], etc.
      if (part.startsWith('[') && part.endsWith(']') && part.length > 2) {
        const badgeWord = part.slice(1, -1)
        return (
          <span
            key={i}
            style={{
              fontFamily: 'Bangers, cursive',
              fontSize: '0.85rem',
              letterSpacing: '0.08em',
              backgroundColor: '#ED1D24',
              color: '#fff',
              border: '1.5px solid #1A1A1A',
              padding: '1px 7px',
              margin: '0 4px',
              display: 'inline-block',
              transform: 'rotate(-2deg)',
            }}
          >
            {badgeWord}
          </span>
        )
      }

      return part
    })
  }

  return (
    <div className={className}>
      {content.split('\n').map((line, idx) => renderFormattedLine(line, idx))}
    </div>
  )
}
