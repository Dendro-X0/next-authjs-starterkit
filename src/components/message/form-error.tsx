import type React from 'react';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

interface FormErrorProps {
  message?: string;
}

export const FormError = ({ message }: FormErrorProps): React.JSX.Element | null => {
  if (!message) return null;

  return (
    <div
      className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <ExclamationTriangleIcon className="h-4 w-4" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
};
