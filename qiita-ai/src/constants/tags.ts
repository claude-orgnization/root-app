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

// Mapping from Qiita tag names to Zenn topic slugs
export const ZENN_TOPIC_MAP: Record<string, string> = {
  'AI': 'ai',
  '機械学習': 'machinelearning',
  'LLM': 'llm',
  'ChatGPT': 'chatgpt',
  'DeepLearning': 'deeplearning',
  'OpenAI': 'openai',
  'RAG': 'rag',
  '生成AI': 'generativeai',
  'Claude': 'claude',
}

// Default Zenn topics to fetch when no tags are selected
export const DEFAULT_ZENN_TOPICS = ['llm', 'ai', 'chatgpt', 'generativeai', 'rag']
