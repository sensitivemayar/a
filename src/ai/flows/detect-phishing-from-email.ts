'use server';
/**
 * @fileOverview Detects phishing attempts from email content.
 *
 * - detectPhishingFromEmail - A function that analyzes email content for potential phishing attempts.
 * - DetectPhishingFromEmailInput - The input type for the detectPhishingFromEmail function.
 * - DetectPhishingFromEmailOutput - The return type for the detectPhishingFromEmail function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectPhishingFromEmailInputSchema = z.object({
  emailContent: z
    .string()
    .describe('The content of the email to analyze for phishing attempts.'),
});
export type DetectPhishingFromEmailInput = z.infer<typeof DetectPhishingFromEmailInputSchema>;

const DetectPhishingFromEmailOutputSchema = z.object({
  isPhishing: z.boolean().describe('Whether the email is identified as a phishing attempt.'),
  confidenceScore: z
    .number()
    .describe('A score indicating the confidence level of the phishing detection (0-1).'),
  reason: z.string().describe('The reason why the email is classified as phishing.'),
});
export type DetectPhishingFromEmailOutput = z.infer<typeof DetectPhishingFromEmailOutputSchema>;

export async function detectPhishingFromEmail(
  input: DetectPhishingFromEmailInput
): Promise<DetectPhishingFromEmailOutput> {
  return detectPhishingFromEmailFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectPhishingFromEmailPrompt',
  input: {schema: DetectPhishingFromEmailInputSchema},
  output: {schema: DetectPhishingFromEmailOutputSchema},
  prompt: `You are an expert in identifying phishing emails. Analyze the email content provided and determine if it is a phishing attempt.\n\nEmail Content: {{{emailContent}}}\n\nDetermine if the email is a phishing attempt and provide a confidence score (0-1) and a reason for your determination. Ensure that the output is valid JSON.`,
});

const detectPhishingFromEmailFlow = ai.defineFlow(
  {
    name: 'detectPhishingFromEmailFlow',
    inputSchema: DetectPhishingFromEmailInputSchema,
    outputSchema: DetectPhishingFromEmailOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
