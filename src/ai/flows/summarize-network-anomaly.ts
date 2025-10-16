'use server';

/**
 * @fileOverview Summarizes detected network anomalies for quick understanding of potential threats.
 *
 * - summarizeNetworkAnomaly - A function that summarizes network anomaly details.
 * - SummarizeNetworkAnomalyInput - The input type for the summarizeNetworkAnomaly function.
 * - SummarizeNetworkAnomalyOutput - The return type for the summarizeNetworkAnomaly function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeNetworkAnomalyInputSchema = z.object({
  anomalyDetails: z
    .string()
    .describe('Detailed description of the network anomaly detected.'),
});
export type SummarizeNetworkAnomalyInput = z.infer<typeof SummarizeNetworkAnomalyInputSchema>;

const SummarizeNetworkAnomalyOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise summary of the network anomaly and its potential impact.'),
});
export type SummarizeNetworkAnomalyOutput = z.infer<typeof SummarizeNetworkAnomalyOutputSchema>;

export async function summarizeNetworkAnomaly(
  input: SummarizeNetworkAnomalyInput
): Promise<SummarizeNetworkAnomalyOutput> {
  return summarizeNetworkAnomalyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeNetworkAnomalyPrompt',
  input: {schema: SummarizeNetworkAnomalyInputSchema},
  output: {schema: SummarizeNetworkAnomalyOutputSchema},
  prompt: `You are a cybersecurity expert. Please summarize the following network anomaly details to help a security analyst quickly understand the potential threat:\n\nAnomaly Details: {{{anomalyDetails}}}`,
});

const summarizeNetworkAnomalyFlow = ai.defineFlow(
  {
    name: 'summarizeNetworkAnomalyFlow',
    inputSchema: SummarizeNetworkAnomalyInputSchema,
    outputSchema: SummarizeNetworkAnomalyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
