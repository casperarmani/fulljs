import React from 'react';

interface UploadProgressProps {
  progress: number;
  isUploading: boolean;
}

export function UploadProgress({ progress, isUploading }: UploadProgressProps) {
  if (!isUploading) return null;

  return (
    <div className="upload-status">
      <div className="progress-container">
        <div className="progress-text">
          Uploading video... {Math.round(progress)}%
        </div>
        <div className="upload-progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}