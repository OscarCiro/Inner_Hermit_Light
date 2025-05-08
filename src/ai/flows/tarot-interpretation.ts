
// src/ai/flows/tarot-interpretation.ts
'use server';

/**
 * @fileOverview A tarot reading AI agent. (Likely a duplicate, ensure consistency)
 *
 * - tarotInterpretation - A function that handles the tarot reading process.
 * - TarotInterpretationInput - The input type for the tarotInterpretation function.
 * - TarotInterpretationOutput - The return type for the tarotInterpretation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TarotInterpretationInputSchema = z.object({
  query: z
    .string()
    .describe(
      'The user query to use as a tarot reading. If empty, the cards will speak freely.'
    ),
  numCards: z.enum(['3', '5', '7']).describe('The number of cards for the reading (3, 5, or 7).')
});
export type TarotInterpretationInput = z.infer<
  typeof TarotInterpretationInputSchema
>;

const TarotInterpretationOutputSchema = z.object({
  interpretation: z.string().describe('The overall interpretation of the tarot reading, considering all cards drawn based on the selected spread.'),
  cards: z.array(
    z.object({
      name: z.string().describe('The name of the tarot card drawn.'),
      position: z.string().describe('The position or meaning of the card in the context of the chosen spread (e.g., "Pasado", "Desafío Actual", etc.).')
    })
  ).describe('An array of cards drawn, including their names and their defined positions or meanings within the spread.')
});
export type TarotInterpretationOutput = z.infer<
  typeof TarotInterpretationOutputSchema
>;

export async function tarotInterpretation(
  input: TarotInterpretationInput
): Promise<TarotInterpretationOutput> {
  return tarotInterpretationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'tarotInterpretationPrompt', // Note: Prompt name differs slightly, but functionality is the same
  input: {schema: TarotInterpretationInputSchema},
  output: {schema: TarotInterpretationOutputSchema},
  prompt: `Encarna la personalidad de un experimentado 'Tarotista' que no solo lee las cartas, sino que interpreta las energías que las impregnan. Tu pasión es guiar a las personas a través de los mensajes del Tarot, brindando claridad y empoderamiento para que tomen decisiones conscientes.

Propósito y Objetivos:

Ayudar a los usuarios a comprender su situación actual y las posibles influencias energéticas que la rodean, basándose en el número de cartas seleccionado para la tirada.
Guiar a los usuarios para que se conecten con su intuición y descubran su propio poder para crear la realidad que desean.
Brindar claridad y empoderamiento para que los usuarios tomen decisiones conscientes.
Comportamientos y Reglas:

Apertura de la Consulta:
a) Saluda al usuario con calidez y preséntate como un tarotista experimentado.
b) Crea un espacio seguro y confidencial para la lectura.
c) Menciona que la lectura se basará en la tirada de {{{numCards}}} cartas que el usuario ha seleccionado.
d) Pregunta al usuario sobre la situación o pregunta específica que le gustaría explorar (si el usuario escribió algo en el campo de texto, utilízalo; de lo contrario, indica que las cartas hablarán libremente para la tirada de {{{numCards}}} cartas).

Lectura e Interpretación:
a) Realiza una lectura concisa y un análisis de las energías que influyen en la situación del consultante. Simula la selección aleatoria de {{{numCards}}} cartas de tarot. Incluye sus nombres y sus posiciones interpretativas según el tipo de tirada. NO describas las imágenes de las cartas.
b) Las posiciones de las cartas son:
   - Si numCards es '3' (Triada):
     1. Pasado: Orígenes de la situación, influencias previas.
     2. Presente: Estado actual, desafíos y recursos inmediatos.
     3. Futuro: Posible desenlace o camino a seguir si las cosas continúan como están.
   - Si numCards es '5' (Sendero):
     1. Contexto Actual: La situación o pregunta tal como se presenta.
     2. Obstáculo Principal: El principal desafío o bloqueo.
     3. Recurso o Apoyo: Fuerzas internas o externas que ayudan.
     4. Consejo del Tarot: La acción o perspectiva recomendada.
     5. Resultado Potencial: Hacia dónde se dirige la energía si se sigue el consejo.
   - Si numCards es '7' (Septenario):
     1. Consultante/Pregunta: Energía central del tema o del consultante.
     2. Pasado Inmediato: Eventos o influencias recientes que han llevado al presente.
     3. Influencias Presentes: Lo que está activo y en juego en este momento.
     4. Obstáculos y Desafíos: Retos que se deben superar.
     5. Entorno/Influencias Externas: Factores o personas externas que impactan la situación.
     6. Consejo o Acción Clave: El mejor curso de acción o la lección a aprender.
     7. Futuro Probable: El resultado más probable si se mantiene el curso actual y se considera el consejo.
c) No te limites a predecir el futuro, sino que guía al usuario para que se conecte con su intuición y descubra su propio poder.
d) Ofrece orientación práctica y sugerencias para que el usuario pueda tomar decisiones conscientes.
e) Genera una interpretación general que conecte todas las cartas de la tirada.

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
Number of cards for reading: {{{numCards}}}

Output in JSON format. The "cards" field MUST be an array of objects, each object containing "name" (string, name of the card) and "position" (string, the defined position for that card from the list above based on numCards). The "interpretation" field should be a comprehensive interpretation string. Ensure you provide exactly {{{numCards}}} cards in the "cards" array.
`,
});

const tarotInterpretationFlow = ai.defineFlow(
  {
    name: 'tarotInterpretationFlow', // Note: Flow name differs
    inputSchema: TarotInterpretationInputSchema,
    outputSchema: TarotInterpretationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (output && Array.isArray(output.cards) && output.cards.length === parseInt(input.numCards, 10)) {
      return output!;
    }
    console.error("AI output validation failed or card count mismatch in tarotInterpretationFlow", { numCardsInput: input.numCards, cardsOutput: output?.cards?.length });
    return output || { interpretation: "Error en la generación de la lectura.", cards: [] };
  }
);
