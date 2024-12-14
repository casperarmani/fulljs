export const validateVideoFile = (file: File): boolean => {
  return file.type.startsWith('video/');
};

export const validateConversationTitle = (title: string): boolean => {
  return title.trim().length > 0;
};