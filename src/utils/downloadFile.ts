import { FILE_TYPES } from '@constants/global/fileTypes';

export const downloadFile = (rawData: Blob, fileName: string | null = null, fileType = FILE_TYPES.pdf) => {
  const url = window.URL.createObjectURL(new Blob([rawData], { type: fileType }));
  const link = document.createElement('a');
  fileName && link.setAttribute('data-testid', `file-${fileName}`);
  link.href = url;
  link.target = '_blank';
  fileType !== FILE_TYPES.pdf && fileName && link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  link?.parentNode && link.parentNode.removeChild(link);
};
