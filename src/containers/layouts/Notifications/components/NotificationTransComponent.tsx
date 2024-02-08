import type { Notification } from '@types';
import { TFunction, Trans } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ROUTES } from '@constants';
import { dateFormat, toAmPmTimeString } from '@utils/dateFormat';
import uniqid from 'uniqid';
import { DoctorSpecialities } from '@enums/global';

type NotificationTransComponentProps = {
  notification: Notification;
  t: TFunction<'notifications'>;
  onClose: (_: unknown, reason?: string) => void;
};

export const NotificationTransComponent = ({ onClose, t, notification }: NotificationTransComponentProps) => {
  let values = {};
  let components = [
    <Link
      key={uniqid}
      to={`/${ROUTES.patientsOverview}/${notification.patientId}/${ROUTES.patientProfile}`}
      onClick={(e) => {
        e.stopPropagation();
        onClose(e, 'linkClick');
      }}
    />,
  ];
  let translation = '';

  switch (notification.messageKey) {
    case 'notification.CHANGE_ISOLATION_NOTIFY': {
      translation = 'Isolation info has changed';
      break;
    }
    case 'notification.CHANGE_REST_DAY_NOTIFY': {
      translation = 'Rest day info has changed';
      break;
    }
    case 'notification.CHANGE_BAYS_DETAILS_NOTIFY': {
      translation = 'Bays info has changed';
      break;
    }
    case 'notification.CHANGE_LICENCE_INFO_NOTIFY': {
      translation = 'Licence info info has changed';
      break;
    }
    case 'notification.CHANGE_AVAILABLE_DIALYZERS_NOTIFY': {
      translation = 'Available dialyzers info has changed';
      break;
    }
    case 'notification.CHANGE_AVAILABLE_LABS_NOTIFY': {
      translation = 'Available labs info has changed';
      break;
    }
    case 'notification.CHANGE_AVAILABLE_PACKAGES_NOTIFY': {
      translation = 'Available packages info has changed';
      break;
    }
    case 'notification.READY_LAB_ANALYSIS': {
      const [name, labOrderNumber, date] = notification.messageArguments;
      const samplingDate = dateFormat(date);
      values = { labOrderNumber, samplingDate, name };
      translation = 'Lab tests {{labOrderNumber}} for {{samplingDate}} for <0>{{name}}</0> is ready';
      break;
    }
    case 'notification.LAB_ANALYSIS_CHANGES': {
      const [name, labOrderNumber, date] = notification.messageArguments;
      const samplingDate = dateFormat(date);
      values = { labOrderNumber, samplingDate, name };
      translation = 'Lab tests {{labOrderNumber}} for {{samplingDate}} for <0>{{name}}</0> was changed';
      break;
    }
    case 'notification.NURSE_ACTIONS': {
      const [name, action] = notification.messageArguments;
      values = { name, action };
      translation = '{{action}} was/ was not performed to <0>{{name}}</0>';
      break;
    }
    case 'notification.LAB_RESULTS_DEVIATION': {
      const [name] = notification.messageArguments;
      values = { name };
      translation = 'Lab tests for <0>{{name}}</0> are out of the normal range';
      break;
    }
    case 'notification.PATIENT_MEDICATION_LIST_CHANGES': {
      const [name] = notification.messageArguments;
      values = { name };
      translation = 'Medication for <0>{{name}}</0> was changed';
      break;
    }
    case 'notification.PATIENT_DIALYSIS_PRESCRIPTION_CHANGES': {
      const [name] = notification.messageArguments;
      values = { name };
      translation = 'HD prescription for <0>{{name}}</0> was changed';
      break;
    }
    case 'notification.PATIENT_PROCEDURE_ISSUES': {
      const [name] = notification.messageArguments;
      values = { name };
      translation = `<0>{{name}}</0> has persistent problems`;
      break;
    }
    case 'notification.GUARANTEE_LETTER_EXPIRATION': {
      const [name] = notification.messageArguments;
      values = { name };
      translation = `<0>{{name}}'s</0> guarantee letter is expiring`;
      break;
    }
    case 'notification.DIALYSIS_PROCEDURE_IMMINENT_END': {
      const [name] = notification.messageArguments;
      values = { name };
      translation = `<0>{{name}}'s</0> HD procedure is running to an end`;
      break;
    }
    case 'notification.DOCTOR_VISITS': {
      const [name, timeRange] = notification.messageArguments;
      values = { name, timeRange };
      translation = `Dr <0>{{name}}</0> in the clinic today {{timeRange}}`;
      break;
    }
    case 'notification.SMALL_AMOUNT_OF_REMAINING_MEDICATIONS': {
      translation = `Small amount of remaining medications`;
      break;
    }
    case 'notification.APPOINT_MAINTENANCE_SERVICE_NECESSITY': {
      translation = `Maintenance service necessity`;
      break;
    }
    case 'notification.PERFORM_WATER_TEST_NECESSITY': {
      translation = `Water test performing necessity`;
      break;
    }
    case 'notification.CALENDAR_CUSTOM_EVENT_CREATED':
    case 'notification.CALENDAR_CUSTOM_EVENT_UPDATED': {
      const [title, date] = notification.messageArguments;
      const eventDate = dateFormat(date);
      values = { title, eventDate };
      translation = 'The custom event {{title}} has been created on {{eventDate}}';
      break;
    }
    case 'notification.CALENDAR_CUSTOM_EVENT_DELETED': {
      const [title] = notification.messageArguments;
      values = { title };
      translation = 'The custom event {{title}} has been deleted.';
      break;
    }
    case 'notification.CALENDAR_BT_EVENT_CREATED':
    case 'notification.CALENDAR_BT_EVENT_UPDATED': {
      const [date] = notification.messageArguments;
      const eventDate = dateFormat(date);
      values = { eventDate };
      translation = 'Quarterly BT has been created on {{eventDate}}';
      break;
    }
    case 'notification.CALENDAR_BT_EVENT_DELETED': {
      const [date] = notification.messageArguments;
      const eventDate = dateFormat(date);
      values = { eventDate };
      translation = 'The Quarterly BT {{eventDate}} has been deleted.';
      break;
    }
    case 'notification.CALENDAR_PIC_EVENT_CREATED':
    case 'notification.CALENDAR_PIC_EVENT_UPDATED': {
      const currentDateString = new Date().toDateString();
      const [doctorName, date, isAllDay, from, to] = notification.messageArguments;
      const durationTime =
        isAllDay === 'true'
          ? t('allDay')
          : `${toAmPmTimeString(new Date(`${currentDateString} ${from}`))}-${toAmPmTimeString(
              new Date(`${currentDateString} ${to}`),
            )}`;
      const eventDate = dateFormat(date);
      values = { doctorName, eventDate, durationTime };
      translation = 'The PIC visit {{doctorName}} has been created on {{eventDate}} (Duration - {{durationTime}})';
      break;
    }
    case 'notification.CALENDAR_PIC_EVENT_DELETED': {
      const [doctorName, date] = notification.messageArguments;
      const eventDate = dateFormat(date);
      values = { doctorName, eventDate };
      translation = 'The PIC visit {{doctorName}} {{eventDate}} has been deleted';
      break;
    }
    case 'notification.CALENDAR_NEPHROLOGIST_EVENT_CREATED':
    case 'notification.CALENDAR_NEPHROLOGIST_EVENT_UPDATED': {
      const currentDateString = new Date().toDateString();
      const [doctorName, date, isAllDay, from, to] = notification.messageArguments;
      const durationTime =
        isAllDay === 'true'
          ? t('allDay')
          : `${toAmPmTimeString(new Date(`${currentDateString} ${from}`))}-${toAmPmTimeString(
              new Date(`${currentDateString} ${to}`),
            )}`;
      const eventDate = dateFormat(date);
      values = { doctorName, eventDate, durationTime };
      translation =
        'The Nephrologist visit {{doctorName}} has been created on {{eventDate}} (Duration - {{durationTime}})';
      break;
    }
    case 'notification.CALENDAR_NEPHROLOGIST_EVENT_DELETED': {
      const [doctorName, date] = notification.messageArguments;
      const eventDate = dateFormat(date);
      values = { doctorName, eventDate };
      translation = 'The Nephrologist visit {{doctorName}} {{eventDate}} has been deleted';
      break;
    }
    case 'notification.DOCTOR_REVIEW_RESOLUTION_OMIT': {
      const [date, patientName, doctorSpecialities] = notification.messageArguments;
      const eventDate = dateFormat(date);
      values = {
        patientName,
        eventDate,
        doctorSpecialities: doctorSpecialities === DoctorSpecialities.DoctorInCharge ? 'PIC' : 'Nephrologist',
      };
      translation = '{{doctorSpecialities}} review {{eventDate}} for {{patientName}} has been omitted';
      break;
    }
    default:
      return null;
  }

  return (
    <Trans t={t} i18nKey={notification.messageKey} values={values} components={components}>
      {translation}
    </Trans>
  );
};
