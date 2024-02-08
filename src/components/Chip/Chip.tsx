import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { ChipColors, ChipVariants } from '@enums';
import { convertSxToArray } from '@utils/converters/mui';
import type { WithSx } from '@types';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material/SvgIcon/SvgIcon';
import { ReactNode } from 'react';

type ChipProps = WithSx<{
  label: string | ReactNode;
  badge?: string | null;
  variant?: ChipVariants;
  color?: ChipColors;
  onClick?: () => void;
  LeftIcon?: OverridableComponent<SvgIconTypeMap> | null;
  RightIcon?: OverridableComponent<SvgIconTypeMap> | null;
  leftIconColor?: string;
  rightIconColor?: string;
  onLeftIconClick?: () => void;
  onRightIconClick?: () => void;
  dataTestId?: string;
  className?: string;
}>;

export const Chip = ({
  label,
  badge,
  variant = ChipVariants.outlined,
  color = ChipColors.standard,
  className = 'chip',
  onClick,
  LeftIcon,
  RightIcon,
  leftIconColor,
  rightIconColor,
  onLeftIconClick,
  onRightIconClick,
  dataTestId = 'chipContainer',
  sx = [],
}: ChipProps) => {
  const getIconStyles = (spacing) => ({
    width: spacing(2.4),
    height: spacing(2.4),
  });

  const getChipBackgroundColor = (palette) => {
    switch (color) {
      case ChipColors.blue:
        return palette.primary.light;
      case ChipColors.primary:
        return palette.primary.main;
      case ChipColors.pink:
        return '#FFD6FF';
      default:
        return palette.neutral.light;
    }
  };

  const getBudgeBackgroundColor = (palette) => {
    switch (color) {
      case ChipColors.blue:
        return palette.primary.main;
      case ChipColors.primary:
        return palette.primary.dark;
      case ChipColors.pink:
        return '#9036A2';
      default:
        return palette.text.secondary;
    }
  };

  const getChipLabelColor = (palette) => {
    if (variant === ChipVariants.fill) {
      switch (color) {
        case ChipColors.blue:
          return palette.primary.dark;
        case ChipColors.primary:
          return palette.text.white;
        case ChipColors.pink:
          return '#350040';
        default:
          return palette.text.primary;
      }
    } else {
      return palette.text.primary;
    }
  };

  const handleChipClick = () => {
    onClick && onClick();
  };

  const handleLeftIconClick = (event) => {
    if (onLeftIconClick) {
      event.stopPropagation();
      onLeftIconClick();
    }
  };

  const handleRightIconClick = (event) => {
    if (onRightIconClick) {
      event.stopPropagation();
      onRightIconClick();
    }
  };

  return (
    <Stack
      data-testid={dataTestId}
      direction="row"
      spacing={1}
      alignItems="center"
      onClick={handleChipClick}
      className={className}
      sx={[
        ({ spacing, palette }) => ({
          border: `${spacing(0.125)} solid ${
            variant === ChipVariants.outlined ? palette.text.secondary : getChipBackgroundColor(palette)
          }`,
          borderRadius: spacing(1),
          padding: spacing(0.8, 1),
          bgcolor: variant === ChipVariants.fill ? getChipBackgroundColor(palette) : 'transparent',
          '&:hover': {
            cursor: 'pointer',
          },
        }),
        ...convertSxToArray(sx),
      ]}
    >
      {LeftIcon && (
        <LeftIcon
          data-testid="chipLeftIcon"
          onClick={handleLeftIconClick}
          sx={({ spacing }) => ({ ...getIconStyles(spacing), color: leftIconColor })}
        />
      )}
      <Typography
        data-testid="chipLabel"
        variant="labelM"
        sx={{ color: ({ palette }) => getChipLabelColor(palette), userSelect: 'none' }}
      >
        {label}
      </Typography>
      {badge && (
        <Box
          data-testid="chipBadge"
          sx={({ spacing, palette }) => ({
            bgcolor: getBudgeBackgroundColor(palette),
            color: palette.text.white,
            borderRadius: spacing(12.5),
            padding: spacing(0, 0.75),
          })}
        >
          <Typography variant="labelM">{badge}</Typography>
        </Box>
      )}
      {RightIcon && (
        <RightIcon
          data-testid="chipRightIcon"
          onClick={handleRightIconClick}
          sx={({ spacing }) => ({ ...getIconStyles(spacing), fill: rightIconColor })}
        />
      )}
    </Stack>
  );
};
