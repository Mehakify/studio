'use server';
/**
 * @fileOverview Provides personalized deduction suggestions based on tax form data.
 *
 * - personalizedDeductionSuggestions - A function that provides personalized deduction suggestions.
 * - PersonalizedDeductionSuggestionsInput - The input type for the personalizedDeductionSuggestions function.
 * - PersonalizedDeductionSuggestionsOutput - The return type for the personalizedDeductionSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedDeductionSuggestionsInputSchema = z.object({
  extractedData: z
    .string()
    .describe(
      'The extracted data from the tax form, as a JSON string.'
    ),
  userInfo: z.string().optional().describe('Optional user information like age, occupation, etc.'),
});

export type PersonalizedDeductionSuggestionsInput = z.infer<
  typeof PersonalizedDeductionSuggestionsInputSchema
>;

const PersonalizedDeductionSuggestionsOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('A list of personalized deduction suggestions.'),
  warnings: z.array(z.string()).optional().describe('A list of potential red flags or inconsistencies.'),
});

export type PersonalizedDeductionSuggestionsOutput = z.infer<
  typeof PersonalizedDeductionSuggestionsOutputSchema
>;

export async function personalizedDeductionSuggestions(
  input: PersonalizedDeductionSuggestionsInput
): Promise<PersonalizedDeductionSuggestionsOutput> {
  return personalizedDeductionSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedDeductionSuggestionsPrompt',
  model: 'googleai/gemini-1.5-flash-latest', // Changed model
  input: {schema: PersonalizedDeductionSuggestionsInputSchema},
  output: {schema: PersonalizedDeductionSuggestionsOutputSchema},
  prompt: `You are a tax advisor. Analyze the following tax form data and user information to suggest potential deductions and credits.

Tax Form Data: {{{extractedData}}}
User Information: {{{userInfo}}}

Provide a list of suggestions and warnings based on the data. If no user info is provided, assume a generic tax payer.

Output in JSON format:
{
  "suggestions": ["..."],
  "warnings": ["..."]
}
`,
});

const personalizedDeductionSuggestionsFlow = ai.defineFlow(
  {
    name: 'personalizedDeductionSuggestionsFlow',
    inputSchema: PersonalizedDeductionSuggestionsInputSchema,
    outputSchema: PersonalizedDeductionSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
