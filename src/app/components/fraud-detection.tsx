"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  detectFraudulentTransaction,
  DetectFraudulentTransactionOutput,
} from "@/ai/flows/detect-fraudulent-transactions";
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
import { Loader2, AlertTriangle, Share2, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  transactionDetails: z
    .string()
    .min(20, "Transaction details must be at least 20 characters."),
  userProfile: z
    .string()
    .min(20, "User profile must be at least 20 characters."),
});

export default function FraudDetection() {
  const [result, setResult] =
    useState<DetectFraudulentTransactionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transactionDetails: "",
      userProfile: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const analysis = await detectFraudulentTransaction(values);
      setResult(analysis);
      toast({
        title: "Analysis Complete",
        description: `Fraud status: ${
          analysis.isFraudulent ? "Detected" : "Not Detected"
        }`,
        variant: analysis.isFraudulent ? "destructive" : "default",
      });
    } catch (error) {
      console.error("Fraud detection error:", error);
      toast({
        title: "Analysis Failed",
        description: "Could not analyze the transaction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Fraud Detection</h1>
        <p className="text-muted-foreground">
          Analyze transactions for abnormal behaviors to prevent fraud.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Analyzer</CardTitle>
          <CardDescription>
            Provide transaction details and user profile for fraud analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="transactionDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction Details</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., '{ amount: 5000, currency: 'USD', sender: 'userA', receiver: 'userB', timestamp: '...' }'"
                        className="min-h-[150px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="userProfile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Profile</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., '{ userId: 'userA', location: 'US', transactionHistory: [...] }'"
                        className="min-h-[150px] resize-y"
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
                Analyze Transaction
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <Card
          className={
            result.isFraudulent ? "border-destructive" : "border-green-500"
          }
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result.isFraudulent ? (
                <AlertTriangle className="h-6 w-6 text-destructive" />
              ) : (
                <ShieldCheck className="h-6 w-6 text-green-500" />
              )}
              Analysis Result
            </CardTitle>
            <CardDescription>
              {result.isFraudulent
                ? "This transaction is likely fraudulent."
                : "This transaction appears to be legitimate."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">Is Fraudulent</h3>
              <Badge variant={result.isFraudulent ? "destructive" : "default"}>
                {result.isFraudulent ? "Yes" : "No"}
              </Badge>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Sharing Required
              </h3>
              <Badge variant={result.requiresSharing ? "destructive" : "secondary"}>
                {result.requiresSharing ? "Yes" : "No"}
              </Badge>
              <p className="text-xs text-muted-foreground">
                AI has determined if this incident requires sharing with other agents.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Explanation</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap font-mono p-4 bg-muted rounded-md mt-2">
                {result.fraudExplanation}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
