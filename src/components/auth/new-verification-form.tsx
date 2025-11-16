"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { newVerification } from "@/actions/new-verification";
import { AuthCard } from "@/components/auth/auth-card";
import { FormSuccess } from "@/components/message/form-success";
import { FormError } from "@/components/message/form-error";

export const NewVerificationForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [error, setError] = useState<string | undefined>(() => {
    if (!token) return "Missing token!";
    return undefined;
  });
  const [success, setSuccess] = useState<string | undefined>();

  useEffect(() => {
    if (!token || success || error) {
      return;
    }

    let cancelled = false;

    newVerification(token)
      .then((data) => {
        if (cancelled) return;
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => {
        if (cancelled) return;
        setError("Something went wrong!");
      });

    return () => {
      cancelled = true;
    };
  }, [token, success, error]);

  return (
    <AuthCard
      headerLabel="Confirming your verification"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <div className="flex items-center w-full justify-center">
        {!success && !error && <p>Loading...</p>}
        <FormSuccess message={success} />
        {!success && <FormError message={error} />}
      </div>
    </AuthCard>
  );
};
