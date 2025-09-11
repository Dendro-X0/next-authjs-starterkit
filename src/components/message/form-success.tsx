import type React from 'react';
import { CheckCircledIcon } from '@radix-ui/react-icons';

interface FormSuccessProps {
  message?: string;
}

export const FormSuccess = ({ message }: FormSuccessProps): React.JSX.Element | null => {
  if (!message) return null;

  return (
    <div
      className="bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <CheckCircledIcon className="h-4 w-4" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
};
