import { Control } from 'react-hook-form/dist/types/form';
import type { PreHDForm } from '@types';
import { CvcAccessManagementResponse, VascularAccessManagementResponse } from '@types';
import { useFieldArray, UseFormWatch } from 'react-hook-form';
import DialysisPreHdStepAccessManagement from '@components/modals/ServiceModal/components/DialysisProcedureModal/components/steps/components/DialysisPreHdStepAccessManagement';
import Box from '@mui/material/Box';

type DialysisPreHdStepAccessManagementGroupProps = {
  control: Control<PreHDForm>;
  watch: UseFormWatch<PreHDForm>;
  accessManagements?: (VascularAccessManagementResponse | CvcAccessManagementResponse)[];
};

const DialysisPreHdStepAccessManagementGroup = ({
  control,
  watch,
  accessManagements,
}: DialysisPreHdStepAccessManagementGroupProps) => {
  const { fields } = useFieldArray({
    control,
    name: 'access',
  });

  if (!accessManagements || !accessManagements.length) {
    return null;
  }

  return (
    <Box data-testid="dialysisPreHdStepAccessManagement" sx={{ display: 'flex', flexDirection: 'column' }}>
      {fields.map((access, index) => (
        <DialysisPreHdStepAccessManagement
          key={access.id}
          control={control}
          accessManagement={accessManagements[index]}
          isMulti={accessManagements.length > 1}
          index={index}
          watch={watch}
        />
      ))}
    </Box>
  );
};

export default DialysisPreHdStepAccessManagementGroup;
