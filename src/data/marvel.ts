export interface Movie {
  id: number
  title: string
  description: string
  date: string
  badge: string
}

export const marvelMovies: Movie[] = [
  {
    id: 1,
    title: 'Movie 1',
    description: 'An epic tale of heroes clashing against an unstoppable cosmic threat. The universe hangs in the balance.',
    date: 'Jan 2024',
    badge: 'Phase 5',
  },
  {
    id: 2,
    title: 'Movie 2',
    description: 'A lone vigilante takes on a sinister criminal empire lurking in the shadows of the city.',
    date: 'Mar 2024',
    badge: 'Phase 5',
  },
  {
    id: 3,
    title: 'Movie 3',
    description: 'Old alliances are tested as a new interdimensional adversary emerges with galaxy-level ambitions.',
    date: 'Jul 2024',
    badge: 'Phase 6',
  },
  {
    id: 4,
    title: 'Movie 4',
    description: 'The most unexpected team-up in history — two rivals join forces to prevent the apocalypse.',
    date: 'Nov 2024',
    badge: 'Phase 6',
  },
  {
    id: 5,
    title: 'Movie 5',
    description: 'A young hero rises from obscurity to claim their rightful place among the greatest defenders.',
    date: 'Feb 2025',
    badge: 'Upcoming',
  },
  {
    id: 6,
    title: 'Movie 6',
    description: 'A rogue scientist opens a portal to chaos — and only one team can shut it down in time.',
    date: 'May 2025',
    badge: 'Upcoming',
  },
]
