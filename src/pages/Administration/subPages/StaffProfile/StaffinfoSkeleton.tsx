import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';

export const StaffInfoSkeleton = () => {
  return (
    <Stack direction="column" spacing={2} sx={{ px: 3, py: 2 }}>
      <Stack direction="row" spacing={2}>
        <Skeleton variant="circular" height={100} width={100} />
        <Stack direction="column" spacing={1} justifyContent="center" sx={{ flex: 1 }}>
          <Skeleton height={24} />
          <Skeleton height={20} />
        </Stack>
      </Stack>
      <Stack direction="column">
        <Skeleton height={28} />
        <Skeleton height={28} />
        <Skeleton height={28} />
        <Skeleton height={28} />
        <Skeleton height={28} />
        <Skeleton height={28} />
        <Skeleton height={28} />
        <Skeleton height={28} />
        <Skeleton height={28} />
        <Skeleton height={28} />
        <Skeleton height={48} />
        <Skeleton height={56} />
      </Stack>
    </Stack>
  );
};
