"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const twoFactorVerifySchema = z.object({
  code: z
    .string()
    .min(6, { message: "Code must be 6 digits" })
    .max(6, { message: "Code must be 6 digits" }),
});

type TwoFactorVerifyFormValues = z.infer<typeof twoFactorVerifySchema>;

export function TwoFactorVerify() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();


  const form = useForm<TwoFactorVerifyFormValues>({
    resolver: zodResolver(twoFactorVerifySchema),
    defaultValues: {
      code: "",
    },
  });

  async function onSubmit(data: TwoFactorVerifyFormValues) {
    setIsLoading(true);

    try {
      // This is where you would verify the 2FA code with your backend
      console.log("2FA verification:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Verification successful", {
        description: "You have been logged in successfully.",
      });

      router.push("/");
    } catch (error) {
      console.error("2FA verification error:", error);
      toast.error("Verification failed", {
        description: "Please check your code and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
          <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <CardTitle className="text-2xl">Two-Factor Authentication</CardTitle>
        <CardDescription>
          Enter the 6-digit code from your authenticator app
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Authentication Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="123456"
                      className="text-center text-lg tracking-widest"
                      maxLength={6}
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify"
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Can&apos;t access your authenticator?{" "}
            <Link
              href="/auth/2fa-recovery"
              className="text-primary hover:underline"
            >
              Use backup code
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
