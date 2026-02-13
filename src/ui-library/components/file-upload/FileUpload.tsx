import { type FC, useRef, useState, useCallback } from 'react';
import { Icon } from '@/ui-library/components/ssr/icon/Icon';
import { cn } from '@/lib/utils';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { IconButton } from '@/ui-library/shared';

export interface FileUploadProps {
  accept?: string;
  maxSize?: number; // in bytes
  recommendedSize?: string;
  onFileSelect: (file: File) => void;
  label?: string;
  description?: string;
  icon?: string;
  className?: string;
  disabled?: boolean;
}

export const FileUpload: FC<FileUploadProps> = ({
  accept = '*',
  maxSize,
  recommendedSize,
  onFileSelect,
  label = 'Click to upload',
  description = 'or drag and drop',
  icon = 'upload-cloud',
  className,
  disabled = false
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback((file: File) => {
    setError(null);

    if (maxSize && file.size > maxSize) {
      setError(`File size exceeds ${(maxSize / 1024 / 1024).toFixed(0)}MB`);
      return;
    }

    onFileSelect(file);
  }, [maxSize, onFileSelect]);

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <div className={className}>
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "flex items-center justify-center min-h-[160px] p-6 border-1 rounded-xl cursor-pointer transition-all duration-200",
          "border-[#D5D7DA] bg-[#FFFDFB]",
          !disabled && "hover:border-primary-500 hover:bg-primary-50",
          isDragging && "border-[#F4A43A] bg-primary-100",
          disabled && "opacity-50 cursor-not-allowed",
          error && "border-destructive bg-red-50/50"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
        />
        
        <div className="flex flex-col items-center gap-3 text-center">
          <IconButton icon="upload-cloud-02" />
          
          <div className="flex flex-col gap-1">
            <div>
              <Text textLevel="span" colorType='accent' weight='semibold' size='text-sm'>{label}</Text> <Text textLevel="span" colorType='tertiary' size='text-sm'>{description}</Text>
            </div>
            {recommendedSize && (
              <Text textLevel="span" colorType='tertiary' size='text-xs'>{recommendedSize}</Text>
            )}
          </div>
        </div>
      </div>
      
      {error && (
        <p className="mt-2 text-xs text-destructive font-medium">{error}</p>
      )}
    </div>
  );
};
