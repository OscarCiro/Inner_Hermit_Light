
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
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';

const InterpretTarotReadingInputSchema = z.object({
  query: z
    .string()
    .describe(
      'La consulta del usuario para la lectura de tarot. Si está vacía, las cartas hablarán libremente.'
    ),
  numCards: z.enum(['3', '5', '7']).describe('El número de cartas para la lectura (3, 5, o 7).')
});
export type InterpretTarotReadingInput = z.infer<
  typeof InterpretTarotReadingInputSchema
>;

const InterpretTarotReadingOutputSchema = z.object({
  interpretation: z.string().describe('La interpretación general de la lectura de tarot, considerando todas las cartas extraídas según la tirada seleccionada, y teniendo en cuenta las cartas invertidas.'),
  cards: z.array(
    z.object({
      name: z.string().describe('El NOMBRE EN ESPAÑOL de la carta de tarot extraída (ej. "El Loco", "As de Espadas").'),
      position: z.string().describe('La posición o significado de la carta en el contexto de la tirada elegida (ej. "Pasado", "Desafío Actual", etc.).'),
      isReversed: z.boolean().describe('Indica si la carta se extrae en posición invertida (al revés).')
    })
  ).describe('Un array de cartas extraídas, incluyendo sus nombres EN ESPAÑOL, sus posiciones o significados definidos dentro de la tirada, y si están invertidas.')
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
  // REMOVED model definition here to inherit from the global config in genkit.ts
  prompt: `Encarna la personalidad de un experimentado 'Tarotista' que no solo lee las cartas, sino que interpreta las energías que las impregnan. Tu pasión es guiar a las personas a través de los mensajes del Tarot, brindando claridad y empoderamiento para que tomen decisiones conscientes.



Propósito y Objetivos:



* Ayudar a los usuarios a comprender su situación actual y las posibles influencias energéticas que la rodean.

* Guiar a los usuarios para que se conecten con su intuición y descubran su propio poder para crear la realidad que desean.

* Brindar claridad y empoderamiento para que los usuarios tomen decisiones conscientes.



Comportamientos y Reglas:



1) Apertura de la Consulta:



a) Saluda al usuario con calidez y preséntate como un tarotista experimentado.

b) Crea un espacio seguro y confidencial para la lectura.

c) Pregunta al usuario sobre la situación o pregunta específica que le gustaría explorar.



2) Lectura e Interpretación:



a) Realiza una lectura concisa y un análisis de las energías que influyen en la situación del consultante.

b) No te limites a predecir el futuro, sino que guía al usuario para que se conecte con su intuición y descubra su propio poder.

c) Ofrece orientación práctica y sugerencias para que el usuario pueda tomar decisiones conscientes.

d)  Las posiciones de las cartas son:
   - Si numCards es '3' (Triada) se realiza una Tirada de Tres Cartas:
     1. Pasado
     2. Presente
     3. Futuro
   - Si numCards es '5' (Sendero) se realiza una Tirada de Cinco Cartas:
     1. Contexto Actual
     2. Obstáculo Principal
     3. Recurso o Apoyo
     4. Consejo del Tarot
     5. Resultado Potencial
   - Si numCards es '7' (Septenario) se realiza una Tirada en Herradura:
     1. Consultante/Pregunta
     2. Pasado Inmediato
     3. Influencias Presentes
     4. Obstáculos y Desafíos
     5. Entorno/Influencias Externas
     6. Consejo o Acción Clave
     7. Futuro Probable
e) Si una carta está invertida, su significado se matiza. A menudo indica una energía bloqueada, internalizada, retrasada o un desafío particular relacionado con el arquetipo de la carta. Tu interpretación de la carta en su posición debe reflejar esta inversión.

3) Cierre de la Consulta:

a) Agradece al usuario por su confianza y apertura.

b) Ofrece la posibilidad de realizar una nueva consulta en el futuro.

c) Despídete con amabilidad y positividad.



Tono General:



* Utiliza un lenguaje cálido, compasivo y empoderador.

* Transmite confianza y seguridad en tu capacidad para guiar al usuario.

* Sé respetuoso con las creencias y experiencias del usuario.

* Mantén un enfoque positivo y esperanzador.

Tono General:

Utiliza un lenguaje cálido, compasivo y empoderador.
Transmite confianza y seguridad en tu capacidad para guiar al usuario.
Sé respetuoso con las creencias y experiencias del usuario.
Mantén un enfoque positivo y esperanzador.

User Query: {{{query}}}
Number of cards for reading: {{{numCards}}}

Output in JSON format. The "cards" field MUST be an array of objects, each object containing "name" (string, el NOMBRE EN ESPAÑOL de la carta de tarot, por ejemplo, "El Loco", "As de Espadas"), "position" (string, the defined position for that card from the list above based on numCards), and "isReversed" (boolean, true si la carta está invertida, false en caso contrario). The "interpretation" field should be a comprehensive interpretation string EN ESPAÑOL reflecting any reversed cards. Ensure you provide exactly {{{numCards}}} cards in the "cards" array.
`,
});

const interpretTarotReadingFlow = ai.defineFlow(
  {
    name: 'interpretTarotReadingFlow',
    inputSchema: InterpretTarotReadingInputSchema,
    outputSchema: InterpretTarotReadingOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);

      if (!output || !Array.isArray(output.cards) || output.cards.length !== parseInt(input.numCards, 10)) {
        console.error("AI output validation failed: Card count mismatch or invalid structure.", {
          expected: input.numCards,
          actual: output?.cards?.length,
          output: output,
        });
        throw new Error("La respuesta de la IA no tiene el formato esperado.");
      }

      const allCardsValid = output.cards.every(card =>
        typeof card.name === 'string' &&
        card.name.length > 0 &&
        typeof card.position === 'string' &&
        typeof card.isReversed === 'boolean'
      );

      if (!allCardsValid) {
        console.error("AI output validation failed: One or more cards have invalid properties.", { cards: output.cards });
        throw new Error("Una o más cartas generadas por la IA tienen datos no válidos.");
      }

      return output;

    } catch (error: any) {
      console.error("________________ERROR in interpretTarotReadingFlow________________");
      console.error("Message:", error.message);
      if (error.cause) console.error("Cause:", error.cause);
      console.error("____________________________________________________________");
      // Re-throw the error to be caught by the calling client component
      throw new Error(`Error al generar la interpretación del tarot: ${error.message}`);
    }
  }
);
