export const DEV_MODE = process.env.DEV_MODE === "true";

export const KEYS = {
  OPENAI: process.env.OPENAI_KEY_PROD,
  OPENAI_DEV: process.env.OPENAI_KEY_DEV,
  STRIPE: process.env.STRIPE_SECRET,
  GEMINI: process.env.GEMINI_KEY_PROD
};
