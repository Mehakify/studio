// src/ai/flows/tax-form-simplification.ts
'use server';
/**
 * @fileOverview A tax form simplification AI agent.
 *
 * - taxFormSimplification - A function that handles the tax form simplification process.
 * - TaxFormSimplificationInput - The input type for the taxFormSimplification function.
 * - TaxFormSimplificationOutput - The return type for the taxFormSimplification function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TaxFormSimplificationInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a tax form, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type TaxFormSimplificationInput = z.infer<typeof TaxFormSimplificationInputSchema>;

const TaxFormSimplificationOutputSchema = z.object({
  simplifiedExplanation: z.string().describe('A simplified explanation of the tax form.'),
});
export type TaxFormSimplificationOutput = z.infer<typeof TaxFormSimplificationOutputSchema>;

export async function taxFormSimplification(input: TaxFormSimplificationInput): Promise<TaxFormSimplificationOutput> {
  return taxFormSimplificationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'taxFormSimplificationPrompt',
  model: 'googleai/gemini-2.0-flash',
  input: {schema: TaxFormSimplificationInputSchema},
  output: {schema: TaxFormSimplificationOutputSchema},
  prompt: `You are an AI tax assistant that simplifies complex tax forms into plain language.

You will be provided with a photo of a tax form. Extract the text from the tax form and translate complex tax jargon into simple, plain language. Explain the purpose of each field and highlight key information.

Tax Form Photo: {{media url=photoDataUri}}`,
});

const taxFormSimplificationFlow = ai.defineFlow(
  {
    name: 'taxFormSimplificationFlow',
    inputSchema: TaxFormSimplificationInputSchema,
    outputSchema: TaxFormSimplificationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
