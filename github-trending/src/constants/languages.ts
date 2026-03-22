export const LANGUAGES = [
  'All',
  'TypeScript',
  'JavaScript',
  'Python',
  'Go',
  'Rust',
  'Java',
  'C++',
  'C#',
  'Ruby',
  'Swift',
  'Kotlin',
  'PHP',
] as const

export type Language = (typeof LANGUAGES)[number]
