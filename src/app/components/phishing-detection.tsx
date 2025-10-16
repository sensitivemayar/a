"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  detectPhishingFromEmail,
  DetectPhishingFromEmailOutput,
} from "@/ai/flows/detect-phishing-from-email";
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
import { Loader2, Shield, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  emailContent: z.string().min(20, "Email content must be at least 20 characters."),
});

export default function PhishingDetection() {
  const [result, setResult] = useState<DetectPhishingFromEmailOutput | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailContent: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const analysis = await detectPhishingFromEmail(values);
      setResult(analysis);
      toast({
        title: "Analysis Complete",
        description: `The email has been analyzed.`,
        variant: analysis.isPhishing ? "destructive" : "default",
      });
    } catch (error) {
      console.error("Phishing detection error:", error);
      toast({
        title: "Analysis Failed",
        description: "Could not analyze the email content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Phishing Detection</h1>
        <p className="text-muted-foreground">
          Analyze email content for potential phishing attempts.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Email Analyzer</CardTitle>
          <CardDescription>
            Paste the full content of an email below to check for phishing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="emailContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste email content here..."
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
                Analyze Email
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <Card
          className={
            result.isPhishing ? "border-destructive" : "border-green-500"
          }
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result.isPhishing ? (
                <Shield className="h-6 w-6 text-destructive" />
              ) : (
                <ShieldCheck className="h-6 w-6 text-green-500" />
              )}
              Analysis Result
            </CardTitle>
            <CardDescription>
              {result.isPhishing
                ? "A phishing attempt was detected."
                : "This email appears to be safe."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">Phishing Detected</h3>
              <Badge variant={result.isPhishing ? "destructive" : "default"}>
                {result.isPhishing ? "Yes" : "No"}
              </Badge>
            </div>
            <div>
              <h3 className="font-semibold">Confidence Score</h3>
              <p>{(result.confidenceScore * 100).toFixed(2)}%</p>
            </div>
            <div>
              <h3 className="font-semibold">Reason</h3>
              <p className="text-sm text-muted-foreground">{result.reason}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
