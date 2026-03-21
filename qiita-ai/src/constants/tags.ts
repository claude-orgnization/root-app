export const AI_TAGS = [
  'AI',
  '機械学習',
  'LLM',
  'ChatGPT',
  'DeepLearning',
  'OpenAI',
  'RAG',
  '生成AI',
  'Claude',
] as const

export type AiTag = (typeof AI_TAGS)[number]

export const DEFAULT_QUERY = AI_TAGS.map((tag) => `tag:${tag}`).join(' OR ')
