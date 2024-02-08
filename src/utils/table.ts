export const getColumnSizes = (width: number, minWidth?: number, maxWidth?: number) => {
  return {
    width,
    minWidth: minWidth || width,
    maxWidth: maxWidth || width,
  };
};
