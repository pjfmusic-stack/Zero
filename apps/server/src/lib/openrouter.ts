import { createOpenAI } from '@ai-sdk/openai';
import { env } from 'cloudflare:workers';

export const openai = createOpenAI({
  apiKey: env.OPENAI_API_KEY,
  baseURL: env.OPENAI_BASE_URL || 'https://api.deepseek.com/v1',
  compatibility: 'compatible',
});

export const chatModel = () => openai.chat(env.OPENAI_MODEL || 'deepseek-chat');
export const miniModel = () => openai.chat(env.OPENAI_MINI_MODEL || 'deepseek-chat');
