import { useState } from 'react';

interface VideoValidation {
  duration: number;
  isValid: boolean;
  error?: string;
}

export function useVideoUpload() {
  const [selectedFiles, setSelectedFiles] = useState<Set<File>>(new Set());
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateVideo = async (file: File): Promise<VideoValidation> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve({
          duration: video.duration,
          isValid: true
        });
      };

      video.onerror = () => {
        window.URL.revokeObjectURL(video.src);
        reject(new Error('Error loading video metadata'));
      };

      video.src = URL.createObjectURL(file);
    });
  };

  const addFiles = async (files: FileList) => {
    const newFiles = Array.from(files);
    setError(null);

    for (const file of newFiles) {
      if (!file.type.startsWith('video/')) {
        setError('Only video files are supported');
        continue;
      }

      try {
        const validation = await validateVideo(file);
        if (validation.isValid) {
          setSelectedFiles(prev => new Set([...prev, file]));
        }
      } catch (error) {
        setError('Error validating video: ' + error.message);
      }
    }
  };

  const removeFile = (file: File) => {
    setSelectedFiles(prev => {
      const newFiles = new Set(prev);
      newFiles.delete(file);
      return newFiles;
    });
  };

  const clearFiles = () => {
    setSelectedFiles(new Set());
    setUploadProgress(0);
    setError(null);
  };

  return {
    selectedFiles,
    uploadProgress,
    isUploading,
    error,
    addFiles,
    removeFile,
    clearFiles,
    validateVideo
  };
}