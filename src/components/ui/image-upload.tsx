"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { UserCircle } from 'lucide-react';

interface ImageUploadProps {
  imageUrl?: string | null;
  name?: string | null;
  onUploadComplete?: () => Promise<void>;
  onChange?: (file: File) => void;
  disabled?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  imageUrl,
  onChange,
  disabled,
  name,
}) => {
  const [preview, setPreview] = useState<string | null>(imageUrl || null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      if (onChange) {
        onChange(file);
      }
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        type="file"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
        accept="image/*"
        disabled={disabled}
      />
      <div
        className="relative w-40 h-40 rounded-full overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={preview ? 'Change avatar' : 'Upload avatar'}
        aria-disabled={disabled}
      >
        {preview ? (
          <Image
            src={preview}
            alt={name || 'Avatar Preview'}
            fill
            className="object-cover"
          />
        ) : (
          <UserCircle className="w-24 h-24 text-gray-400" />
        )}
      </div>
      <Button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        variant="outline"
      >
        Upload Avatar
      </Button>
    </div>
  );
};
