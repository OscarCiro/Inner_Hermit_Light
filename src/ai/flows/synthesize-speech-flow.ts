// src/ai/flows/synthesize-speech-flow.ts
'use server';
/**
 * @fileOverview A Genkit flow for synthesizing speech using Google Cloud Text-to-Speech.
 *
 * - synthesizeSpeech - A function that converts text to speech audio.
 * - SynthesizeSpeechInput - The input type for the synthesizeSpeech function.
 * - SynthesizeSpeechOutput - The return type for the synthesizeSpeech function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {TextToSpeechClient} from '@google-cloud/text-to-speech';

const SynthesizeSpeechInputSchema = z.object({
  textToSynthesize: z.string().describe('The text to be converted to speech.'),
});
export type SynthesizeSpeechInput = z.infer<typeof SynthesizeSpeechInputSchema>;

const SynthesizeSpeechOutputSchema = z.object({
  audioDataUri: z.string().optional().describe('The synthesized audio as a base64 encoded data URI (e.g., "data:audio/mp3;base64,..."). Present if successful.'),
  error: z.string().optional().describe('An error message if synthesis failed.'),
});
export type SynthesizeSpeechOutput = z.infer<typeof SynthesizeSpeechOutputSchema>;

export async function synthesizeSpeech(
  input: SynthesizeSpeechInput
): Promise<SynthesizeSpeechOutput> {
  return synthesizeSpeechFlow(input);
}

const synthesizeSpeechFlow = ai.defineFlow(
  {
    name: 'synthesizeSpeechFlow',
    inputSchema: SynthesizeSpeechInputSchema,
    outputSchema: SynthesizeSpeechOutputSchema,
  },
  async (input: SynthesizeSpeechInput): Promise<SynthesizeSpeechOutput> => {
    try {
      const client = new TextToSpeechClient();
      const request = {
        input: {text: input.textToSynthesize},
        // Using a standard WaveNet voice for Spanish (Spain)
        voice: {languageCode: 'es-ES', name: 'es-ES-Wavenet-D', ssmlGender: 'FEMALE' as const},
        audioConfig: {audioEncoding: 'MP3' as const},
      };

      const [response] = await client.synthesizeSpeech(request);
      
      if (response.audioContent) {
        // Ensure audioContent is treated as Uint8Array if it's not already a Buffer
        const audioBuffer = response.audioContent instanceof Uint8Array ? Buffer.from(response.audioContent) : response.audioContent;
        const audioBase64 = (audioBuffer as Buffer).toString('base64');
        return { audioDataUri: `data:audio/mp3;base64,${audioBase64}` };
      } else {
        return { error: "No audio content received from Google TTS." };
      }
    } catch (err: any) {
      console.error('Error in synthesizeSpeechFlow:', err);
      return { error: err.message || 'Failed to synthesize speech due to an internal error.' };
    }
  }
);
