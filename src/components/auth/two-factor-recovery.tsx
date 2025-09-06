"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Key } from "lucide-react";

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
import { Alert, AlertDescription } from "@/components/ui/alert";

const recoverySchema = z.object({
  recoveryCode: z
    .string()
    .min(8, { message: "Recovery code must be 8 characters" })
    .max(8, { message: "Recovery code must be 8 characters" }),
});

type RecoveryFormValues = z.infer<typeof recoverySchema>;

export function TwoFactorRecovery() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();


  const form = useForm<RecoveryFormValues>({
    resolver: zodResolver(recoverySchema),
    defaultValues: {
      recoveryCode: "",
    },
  });

  async function onSubmit(data: RecoveryFormValues) {
    setIsLoading(true);

    try {
      // This is where you would verify the recovery code with your backend
      console.log("Recovery code verification:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Recovery successful", {
        description: "You have been logged in successfully.",
      });

      router.push("/");
    } catch (error) {
      console.error("Recovery error:", error);
      toast.error("Recovery failed", {
        description: "Please check your recovery code and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
          <Key className="h-6 w-6 text-orange-600 dark:text-orange-400" />
        </div>
        <CardTitle className="text-2xl">Account Recovery</CardTitle>
        <CardDescription>
          Use one of your backup codes to access your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription>
            Enter one of the 8-character backup codes you saved when setting up
            two-factor authentication.
          </AlertDescription>
        </Alert>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="recoveryCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recovery Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="1a2b3c4d"
                      className="text-center font-mono tracking-widest"
                      maxLength={8}
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
                "Recover Account"
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Remember your authenticator code?{" "}
            <Link
              href="/auth/2fa-verify"
              className="text-primary hover:underline"
            >
              Use authenticator
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
