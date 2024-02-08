import type { Theme } from '@mui/material/styles';
import type { SxProps } from '@mui/system';

/**
 * Maybe Type. Set this on optional props.
 * Adds `null` as possible value to better support data from backend.
 */
export type Maybe<T> = T | null;

/**
 * Add MUI `sx` prop.
 * The `sx` prop is a shortcut for defining custom style that has access to the theme.
 *
 * Note: You cannot spread `sx` directly because `SxProps` (typeof sx) can be an array.
 *
 * @usage `<Box sx={[ { ...componentStyles }, ...(Array.isArray(sx) ? sx : [sx])] } />`
 * @see https://mui.com/system/the-sx-prop/
 */
export type WithSx<P = {}> = P & {
  /**
   *  MUI `sx` prop
   *  https://mui.com/system/the-sx-prop/
   */
  sx?: SxProps<Theme>;
};
