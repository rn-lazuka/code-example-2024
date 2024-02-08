import type { ElementType, PropsWithChildren } from 'react';
import type { WithSx } from '@types';
import Box from '@mui/material/Box';
import { convertSxToArray } from '@utils/converters/mui';
import { footerHeight } from '@constants/containers';

type MainContentContainerProps = WithSx<
  PropsWithChildren<{
    fullHeight?: boolean;
    component?: ElementType;
    testId?: string;
  }>
>;

export const MainContentContainer = ({
  children,
  fullHeight = false,
  component = 'main',
  testId = '',
  sx = [],
}: MainContentContainerProps) => {
  return (
    <Box
      component={component}
      display="flex"
      data-testid={`${testId}MainContentContainer`}
      sx={[
        (theme) => ({
          width: 1,
          maxWidth: 1920,
          margin: {
            xs: `${theme.spacing(7)} auto 0`,
            sm: `${theme.spacing(7)} auto ${theme.spacing(footerHeight)}`,
          },
        }),
        fullHeight && {
          height: (theme) => ({
            xs: `calc(100vh - ${theme.spacing(7.125)})`,
            sm: `calc(100vh - ${theme.spacing(7.125 + footerHeight)})`,
          }),
        },
        ...convertSxToArray(sx),
      ]}
    >
      {children}
    </Box>
  );
};
