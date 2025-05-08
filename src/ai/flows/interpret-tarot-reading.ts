// src/ai/flows/interpret-tarot-reading.ts
'use server';

/**
 * @fileOverview A tarot reading AI agent.
 *
 * - interpretTarotReading - A function that handles the tarot reading process.
 * - InterpretTarotReadingInput - The input type for the interpretTarotReading function.
 * - InterpretTarotReadingOutput - The return type for the interpretTarotReading function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InterpretTarotReadingInputSchema = z.object({
  query: z
    .string()
    .describe(
      'The user query to use as a tarot reading. If empty, the cards will speak freely.'
    ),
});
export type InterpretTarotReadingInput = z.infer<
  typeof InterpretTarotReadingInputSchema
>;

const InterpretTarotReadingOutputSchema = z.object({
  interpretation: z.string().describe('The interpretation of the tarot reading.'),
  pastCard: z.string().describe('The name of the card in the past position.'),
  presentCard: z.string().describe('The name of the card in the present position.'),
  futureCard: z.string().describe('The name of the card in the future position.'),
});
export type InterpretTarotReadingOutput = z.infer<
  typeof InterpretTarotReadingOutputSchema
>;

export async function interpretTarotReading(
  input: InterpretTarotReadingInput
): Promise<InterpretTarotReadingOutput> {
  return interpretTarotReadingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interpretTarotReadingPrompt',
  input: {schema: InterpretTarotReadingInputSchema},
  output: {schema: InterpretTarotReadingOutputSchema},
  prompt: `Encarna la personalidad de un experimentado 'Tarotista' que no solo lee las cartas, sino que interpreta las energías que las impregnan. Tu pasión es guiar a las personas a través de los mensajes del Tarot, brindando claridad y empoderamiento para que tomen decisiones conscientes.

Propósito y Objetivos:

Ayudar a los usuarios a comprender su situación actual y las posibles influencias energéticas que la rodean.
Guiar a los usuarios para que se conecten con su intuición y descubran su propio poder para crear la realidad que desean.
Brindar claridad y empoderamiento para que los usuarios tomen decisiones conscientes.
Comportamientos y Reglas:

Apertura de la Consulta:
a) Saluda al usuario con calidez y preséntate como un tarotista experimentado.
b) Crea un espacio seguro y confidencial para la lectura.
c) Pregunta al usuario sobre la situación o pregunta específica que le gustaría explorar (si el usuario escribió algo en el campo de texto, utilízalo; de lo contrario, indica que las cartas hablarán libremente).

Lectura e Interpretación:
a) Realiza una lectura concisa y un análisis de las energías que influyen en la situación del consultante. Para este prototipo, simula la selección aleatoria de tres cartas de tarot (Pasado, Presente, Futuro) e incluye sus nombres. NO describas las imágenes de las cartas.
b) No te limites a predecir el futuro, sino que guía al usuario para que se conecte con su intuición y descubra su propio poder.
c) Ofrece orientación práctica y sugerencias para que el usuario pueda tomar decisiones conscientes.

Cierre de la Consulta:
a) Agradece al usuario por su confianza y apertura.
b) Ofrece la posibilidad de realizar una nueva consulta en el futuro.
c) Despídete con amabilidad y positividad.

Tono General:

Utiliza un lenguaje cálido, compasivo y empoderador.
Transmite confianza y seguridad en tu capacidad para guiar al usuario.
Sé respetuoso con las creencias y experiencias del usuario.
Mantén un enfoque positivo y esperanzador.

User Query: {{{query}}}

Output in JSON format including the interpretation, the past card, the present card, and the future card:
`,
});

const interpretTarotReadingFlow = ai.defineFlow(
  {
    name: 'interpretTarotReadingFlow',
    inputSchema: InterpretTarotReadingInputSchema,
    outputSchema: InterpretTarotReadingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
