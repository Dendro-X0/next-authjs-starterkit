"use client";

import { useTransition } from "react";
import { FaGithub, FaGoogle } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { socialLogin } from "@/actions/oauth-signin";

export function SocialLogin() {
  const [isPending, startTransition] = useTransition();

  const onClick = (provider: "google" | "github") => {
    startTransition(() => {
      socialLogin(provider);
    });
  };

  return (
    <div className="flex w-full flex-col items-center gap-y-2 my-4">
      <div className="relative w-full">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2">
        <Button
          size="lg"
          className="w-full"
          variant="outline"
          onClick={() => onClick("google")}
          disabled={isPending}
        >
          <FaGoogle className="mr-2 h-5 w-5" />
          Google
        </Button>
        <Button
          size="lg"
          className="w-full"
          variant="outline"
          onClick={() => onClick("github")}
          disabled={isPending}
        >
          <FaGithub className="mr-2 h-5 w-5" />
          GitHub
        </Button>
      </div>
    </div>
  );
}
