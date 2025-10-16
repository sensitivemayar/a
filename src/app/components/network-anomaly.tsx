"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  summarizeNetworkAnomaly,
  SummarizeNetworkAnomalyOutput,
} from "@/ai/flows/summarize-network-anomaly";
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
import { Loader2, Info } from "lucide-react";

const formSchema = z.object({
  anomalyDetails: z
    .string()
    .min(20, "Anomaly details must be at least 20 characters."),
});

export default function NetworkAnomaly() {
  const [result, setResult] = useState<SummarizeNetworkAnomalyOutput | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      anomalyDetails: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const analysis = await summarizeNetworkAnomaly(values);
      setResult(analysis);
      toast({
        title: "Analysis Complete",
        description: "The network anomaly has been summarized.",
      });
    } catch (error) {
      console.error("Network anomaly summarization error:", error);
      toast({
        title: "Analysis Failed",
        description:
          "Could not summarize the network anomaly. Please try again.",
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
          Network Anomaly Detection
        </h1>
        <p className="text-muted-foreground">
          Summarize network anomalies for quick threat assessment.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Anomaly Summarizer</CardTitle>
          <CardDescription>
            Paste detailed logs or descriptions of a network anomaly to get a
            concise summary.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="anomalyDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Anomaly Details</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'Multiple failed login attempts from IP 203.0.113.55 on port 22, followed by a successful login...'"
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
                Summarize Anomaly
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-6 w-6 text-primary" />
              Anomaly Summary
            </CardTitle>
            <CardDescription>
              A concise summary of the anomaly and its potential impact.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap font-mono p-4 bg-muted rounded-md">
              {result.summary}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
