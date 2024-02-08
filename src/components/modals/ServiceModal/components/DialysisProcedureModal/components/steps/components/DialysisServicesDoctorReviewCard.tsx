import { useTranslation } from 'react-i18next';
import DialysisServiceCard from '../../DialysisServiceCard';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import {
  addServiceModal,
  selectDialysisAppointmentDate,
  selectDialysisAppointmentId,
  selectDialysisPatient,
  selectDialysisSkipInfo,
  selectDoctorReviewsService,
  selectUserId,
} from '@store/slices';
import { capitalizeFirstLetter, getCodeValueFromCatalog, getTenantDate } from '@utils';
import {
  DoctorReviewStatus as DoctorReviewStatusType,
  DoctorSpecialities,
  PatientStatuses,
  PerformAndOmitDoctorReviewPlaces,
  ServiceModalName,
  UserPermissions,
} from '@enums';
import Button from '@mui/material/Button';
import { DoctorReviewServiceResponse } from '@src/types';
import Divider from '@mui/material/Divider';
import { PermissionGuard } from '@guards';
import CancelIcon from '@mui/icons-material/Cancel';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { useAppDispatch } from '@hooks';
import { format, isSameDay } from 'date-fns';
import theme from '@src/styles/theme';
import { REVIEW_DATA_COLUMN_WIDTH } from '@constants';
import { DoctorReviewStatus } from '@components/ServicesStatus/DoctorReviewStatus';

export const DialysisServicesDoctorReviewCard = ({ isXs }: { isXs: boolean }) => {
  const { t } = useTranslation('dialysis');
  const { t: tCommon } = useTranslation('common');
  const doctorReviews = selectDoctorReviewsService();
  const skipInfo = selectDialysisSkipInfo();
  const patient = selectDialysisPatient();
  const dispatch = useAppDispatch();
  const userId = selectUserId();
  const appointmentDate = selectDialysisAppointmentDate();
  const isTenantDayEqualsAppointmentDay = isSameDay(getTenantDate(), new Date(appointmentDate));
  const appointmentId = selectDialysisAppointmentId();

  const isUnavailableStatus =
    patient?.status === PatientStatuses.Walk_In ||
    patient?.status === PatientStatuses.Dead ||
    patient?.status === PatientStatuses.Discharged;

  if (!doctorReviews.length) {
    return null;
  }

  const getDoctorsSpecialityTitle = (review: DoctorReviewServiceResponse) => {
    return `${getCodeValueFromCatalog('doctorSpecialities', review?.doctor?.speciality!)} ${t('review')}`;
  };

  const omitHandler = (review: DoctorReviewServiceResponse) => {
    dispatch(
      addServiceModal({
        name: ServiceModalName.PerformAndOmitDoctorsReview,
        payload: {
          review,
          title: getDoctorsSpecialityTitle(review),
          appointmentId,
          type: DoctorReviewStatusType.OMITTED,
          patientName: patient.patientName,
          place: PerformAndOmitDoctorReviewPlaces.Services,
        },
      }),
    );
  };

  const performHandler = (review: DoctorReviewServiceResponse) => {
    dispatch(
      addServiceModal({
        name: ServiceModalName.PerformAndOmitDoctorsReview,
        payload: {
          review,
          title: getDoctorsSpecialityTitle(review),
          appointmentId,
          type: DoctorReviewStatusType.PERFORMED,
          place: PerformAndOmitDoctorReviewPlaces.Services,
        },
      }),
    );
  };

  return (
    <DialysisServiceCard title={t('doctorsReview')} isXs={isXs}>
      <Stack>
        {doctorReviews.map((review: DoctorReviewServiceResponse) => (
          <Card
            key={review.id}
            data-testid={`doctorReview${review.id}`}
            sx={({ spacing, palette }) => ({
              mb: 2,
              width: 1,
              bgcolor:
                review.status === DoctorReviewStatusType.OMITTED || review.status === DoctorReviewStatusType.PERFORMED
                  ? `${palette.background.default} !important`
                  : '#E9F0F6 !important',
              border: `solid 1px ${palette.border.default}`,
              borderRadius: `${spacing(1.5)} !important`,
            })}
          >
            <Stack
              direction={isXs ? 'column' : 'row'}
              justifyContent="space-between"
              sx={{
                p: ({ spacing }) => (isXs ? spacing(2, 2) : spacing(2, 3)),
              }}
            >
              <Stack direction="column" spacing={0.5}>
                <Typography variant="labelL" sx={{ maxWidth: (theme) => theme.spacing(30.5) }}>
                  {getDoctorsSpecialityTitle(review)}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box
                    sx={(theme) => ({
                      bgcolor:
                        review?.doctor?.speciality === DoctorSpecialities.DoctorNephrologist ? '#00AEA9' : '#F05674',
                      borderRadius: '100px',
                      color: theme.palette.primary[100],
                      p: theme.spacing(0, 0.5),
                    })}
                  >
                    <Typography variant="labelXS">
                      {t(review?.doctor?.speciality === DoctorSpecialities.DoctorNephrologist ? 'neph' : 'pic')}
                    </Typography>
                  </Box>
                  <Typography variant="labelS">{capitalizeFirstLetter(review.doctor?.name)}</Typography>
                  <Typography variant="labelS" sx={(theme) => ({ color: theme.palette.text.secondary })}>
                    {`${t('doctor')} ${t(review?.doctor?.speciality!)}`}
                  </Typography>
                </Stack>
              </Stack>

              <Stack direction={isXs ? 'column' : 'row'} sx={[{ mt: isXs ? 0.5 : 0 }]}>
                {skipInfo?.skipComment ? (
                  <Stack direction="row" spacing={0.5}>
                    <CancelIcon sx={{ fill: ({ palette }) => palette.error.main }} />
                    <Typography variant="labelM">{t('skipped')}</Typography>
                  </Stack>
                ) : (
                  <DoctorReviewStatus status={review.status} />
                )}
              </Stack>
            </Stack>

            {(review.status === DoctorReviewStatusType.PERFORMED ||
              review.status === DoctorReviewStatusType.OMITTED) && (
              <>
                <Divider sx={{ bgcolor: (theme) => `solid 1px ${theme.palette.border.default}` }} />
                <Stack
                  direction="column"
                  spacing={1}
                  sx={{
                    p: ({ spacing }) => spacing(2, 3),
                  }}
                >
                  <Stack direction="row">
                    <Typography
                      color={theme.palette.text.darker}
                      variant="labelM"
                      sx={{ minWidth: ({ spacing }) => spacing(REVIEW_DATA_COLUMN_WIDTH) }}
                    >
                      {t(`performDoctorsReview.${review.omittedBy?.name ? 'omittedBy' : 'performedBy'}`)}
                    </Typography>
                    {(review.status === DoctorReviewStatusType.PERFORMED ||
                      review.status === DoctorReviewStatusType.OMITTED) && (
                      <Typography
                        variant="labelM"
                        sx={{
                          minWidth: ({ spacing }) => spacing(REVIEW_DATA_COLUMN_WIDTH),
                        }}
                      >
                        {review.omittedBy?.name ? review.omittedBy.name : review.doctor.name}
                      </Typography>
                    )}
                    {(review?.administeredAt || review?.omittedAt) && (
                      <Typography
                        variant="labelM"
                        sx={{ minWidth: ({ spacing }) => spacing(REVIEW_DATA_COLUMN_WIDTH) }}
                      >
                        {format(
                          new Date(
                            review.status === DoctorReviewStatusType.PERFORMED
                              ? (review.administeredAt as string)
                              : (review.omittedAt as string),
                          ),
                          'hh:mm aa',
                        )}
                      </Typography>
                    )}
                  </Stack>
                  <Stack direction="row">
                    <Typography
                      variant="labelM"
                      color={theme.palette.text.darker}
                      sx={{ minWidth: ({ spacing }) => spacing(REVIEW_DATA_COLUMN_WIDTH) }}
                    >
                      {t(
                        `performDoctorsReview.${
                          review.status === DoctorReviewStatusType.PERFORMED ? 'nephrologistReview' : 'PICReview'
                        }`,
                      )}
                    </Typography>
                    <Typography variant="labelM">{review.note}</Typography>
                  </Stack>
                </Stack>
              </>
            )}
            <Divider sx={{ bgcolor: (theme) => `solid 1px ${theme.palette.border.default}` }} />
            {review.status === DoctorReviewStatusType.PENDING && (
              <Stack
                direction="row"
                spacing={1}
                sx={{ px: 3, py: 2 }}
                justifyContent={isXs ? 'center' : 'flex-end'}
                useFlexGap={isXs}
                flexWrap={isXs ? 'wrap' : 'nowrap'}
              >
                <PermissionGuard permissions={[UserPermissions.DoctorProvideService]}>
                  {isTenantDayEqualsAppointmentDay && (
                    <Tooltip title={isUnavailableStatus ? tCommon('unavailableForPatients') : ''} enterTouchDelay={0}>
                      <Box component="span">
                        <Button
                          variant="outlined"
                          size="large"
                          onClick={() => omitHandler(review)}
                          sx={{ flex: isXs ? 1 : 'none' }}
                        >
                          {tCommon('button.omit')}
                        </Button>
                      </Box>
                    </Tooltip>
                  )}
                </PermissionGuard>
                <PermissionGuard
                  permissions={[UserPermissions.NephrologistReviewModify, UserPermissions.PICReviewModify]}
                >
                  {review.doctor?.userId === userId && isTenantDayEqualsAppointmentDay && (
                    <Tooltip title={isUnavailableStatus ? tCommon('unavailableForPatients') : ''} enterTouchDelay={0}>
                      <Box component="span">
                        <Button
                          variant="contained"
                          size="large"
                          onClick={() => performHandler(review)}
                          sx={{ flex: isXs ? 1 : 'none' }}
                        >
                          {tCommon('button.performReview')}
                        </Button>
                      </Box>
                    </Tooltip>
                  )}
                </PermissionGuard>
              </Stack>
            )}
          </Card>
        ))}
      </Stack>
    </DialysisServiceCard>
  );
};
