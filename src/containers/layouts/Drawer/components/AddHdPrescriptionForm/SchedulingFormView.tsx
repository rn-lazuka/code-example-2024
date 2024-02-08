import React from 'react';
import HdPrescriptionDataRow from '@containers/layouts/Drawer/components/AddHdPrescriptionForm/HdPrescriptionDataRow';
import { joinAndSortFrequencyDays } from '@utils/frequency';
import { getHoursAndMinutes } from '@utils/getTimeFromDate';
import { format } from 'date-fns';
import Stack from '@mui/material/Stack';
import { selectHdSchedulingForm } from '@store/slices/hdPrescriptionSlice';
import { useTranslation } from 'react-i18next';
import { Dictionaries } from '@utils/getOptionsListFormCatalog';
import { HdType } from '@enums';

export const SchedulingFormView = () => {
  const schedulingForm = selectHdSchedulingForm();
  const { t } = useTranslation('hdPrescription');
  const { t: tFreq } = useTranslation(Dictionaries.Frequency);

  if (!schedulingForm) {
    return null;
  }

  return schedulingForm.hdType === HdType.AdHoc ? (
    <Stack direction="column" spacing={1}>
      {schedulingForm.dateShifts.map(({ date, duration, shiftId, shiftName }, index) => {
        return (
          <HdPrescriptionDataRow
            key={`${shiftId}-${date}`}
            title={`${t('form.day')} ${index + 1}`}
            value={`${format(date!, 'dd/MM/yyyy')} - ${shiftName}`}
            additionalValue={`(${getHoursAndMinutes(Number(duration))})`}
          />
        );
      })}
    </Stack>
  ) : (
    <Stack direction="column" spacing={1}>
      <HdPrescriptionDataRow title={t('form.frequency')} value={tFreq(schedulingForm.frequency)} />
      <HdPrescriptionDataRow
        title={t('form.days')}
        value={`${joinAndSortFrequencyDays(schedulingForm.daysOfWeek.split('_'), ', ')} - ${
          schedulingForm?.shift?.shiftName
        }`}
      />
      <HdPrescriptionDataRow title={t('tableView.duration')} value={getHoursAndMinutes(schedulingForm.duration)} />
      <HdPrescriptionDataRow
        title={t('form.startDate')}
        value={format(new Date(schedulingForm.startDate), 'dd/MM/yyyy')}
      />
      <HdPrescriptionDataRow title={t('form.endDate')} value={format(new Date(schedulingForm.endDate), 'dd/MM/yyyy')} />
      <HdPrescriptionDataRow title={t('form.hdSessions')} value={schedulingForm.hdSession} />
    </Stack>
  );
};
