import { KB, MB } from '@constants';

export const formatFileSize = (size: number) => {
  switch (true) {
    case size > MB:
      return `${(size / MB).toFixed(1)} MB`;
    case size > KB:
      return `${(size / KB).toFixed(1)} KB`;
    default:
      return `${size} B`;
  }
};
