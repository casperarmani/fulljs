import React from 'react';
import { formatBytes } from '@/utils/formatters';

interface FileUploadPreviewProps {
  files: Set<File>;
  onRemove: (file: File) => void;
  className?: string;
}

export function FileUploadPreview({ files, onRemove, className }: FileUploadPreviewProps) {
  if (files.size === 0) return null;

  return (
    <div className={`upload-preview ${className || ''}`}>
      {Array.from(files).map((file, index) => (
        <div key={`${file.name}-${index}`} className="file-item">
          <span className="file-name">
            {file.name}
            <span className="file-size">({formatBytes(file.size)})</span>
          </span>
          <button
            type="button"
            className="remove-file"
            onClick={() => onRemove(file)}
            aria-label="Remove file"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}