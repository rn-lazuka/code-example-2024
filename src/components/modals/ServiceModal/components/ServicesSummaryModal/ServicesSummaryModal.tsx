import { addServiceModal, finishAndSaveHd, removeServiceModal, selectServices } from '@store/slices';
import { DoctorReviewStatus, NoticeBlockType, ServiceModalName } from '@enums/components';
import { useAppDispatch } from '@hooks/storeHooks';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useEffect, useMemo, useState } from 'react';
import DialogContent from '@mui/material/DialogContent';
import Skeleton from '@mui/material/Skeleton';
import { RichTable } from '@components/RichTable';
import { getServicesSummaryTableColumns } from '@components/modals/ServiceModal/components/ServicesSummaryModal/utils';
import { DoctorSpecialities, LabOrderStatus, VaccinationStatus } from '@enums/global';
import { NoticeBlock } from '@components/NoticeBlock/NoticeBlock';
import { ServicesType } from '@enums/global/ServicesType';
import { theme } from '@src/styles';

type ServicesSummaryModalProps = {
  index: number;
};

const ServicesSummaryModal = ({ index }: ServicesSummaryModalProps) => {
  const [servicesData, setServicesData] = useState<any>([]);
  const { t } = useTranslation('dialysis');
  const { t: tCommon } = useTranslation('common');
  const dispatch = useAppDispatch();
  const columns = useMemo(() => getServicesSummaryTableColumns(), []);
  const services = selectServices();

  useEffect(() => {
    if (services) {
      const data = [
        ...(services.hemodialysis?.id
          ? [
              {
                id: services.hemodialysis?.id,
                category: ServicesType.HAEMODIALYSIS,
                product: 'HD treatment',
                amount: '1',
                status: '',
              },
            ]
          : []),
        ...services.medications.map(({ id, amount, medication, resolution }) => {
          return {
            id,
            category: ServicesType.MEDICATION,
            product: medication.name,
            amount,
            status: resolution,
          };
        }),
        ...services.vaccines.map(({ id, amount, vaccineType, status }) => {
          return {
            id,
            category: ServicesType.VACCINATION,
            product: vaccineType.name,
            amount,
            status,
          };
        }),
        ...services.labOrders.map(({ id, procedureName, status }) => {
          return {
            id,
            category: ServicesType.LAB_ORDER,
            product: procedureName,
            amount: 1,
            status,
          };
        }),
        ...services.doctorReviews.map(({ id, doctor, status }) => {
          return {
            id,
            category:
              doctor.speciality === DoctorSpecialities.DoctorNephrologist
                ? ServicesType.DOCTOR_NEPHROLOGIST_REVIEW
                : ServicesType.DOCTOR_PIC_REVIEW,
            product: doctor.name,
            amount: 1,
            status,
          };
        }),
      ];
      setServicesData(data);
    }
  }, [services]);

  const onCloseHandler = () => dispatch(removeServiceModal(ServiceModalName.ServicesSummaryModal));

  const finishAndSave = () => {
    dispatch(
      addServiceModal({
        name: ServiceModalName.ConfirmModal,
        payload: {
          closeCallback: () => {
            dispatch(finishAndSaveHd());
            dispatch(removeServiceModal(ServiceModalName.ServicesSummaryModal));
          },
          title: t('areYouSureComplete'),
          text: t('notChange'),
          confirmButton: t('buttons.finishAndSave'),
          cancelButton: tCommon('button.cancel'),
        },
      }),
    );
  };

  const isHasNotCompletedServices = useMemo(() => {
    const isCompletedLabOrders = services.labOrders.every(({ status }) => status !== LabOrderStatus.TO_PERFORM);
    const isCompletedMedications = services.medications.every(({ resolution }) => !!resolution);
    const isCompletedVaccines = services.vaccines.every(
      ({ status }) => status !== VaccinationStatus.Pending || status !== VaccinationStatus.NotDone,
    );
    const isCompletedDoctorReviews = services.doctorReviews.every(
      ({ status }) => status !== DoctorReviewStatus.PENDING,
    );

    return !isCompletedLabOrders || !isCompletedMedications || !isCompletedVaccines || !isCompletedDoctorReviews;
  }, [services]);

  return (
    <Dialog
      open
      disableEnforceFocus
      onClose={onCloseHandler}
      data-testid="rescheduleModal"
      sx={{ zIndex: index, '& .MuiDialog-paper': { m: 1 } }}
    >
      <Box sx={({ spacing }) => ({ m: 0, p: 2, width: spacing(87), maxWidth: spacing(87) })}>
        <Typography variant="headerS">{t('servicesSummary')}</Typography>
        <IconButton
          onClick={onCloseHandler}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.icon.main,
          }}
          data-testid="closeIcon"
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent dividers sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
        <Stack spacing={2} direction="column" sx={{ width: 1 }}>
          {!services.hemodialysis?.id ? (
            <>
              <Skeleton height={52} variant="rectangular" />
              <Skeleton height={52} variant="rectangular" />
              <Skeleton height={52} variant="rectangular" />
              <Skeleton height={150} variant="rectangular" />
            </>
          ) : (
            <>
              <RichTable
                stickyHeader
                fullScreen
                columns={columns}
                rows={servicesData}
                headerDivider
                isDataLoading={false}
                sx={{
                  '.MuiTableBody-root .MuiTableCell-body': {
                    padding: (theme) => `${theme.spacing(0.75)} ${theme.spacing(2)}`,
                    '&:first-child': {
                      pr: 1,
                      pl: 3,
                    },
                  },
                  '.MuiTableHead-root .MuiTableRow-head .MuiTableCell-root': {
                    '&:first-child': {
                      pr: 1,
                      pl: 3,
                    },
                  },
                }}
                rowExtraProps={[
                  {
                    condition: (data) => {
                      switch (data.category) {
                        case ServicesType.LAB_ORDER:
                          return data.status === LabOrderStatus.TO_PERFORM;
                        case ServicesType.DOCTOR_PIC_REVIEW:
                        case ServicesType.DOCTOR_NEPHROLOGIST_REVIEW:
                          return data.status === DoctorReviewStatus.PENDING;
                        case ServicesType.MEDICATION:
                          return !data.status;
                        case ServicesType.VACCINATION:
                          return data.status === VaccinationStatus.Pending || data.status === VaccinationStatus.NotDone;
                        default:
                          return false;
                      }
                    },
                    props: { sx: { '& > td': { backgroundColor: theme.palette.error.light } } },
                  },
                ]}
              />
              {isHasNotCompletedServices && (
                <NoticeBlock
                  title={t('unableToFinish')}
                  text={t('servicesNotPerformed')}
                  type={NoticeBlockType.Error}
                  sx={({ spacing }) => ({ mx: `${spacing(2)} !important` })}
                />
              )}
              <Stack spacing={2} direction="row" justifyContent="end" sx={{ p: 2 }}>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={onCloseHandler}
                  data-testid="ServicesSummaryModalCancelButton"
                >
                  {tCommon('button.cancel')}
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  onClick={finishAndSave}
                  disabled={isHasNotCompletedServices}
                  data-testid="ServicesSummaryModalFinishButton"
                >
                  {t('buttons.finishAndSave')}
                </Button>
              </Stack>
            </>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default ServicesSummaryModal;
