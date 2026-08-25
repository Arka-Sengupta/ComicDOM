export interface AvatarPreset {
  id: string
  name: string
  url: string
  category: 'HEROES' | 'VILLAINS' | 'RETRO'
  tag: string
  color: string
}

export const AVATAR_PRESETS: AvatarPreset[] = [
  { id: 'vigilante', name: 'Dark Vigilante', url: '/avatars/avatar-1.svg', category: 'HEROES', tag: 'DC', color: '#1A1A1A' },
  { id: 'steel', name: 'Man of Steel', url: '/avatars/avatar-2.svg', category: 'HEROES', tag: 'DC', color: '#0476F2' },
  { id: 'webslinger', name: 'Web Slinger', url: '/avatars/avatar-3.svg', category: 'HEROES', tag: 'MARVEL', color: '#ED1D24' },
  { id: 'amazon', name: 'Amazon Princess', url: '/avatars/avatar-4.svg', category: 'HEROES', tag: 'DC', color: '#ED1D24' },
  { id: 'armored', name: 'Armored Avenger', url: '/avatars/avatar-5.svg', category: 'HEROES', tag: 'MARVEL', color: '#ED1D24' },
  { id: 'thunder', name: 'Thunder God', url: '/avatars/avatar-6.svg', category: 'HEROES', tag: 'MARVEL', color: '#0476F2' },
  { id: 'berserker', name: 'Berserker Claw', url: '/avatars/avatar-7.svg', category: 'HEROES', tag: 'MARVEL', color: '#FFD700' },
  { id: 'emerald', name: 'Emerald Ring', url: '/avatars/avatar-8.svg', category: 'HEROES', tag: 'DC', color: '#22C55E' },
  { id: 'sorceress', name: 'Chaos Sorceress', url: '/avatars/avatar-9.svg', category: 'HEROES', tag: 'MARVEL', color: '#7B1FA2' },
  { id: 'nemesis', name: 'Mastermind Nemesis', url: '/avatars/avatar-10.svg', category: 'VILLAINS', tag: 'DC', color: '#7B1FA2' },
  { id: 'sentinel', name: 'Cosmic Sentinel', url: '/avatars/avatar-11.svg', category: 'HEROES', tag: 'MARVEL', color: '#0476F2' },
  { id: 'geek', name: 'Retro Comic Geek', url: '/avatars/avatar-12.svg', category: 'RETRO', tag: 'ORIGINAL', color: '#FFD700' },
]

export const DEFAULT_AVATAR = '/avatars/avatar-12.svg'
