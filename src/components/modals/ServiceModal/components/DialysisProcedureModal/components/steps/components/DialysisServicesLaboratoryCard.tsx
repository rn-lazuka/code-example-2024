import { ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { format, isSameDay } from 'date-fns';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import AddIcon from '@mui/icons-material/Add';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import DialysisServiceCard from '../../DialysisServiceCard';
import { useAppDispatch } from '@hooks';
import {
  LabOrderEventPlace,
  ServiceModalName,
  UserPermissions,
  LabOrderStatus,
  PatientStatuses,
  LabSpecimenType,
  FormType,
  AppointmentEventPlace,
} from '@enums';
import palette from '@src/styles/theme/palette';
import { capitalizeFirstLetter, Dictionaries, getPersonNameWithDeletedSyfix, getTenantDate } from '@utils';
import {
  addServiceModal,
  exportLabOrder,
  removeServiceModal,
  resetLabOrdersList,
  selectDialysisAppointmentDate,
  selectDialysisAppointmentId,
  selectDialysisLoading,
  selectDialysisPatient,
  selectDialysisSkipInfo,
  selectIsDisableInterface,
  selectLabOrdersIsSubmitting,
  selectLabOrdersService,
  selectUserPermissions,
  submitLabOrders,
} from '@store';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
import { PermissionGuard } from '@guards';
import CancelIcon from '@mui/icons-material/Cancel';
import Tooltip from '@mui/material/Tooltip';
import type { LabOrdersServiceResponse } from '@types';
import { Link } from 'react-router-dom';
import { ROUTES } from '@constants/global';
import Divider from '@mui/material/Divider';

export const DialysisServicesLaboratoryCard = ({ isXs }: { isXs: boolean }) => {
  const dispatch = useAppDispatch();
  const skipInfo = selectDialysisSkipInfo();
  const isSubmitting = selectLabOrdersIsSubmitting();
  const orders: LabOrdersServiceResponse[] = selectLabOrdersService() || [];
  const userPermissions = selectUserPermissions();
  const isLoading = selectDialysisLoading();
  const { t } = useTranslation('dialysis');
  const { t: tCommon } = useTranslation('common');
  const { t: tLabs } = useTranslation('labOrders');
  const { t: tLabSpecimenTypes } = useTranslation(Dictionaries.LabOrdersSpecimenTypes);
  const { t: tLabTypes } = useTranslation(Dictionaries.LabOrderTypes);
  const isDisabledInterface = selectIsDisableInterface();
  const patient = selectDialysisPatient();
  const appointmentId = selectDialysisAppointmentId();
  const appointmentDate = selectDialysisAppointmentDate();
  const isUnavailableStatus =
    patient?.status === PatientStatuses.Walk_In ||
    patient?.status === PatientStatuses.Dead ||
    patient?.status === PatientStatuses.Discharged;

  useEffect(() => {
    dispatch(resetLabOrdersList());
  }, []);

  const openUrgentLabTestModal = () => {
    dispatch(
      addServiceModal({
        name: ServiceModalName.UrgentLabTest,
        payload: {
          place: LabOrderEventPlace.Dialysis,
          mode: FormType.Add,
          disabledPatient: true,
          formInitialValues: {
            patient: { label: patient.patientName, value: patient.id },
            procedure: null,
            laboratory: null,
            specimenType: LabSpecimenType.BLOOD,
          },
        },
      }),
    );
  };

  const performLabOrderHandler = (order: LabOrdersServiceResponse) => {
    dispatch(
      addServiceModal({
        name: ServiceModalName.PerformLabTest,
        payload: {
          defaultFormValues: {
            patient: { name: patient.patientName, id: patient.id },
            labName: order.labName,
            procedureName: order.procedureName,
            specimenType: order.specimenType,
            performedAt: order.performedAt,
            performedBy: order.performedBy,
            labId: order.labId,
          },
          place: LabOrderEventPlace.Dialysis,
          orderId: order.id,
        },
      }),
    );
  };

  const omitLabOrderHandler = (order: LabOrdersServiceResponse) => {
    dispatch(
      addServiceModal({
        name: ServiceModalName.OmitLabTest,
        payload: {
          labTest: order,
          appointmentId,
          patientName: patient?.patientName,
          place: AppointmentEventPlace.Services,
        },
      }),
    );
  };

  const rescheduleLabOrderHandler = (order: LabOrdersServiceResponse) => {
    dispatch(
      addServiceModal({
        name: ServiceModalName.RescheduleLabTest,
        payload: {
          labTest: order,
          appointmentId,
          place: AppointmentEventPlace.Services,
        },
      }),
    );
  };

  const submitLabOrderHandler = (id: number) => {
    dispatch(
      addServiceModal({
        name: ServiceModalName.ConfirmModal,
        payload: {
          closeCallback: () => dispatch(submitLabOrders({ orderIds: [id], place: LabOrderEventPlace.Dialysis })),
          title: tLabs('modal.submitOrderConfirmation'),
          text: tLabs('modal.makeSureAllNecessarySamplesAreReady'),
          confirmButton: tCommon('button.confirm'),
        },
      }),
    );
  };

  const getLabTestButtons = ({ id }: LabOrdersServiceResponse) => {
    return (
      <PermissionGuard permissions={UserPermissions.AnalysesPrintForm}>
        <IconButton data-testid="laboratoryCardPrint" onClick={() => printLabOrder(id)}>
          <LocalPrintshopOutlinedIcon />
        </IconButton>
      </PermissionGuard>
    );
  };

  const printLabOrder = (orderId) => dispatch(exportLabOrder(orderId));

  const isTenantToday = isSameDay(getTenantDate(), new Date(appointmentDate));

  return (
    <DialysisServiceCard title={tLabs('service.labTests')} isXs={isXs}>
      {!isLoading && (
        <Stack alignItems="flex-start">
          {!orders.length && (
            <Typography mb={3} variant="labelM">
              {tLabs('service.noNecessaryTestsForToday')}
            </Typography>
          )}

          {orders.map((order) => {
            return (
              <Card
                key={order.id}
                data-testid={`labOrder${order.id}`}
                sx={({ spacing }) => ({
                  mb: 2,
                  width: 1,
                  backgroundColor: `${getOrderCardBackgroundColor(order.status)} !important`,
                  border: (theme) => `solid 1px ${theme.palette.border.default}`,
                  borderRadius: `${spacing(1.5)} !important`,
                })}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  sx={{
                    p: ({ spacing }) => spacing(2, 3),
                    borderBottom: (theme) => `solid 1px ${theme.palette.border.default}`,
                  }}
                >
                  <Typography variant="labelL" flexGrow={1}>
                    {capitalizeFirstLetter(order.procedureName)}
                  </Typography>
                  {skipInfo?.skipComment && (
                    <Stack direction="row" spacing={0.5}>
                      <CancelIcon sx={{ fill: ({ palette }) => palette.error.main }} />
                      <Typography variant="labelM">{t('skipped')}</Typography>
                    </Stack>
                  )}
                  {(order.status === LabOrderStatus.PENDING ||
                    order.status === LabOrderStatus.COMPLETED ||
                    order.status === LabOrderStatus.TO_SUBMIT ||
                    order.status === LabOrderStatus.TO_PERFORM) &&
                    !skipInfo?.skipComment && (
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        {order.status === LabOrderStatus.PENDING ||
                        order.status === LabOrderStatus.TO_SUBMIT ||
                        order.status === LabOrderStatus.TO_PERFORM ? (
                          <ChangeCircleIcon sx={{ fill: '#FFD600' }} />
                        ) : (
                          <CheckCircleIcon sx={{ fill: '#006D3C' }} />
                        )}
                        <Typography variant="labelM">{tCommon(`statuses.${order.status}`)}</Typography>
                      </Stack>
                    )}
                  {(order.status === LabOrderStatus.OMITTED || order.status === LabOrderStatus.RESCHEDULED) &&
                    !skipInfo?.skipComment && (
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <CancelIcon sx={{ fill: (theme) => theme.palette.error.main }} />
                        <Typography variant="paragraphM">{tCommon('omitted')}</Typography>
                      </Stack>
                    )}
                </Stack>
                <Stack
                  sx={{
                    p: ({ spacing }) => spacing(2, 3),
                  }}
                >
                  {renderCardRow(
                    isXs,
                    tLabs('service.labOrderNum'),
                    order.number,
                    0,
                    isDisabledInterface ? null : <Stack direction="row">{getLabTestButtons(order)}</Stack>,
                  )}
                  {renderCardRow(isXs, tLabs('service.laboratory'), order.labName)}
                  {renderCardRow(isXs, tLabs('service.specimenType'), tLabSpecimenTypes(order.specimenType))}
                  {order.type && renderCardRow(isXs, tLabs('service.orderType'), tLabTypes(order.type))}
                  {order.status === LabOrderStatus.TO_SUBMIT &&
                    order?.performedAt &&
                    renderCardRow(
                      isXs,
                      tLabs('service.performedTime'),
                      format(new Date(order.performedAt), 'dd/MM/yyyy hh:mm a'),
                    )}
                  {order.status === LabOrderStatus.TO_SUBMIT &&
                    order?.performedBy &&
                    renderCardRow(isXs, tCommon('performedBy'), order.performedBy.name)}
                  {order?.omittedAt &&
                    renderCardRow(
                      isXs,
                      tCommon('omittedBy'),
                      <Stack direction="row" justifyContent="space-between">
                        <Box
                          component={Link}
                          sx={{ display: 'flex', alignItems: 'center', minWidth: (theme) => theme.spacing(23.25) }}
                          color="primary.main"
                          onClick={() => dispatch(removeServiceModal(ServiceModalName.DialysisProcedureModal))}
                          to={`${ROUTES.main}${ROUTES.patientsOverview}/${order.omittedBy?.id}/${ROUTES.patientProfile}`}
                        >
                          <Typography variant="labelM">{getPersonNameWithDeletedSyfix(order.omittedBy)}</Typography>
                        </Box>
                        <Box sx={{ minWidth: (theme) => theme.spacing(23.25) }}>
                          {format(new Date(order.omittedAt), 'hh:mm a')}
                        </Box>
                      </Stack>,
                    )}
                  {order?.comments && renderCardRow(isXs, tLabs('service.comments'), order.comments)}
                  {order?.comment && renderCardRow(isXs, tLabs('service.comments'), order.comment)}
                </Stack>
                <Divider sx={{ bgcolor: (theme) => `solid 1px ${theme.palette.border.default}` }} />
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    p: ({ spacing }) => spacing(2, 3),
                  }}
                  justifyContent={isXs ? 'center' : 'flex-end'}
                  useFlexGap={isXs}
                  flexWrap={isXs ? 'wrap' : 'nowrap'}
                >
                  {!skipInfo?.skipComment && order.status === LabOrderStatus.TO_PERFORM && (
                    <PermissionGuard permissions={UserPermissions.AnalysisProvideService}>
                      <>
                        {!skipInfo?.hasEncounter && (
                          <Tooltip
                            title={isUnavailableStatus ? tCommon('unavailableForPatients') : ''}
                            enterTouchDelay={0}
                          >
                            <Button
                              variant="outlined"
                              size="large"
                              disabled={isUnavailableStatus}
                              sx={{ flex: isXs ? 1 : 'none' }}
                              onClick={() => rescheduleLabOrderHandler(order)}
                            >
                              {tCommon('button.reschedule')}
                            </Button>
                          </Tooltip>
                        )}
                        {isTenantToday && (
                          <Tooltip
                            title={isUnavailableStatus ? tCommon('unavailableForPatients') : ''}
                            enterTouchDelay={0}
                          >
                            <Button
                              variant="outlined"
                              size="large"
                              sx={{ flex: isXs ? 1 : 'none' }}
                              onClick={() => omitLabOrderHandler(order)}
                            >
                              {tCommon('button.omit')}
                            </Button>
                          </Tooltip>
                        )}
                      </>
                    </PermissionGuard>
                  )}
                  {!isDisabledInterface && !skipInfo?.skipComment && order.status === LabOrderStatus.TO_PERFORM && (
                    <Tooltip title={isUnavailableStatus ? tCommon('unavailableForPatients') : ''} enterTouchDelay={0}>
                      <Button
                        variant="contained"
                        size="large"
                        sx={{ flexBasis: isXs ? '100%' : 'inherit' }}
                        onClick={() => performLabOrderHandler(order)}
                        disabled={
                          !userPermissions.includes(UserPermissions.AnalysesSubmitOrder) ||
                          isSubmitting ||
                          isUnavailableStatus
                        }
                      >
                        {tCommon('button.perform')}
                        {isSubmitting && <CircularProgress size="20px" color="inherit" sx={{ ml: 1 }} />}
                      </Button>
                    </Tooltip>
                  )}
                  {!isDisabledInterface && !skipInfo?.skipComment && order.status === LabOrderStatus.TO_SUBMIT && (
                    <Tooltip title={isUnavailableStatus ? tCommon('unavailableForPatients') : ''} enterTouchDelay={0}>
                      <Button
                        variant="contained"
                        sx={{ flex: isXs ? 1 : 'none' }}
                        onClick={() => submitLabOrderHandler(order.id)}
                        disabled={
                          !userPermissions.includes(UserPermissions.AnalysesSubmitOrder) ||
                          isSubmitting ||
                          isUnavailableStatus
                        }
                      >
                        {tCommon('button.submit')}
                        {isSubmitting && <CircularProgress size="20px" color="inherit" sx={{ ml: 1 }} />}
                      </Button>
                    </Tooltip>
                  )}
                </Stack>
              </Card>
            );
          })}

          {!isDisabledInterface && (
            <Tooltip title={isUnavailableStatus ? tCommon('unavailableForPatients') : ''} enterTouchDelay={0}>
              <span>
                <Button
                  variant="outlined"
                  onClick={openUrgentLabTestModal}
                  sx={{ pl: 1 }}
                  disabled={isDisabledInterface || isUnavailableStatus}
                >
                  <AddIcon
                    sx={{
                      color: (theme) =>
                        isDisabledInterface || isUnavailableStatus
                          ? theme.palette.neutral[60]
                          : theme.palette.primary.main,
                      mr: 1,
                    }}
                  />
                  {tLabs('service.addLabTest')}
                </Button>
              </span>
            </Tooltip>
          )}
        </Stack>
      )}
    </DialysisServiceCard>
  );
};

const getOrderCardBackgroundColor = (status: LabOrderStatus) => {
  if (status === LabOrderStatus.TO_PERFORM) {
    return 'rgba(0, 99, 153, 0.08)';
  }
  return palette.background.default;
};

const renderCardRow = (isXs: boolean, name: ReactNode, value: ReactNode, mb = 1, additional?: ReactNode) => {
  return (
    <Stack direction={isXs ? 'column' : 'row'} mb={mb}>
      <Stack direction="row" alignItems="center">
        <Typography variant="labelM" sx={{ minWidth: (theme) => (isXs ? theme.spacing(16.95) : theme.spacing(23.25)) }}>
          {name}
        </Typography>
        <Typography
          variant="labelM"
          sx={[
            isXs && { whiteSpace: 'pre-wrap', wordBreak: 'break-word' },
            !isXs && { minWidth: (theme) => theme.spacing(23.25), whiteSpace: 'pre-wrap' },
          ]}
        >
          {value || '—'}
        </Typography>
      </Stack>

      {isXs ? (
        <Stack direction="row" alignItems="center">
          <Typography
            variant="labelM"
            sx={{
              whiteSpace: 'pre-wrap',
              ml: (theme) => theme.spacing(15.5),
              mt: (theme) => theme.spacing(0.5),
            }}
          >
            {additional}
          </Typography>
        </Stack>
      ) : (
        <Typography variant="labelM" sx={{ minWidth: (theme) => theme.spacing(23.25) }}>
          {additional}
        </Typography>
      )}
    </Stack>
  );
};
