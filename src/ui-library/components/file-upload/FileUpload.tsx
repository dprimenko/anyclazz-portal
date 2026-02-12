import { type FC, useRef, useState, useCallback } from 'react';
import { Icon } from '@/ui-library/components/ssr/icon/Icon';
import { cn } from '@/lib/utils';
import styles from './FileUpload.module.css';

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
          styles.fileUpload,
          isDragging && styles.fileUploadDragging,
          disabled && styles.fileUploadDisabled,
          error && styles.fileUploadError
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
        
        <div className={styles.fileUploadContent}>
          <div className={styles.fileUploadIcon}>
            <Icon icon={icon} iconWidth={24} iconHeight={24} />
          </div>
          
          <div className={styles.fileUploadText}>
            <p className={styles.fileUploadLabel}>
              <span className="text-[var(--color-primary-700)]">{label}</span> {description}
            </p>
            {recommendedSize && (
              <p className={styles.fileUploadHint}>{recommendedSize}</p>
            )}
          </div>
        </div>
      </div>
      
      {error && (
        <p className={styles.fileUploadErrorMessage}>{error}</p>
      )}
    </div>
  );
};
