export interface BlogPost {
  id: number
  title: string
  excerpt: string
  category: 'Leak' | 'Rumor' | 'Expo' | 'Review'
  date: string
  readTime: string
  featured: boolean
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'MAJOR LEAK: Secret Villain Revealed for Upcoming Crossover Event!',
    excerpt:
      'Sources close to production have allegedly confirmed the identity of the shadow figure seen in the post-credits scene of last summer placard biggest blockbuster. Here is everything we know so far and what it means for the future of the franchise...',
    category: 'Leak',
    date: 'Aug 20, 2026',
    readTime: '5 min read',
    featured: true,
  },
  {
    id: 2,
    title: 'Comic-Con 2026: Everything That Was Announced This Weekend',
    excerpt:
      'It was a wild weekend at the biggest comics and pop culture expo of the year. From surprise panel appearances to first-look trailers, we have compiled every major announcement so you do not have to dig through a hundred threads...',
    category: 'Expo',
    date: 'Aug 18, 2026',
    readTime: '8 min read',
    featured: false,
  },
]
