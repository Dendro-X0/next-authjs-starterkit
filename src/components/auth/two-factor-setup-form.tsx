"use client";

import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import { toast } from "sonner";

import { TwoFactorVerificationSchema } from "@/schemas";
import { generateTwoFactorSecret, verifyTwoFactorCode } from "@/actions/2fa";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormError } from "@/components/message/form-error";
import { FormSuccess } from "@/components/message/form-success";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export function TwoFactorSetupForm() {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isGenerating, startGenerationTransition] = useTransition();
  const [isVerifying, startVerificationTransition] = useTransition();

  useEffect(() => {
    startGenerationTransition(() => {
      generateTwoFactorSecret()
        .then((data) => {
          if (data.success && data.qrCode && data.secret) {
            setQrCode(data.qrCode);
            setSecret(data.secret);
            toast.success("QR Code Generated", { description: "Scan the QR code with your authenticator app." });
          } else {
            setError(data.error || "Failed to generate QR code.");
          }
        })
        .catch(() => {
          setError("An unexpected error occurred.");
        });
    });
  }, []);

  const form = useForm<z.infer<typeof TwoFactorVerificationSchema>>({
    resolver: zodResolver(TwoFactorVerificationSchema),
    defaultValues: { code: "" },
  });

  const onSubmit = (values: z.infer<typeof TwoFactorVerificationSchema>) => {
    setError("");
    setSuccess("");

    startVerificationTransition(() => {
      verifyTwoFactorCode(values)
        .then((data) => {
          if (data.success) {
            setSuccess(data.success);
            toast.success("2FA Enabled!", { description: "Two-factor authentication has been successfully enabled." });
          } else {
            setError(data.error);
          }
        })
        .catch(() => {
          setError("Something went wrong during verification.");
        });
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Two-Factor Authentication (2FA)</CardTitle>
        <CardDescription>Scan the QR code with your authenticator app and enter the code below.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isGenerating ? (
          <div className="flex flex-col items-center space-y-4">
            <Skeleton className="h-48 w-48" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : qrCode && secret ? (
          <div className="flex flex-col items-center space-y-4">
            <p className="text-sm text-center text-muted-foreground">Scan this QR code with your authenticator app (e.g., Google Authenticator, Authy).</p>
            <Image src={qrCode} alt="2FA QR Code" width={192} height={192} />
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Or enter this secret key manually:</p>
              <p className="font-mono text-sm bg-muted p-2 rounded-md break-all max-w-full inline-block select-all">{secret}</p>
            </div>
          </div>
        ) : null}
        
        <Separator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="123456" disabled={isVerifying || !!success} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button type="submit" disabled={isVerifying || !!success} className="w-full">
              {isVerifying ? "Verifying..." : "Verify & Enable 2FA"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
