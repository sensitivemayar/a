'use server';

/**
 * @fileOverview Generates a draft incident response plan based on the automated analysis of a security incident.
 *
 * - generateIncidentResponsePlan - A function that generates a draft incident response plan.
 * - GenerateIncidentResponsePlanInput - The input type for the generateIncidentResponsePlan function.
 * - GenerateIncidentResponsePlanOutput - The return type for the generateIncidentResponsePlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateIncidentResponsePlanInputSchema = z.object({
  incidentAnalysis: z
    .string()
    .describe('The automated analysis of the security incident.'),
});
export type GenerateIncidentResponsePlanInput = z.infer<
  typeof GenerateIncidentResponsePlanInputSchema
>;

const GenerateIncidentResponsePlanOutputSchema = z.object({
  incidentResponsePlan: z
    .string()
    .describe('The draft incident response plan.'),
  requiresSharing: z
    .boolean()
    .describe(
      'Whether the incident response plan requires sharing with other security agents.'
    ),
});
export type GenerateIncidentResponsePlanOutput = z.infer<
  typeof GenerateIncidentResponsePlanOutputSchema
>;

const shouldShareTool = ai.defineTool({
  name: 'shouldShare',
  description: 'Determines if the current incident response plan requires sharing with other security agents.',
  inputSchema: z.object({
    incidentAnalysis: z.string().describe('The analysis of the security incident.'),
    incidentResponsePlan: z.string().describe('The generated incident response plan.'),
  }),
  outputSchema: z.boolean().describe('Whether the incident requires sharing or not'),
}, async (input) => {
  // Implement the logic to determine if sharing is required based on the incident analysis and response plan.
  // For example, check if the incident involves multiple systems, critical data, or external threats.
  return input.incidentAnalysis.includes('critical') || input.incidentAnalysis.includes('external threat');
});

export async function generateIncidentResponsePlan(
  input: GenerateIncidentResponsePlanInput
): Promise<GenerateIncidentResponsePlanOutput> {
  return generateIncidentResponsePlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateIncidentResponsePlanPrompt',
  input: {schema: GenerateIncidentResponsePlanInputSchema},
  output: {schema: GenerateIncidentResponsePlanOutputSchema},
  tools: [shouldShareTool],
  prompt: `You are a security expert. Generate a draft incident response plan based on the automated analysis of a security incident.  

Incident Analysis: {{{incidentAnalysis}}}

Based on the provided incident analysis, generate a draft incident response plan. Use shouldShare tool to determine whether the plan needs to be shared with other security agents.
`,
});

const generateIncidentResponsePlanFlow = ai.defineFlow(
  {
    name: 'generateIncidentResponsePlanFlow',
    inputSchema: GenerateIncidentResponsePlanInputSchema,
    outputSchema: GenerateIncidentResponsePlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
