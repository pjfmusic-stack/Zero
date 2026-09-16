import { createOpenAI } from '@ai-sdk/openai';

/**
 * Shared AI provider wired to OpenRouter.
 *
 * OpenRouter exposes an OpenAI-compatible API, so we drive it through the
 * @ai-sdk/openai provider with baseURL pointed at OpenRouter and the
 * OpenRouter key used in place of an OpenAI key. The model id is passed by
 * each call site (e.g. "google/gemini-3.5-flash", "deepseek/deepseek-v4-pro").
 *
 * NOTE: @ai-sdk/openai does NOT auto-read OPENAI_BASE_URL from env, so the
 * baseURL MUST be set explicitly here (a plain `import { openai }` would
 * still target api.openai.com).
 */

const baseURL = process.env.OPENAI_BASE_URL || 'https://openrouter.ai/api/v1';
const apiKey = process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY || '';

export const openai = createOpenAI({
  apiKey,
  baseURL,
});
