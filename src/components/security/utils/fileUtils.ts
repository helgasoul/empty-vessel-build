
export const isFileNameSafe = (fileName: string): boolean => {
  // Check for dangerous characters and patterns
  const dangerousPatterns = [
    /[<>:"|?*]/,  // Windows forbidden characters
    /\.\./,       // Directory traversal
    /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i, // Windows reserved names
    /^\./,        // Hidden files
    /\s+$/        // Trailing whitespace
  ];
  
  return !dangerousPatterns.some(pattern => pattern.test(fileName));
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  return {
    isImage: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension || ''),
    isPdf: ['pdf'].includes(extension || ''),
    extension
  };
};
