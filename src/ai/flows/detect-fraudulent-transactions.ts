'use server';

/**
 * @fileOverview Fraud Detection Agent analyses transactions for abnormal behaviors to prevent fraud.
 *
 * - detectFraudulentTransaction - Function to analyze transactions and identify abnormal behaviors.
 * - DetectFraudulentTransactionInput - Input type for the detectFraudulentTransaction function.
 * - DetectFraudulentTransactionOutput - Return type for the detectFraudulentTransaction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectFraudulentTransactionInputSchema = z.object({
  transactionDetails: z.string().describe('Details of the transaction including amount, sender, receiver, timestamp.'),
  userProfile: z.string().describe('User profile information including past transaction history, location, and personal details.'),
});
export type DetectFraudulentTransactionInput = z.infer<typeof DetectFraudulentTransactionInputSchema>;

const DetectFraudulentTransactionOutputSchema = z.object({
  isFraudulent: z.boolean().describe('Whether the transaction is likely to be fraudulent.'),
  fraudExplanation: z.string().describe('Explanation of why the transaction is considered fraudulent.'),
  requiresSharing: z.boolean().describe('Whether the output needs to be shared with other security agents.'),
});
export type DetectFraudulentTransactionOutput = z.infer<typeof DetectFraudulentTransactionOutputSchema>;

export async function detectFraudulentTransaction(input: DetectFraudulentTransactionInput): Promise<DetectFraudulentTransactionOutput> {
  return detectFraudulentTransactionFlow(input);
}

const shouldShareInfo = ai.defineTool({
  name: 'shouldShareInfo',
  description: 'Determines whether the current fraud detection result needs to be shared with other security agents based on the severity and potential impact.',
  inputSchema: z.object({
    isFraudulent: z.boolean().describe('Indicates whether the transaction is fraudulent.'),
    fraudExplanation: z.string().describe('Explanation of why the transaction is considered fraudulent.'),
  }),
  outputSchema: z.boolean().describe('A boolean value indicating whether the fraud information needs to be shared.'),
},
async (input) => {
  // Basic logic to determine if sharing is required; can be expanded based on specific requirements
  return input.isFraudulent;
});

const detectFraudulentTransactionPrompt = ai.definePrompt({
  name: 'detectFraudulentTransactionPrompt',
  input: {schema: DetectFraudulentTransactionInputSchema},
  output: {schema: DetectFraudulentTransactionOutputSchema},
  tools: [shouldShareInfo],
  prompt: `You are a fraud detection expert analyzing financial transactions to identify potentially fraudulent activities.

  Analyze the provided transaction details and user profile to determine if the transaction is fraudulent. Provide a clear explanation of your reasoning.

  Transaction Details: {{{transactionDetails}}}
  User Profile: {{{userProfile}}}

  Based on your analysis, determine whether the transaction is fraudulent and explain why.  Use the shouldShareInfo tool to decide if the output requires sharing. If the transaction is highly suspicious or confirmed as fraudulent, set requiresSharing to true.

  Output your findings in the following JSON format:
  {
    "isFraudulent": boolean,
    "fraudExplanation": string,
    "requiresSharing": boolean
  }`,
});

const detectFraudulentTransactionFlow = ai.defineFlow(
  {
    name: 'detectFraudulentTransactionFlow',
    inputSchema: DetectFraudulentTransactionInputSchema,
    outputSchema: DetectFraudulentTransactionOutputSchema,
  },
  async input => {
    const {output} = await detectFraudulentTransactionPrompt(input);
    return output!;
  }
);
