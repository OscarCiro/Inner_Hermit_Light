import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const geminiPro = googleAI.model('gemini-1.0-pro');

export const ai = genkit({
  plugins: [googleAI({apiKey: process.env.GEMINI_API_KEY})],
  model: geminiPro,
});
