"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  generateIncidentResponsePlan,
  GenerateIncidentResponsePlanOutput,
} from "@/ai/flows/generate-incident-response-plan";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, FileText, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  incidentAnalysis: z
    .string()
    .min(20, "Incident analysis must be at least 20 characters."),
});

export default function IncidentResponse() {
  const [result, setResult] =
    useState<GenerateIncidentResponsePlanOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      incidentAnalysis: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const plan = await generateIncidentResponsePlan(values);
      setResult(plan);
      toast({
        title: "Plan Generated",
        description: "An incident response plan has been drafted.",
      });
    } catch (error) {
      console.error("Incident response plan generation error:", error);
      toast({
        title: "Generation Failed",
        description: "Could not generate the plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">
          Automated Incident Response
        </h1>
        <p className="text-muted-foreground">
          Generate a draft incident response plan from an automated analysis.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Plan Generator</CardTitle>
          <CardDescription>
            Provide the automated analysis of a security incident to generate a
            draft response plan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="incidentAnalysis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Incident Analysis</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'Critical vulnerability CVE-2023-12345 exploited on web server, leading to unauthorized root access...'"
                        className="min-h-[200px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Generate Plan
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Draft Incident Response Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Sharing Required
              </h3>
              <Badge variant={result.requiresSharing ? "destructive" : "secondary"}>
                {result.requiresSharing ? "Yes" : "No"}
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">
                AI has determined if this incident requires sharing with other agents.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Generated Plan</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap font-mono p-4 bg-muted rounded-md mt-2">
                {result.incidentResponsePlan}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
