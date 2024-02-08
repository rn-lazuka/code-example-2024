import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import Button from '@mui/material/Button';
import { LabOrderStatus as LabOrderStatusType, LabTestTypes, PatientStatuses, UserPermissions } from '@enums';
import { selectPatientStatus, selectUserPermissions } from '@store/slices';
import Tooltip from '@mui/material/Tooltip';
import { LabOrderStatusCellCallbackProps } from '@types';
import { getTenantDate } from '@utils/getTenantDate';
import { dateToServerFormat } from '@utils/dateFormat';
import { LabOrderStatus } from '@components/ServicesStatus/LabOrderStatus';

interface RichTableCellLabOrderStatusProps {
  status: LabOrderStatusType;
  data: any;
  cellCallback?: ({ status, id, data }: LabOrderStatusCellCallbackProps) => void;
  disabled?: boolean;
}

const RichTableCellLabOrderStatus = ({
  status,
  data,
  disabled,
  cellCallback = () => {},
}: RichTableCellLabOrderStatusProps) => {
  const { t: tCommon } = useTranslation('common');
  const { isToPerform, isToSubmit } = useMemo(
    () => ({
      isToPerform: LabOrderStatusType.TO_PERFORM === status,
      isToSubmit: LabOrderStatusType.TO_SUBMIT === status,
    }),
    [status],
  );

  const userPermissions = selectUserPermissions();
  const patientStatus = selectPatientStatus();
  const isUnavailableStatus =
    patientStatus === PatientStatuses.Walk_In ||
    patientStatus === PatientStatuses.Dead ||
    patientStatus === PatientStatuses.Discharged;

  const isDisablePerformButton = useMemo(() => {
    if (isToPerform) {
      switch (data.type) {
        case LabTestTypes.Individual:
        case LabTestTypes.Quarterly:
          return data.appointmentDate !== dateToServerFormat(getTenantDate());
        case LabTestTypes.Urgent:
          return (
            data.appointmentDate !== dateToServerFormat(getTenantDate(new Date(data.createdAt))) ||
            data.appointmentDate !== dateToServerFormat(getTenantDate())
          );
      }
    }
    return false;
  }, [data, isToPerform]);

  return isToPerform || isToSubmit ? (
    <Stack direction="row" spacing={0.5} alignItems="center">
      <Tooltip title={isUnavailableStatus ? tCommon('unavailableForPatients') : ''} enterTouchDelay={0}>
        <span>
          <Button
            variant="outlined"
            onClick={() => cellCallback({ id: data.id, status, data })}
            disabled={
              disabled ||
              isUnavailableStatus ||
              !userPermissions.includes(UserPermissions.AnalysesSubmitOrder) ||
              isDisablePerformButton
            }
            data-testid={`LabOrder${status}Button-${data.id}`}
          >
            <Typography variant="labelM">{tCommon(isToSubmit ? 'submit' : 'perform')}</Typography>
          </Button>
        </span>
      </Tooltip>
    </Stack>
  ) : (
    <LabOrderStatus status={status} />
  );
};

export default RichTableCellLabOrderStatus;
