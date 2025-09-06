"use client";

import Link from 'next/link';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}

export const AuthCard = ({ children, headerLabel, backButtonLabel, backButtonHref }: CardWrapperProps) => {
  return (
    <Card className="w-full max-w-md sm:max-w-lg mx-auto shadow-md">
      <CardHeader>
        <div className="w-full flex flex-col gap-y-4 items-center justify-center">
          <h1 className="text-2xl sm:text-3xl font-semibold">Auth</h1>
          <p className="text-muted-foreground text-sm">{headerLabel}</p>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>
        <Link href={backButtonHref} className="w-full">
          <p className="text-center text-sm hover:underline">{backButtonLabel}</p>
        </Link>
      </CardFooter>
    </Card>
  );
};
