import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
      apiVersion: 'v1', // Force the stable v1 API
      defaultModel: 'gemini-1.5-flash-latest', // Set a global default model
    }),
  ],
  logLevel: 'debug',
  enableTracing: true,
});
