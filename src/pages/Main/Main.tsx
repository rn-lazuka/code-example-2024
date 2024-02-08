import { addSnack, selectUserPermissions } from '@store/slices';
import { ROUTES } from '@constants/global';
import { ViewPermissions } from '@enums/route';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { SnackType } from '@enums/components';
import { useTranslation } from 'react-i18next';

export const Main = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const permissions = selectUserPermissions();
  const { t: tCommon } = useTranslation('common');

  //page order by priority
  const pages = [
    {
      route: ROUTES.todayPatients,
      permission: ViewPermissions.ViewTodayPatients,
    },
    {
      route: ROUTES.administration,
      permission: ViewPermissions.AdministrationAccessSection,
    },
    {
      route: ROUTES.billing,
      permission: ViewPermissions.BillingAccessSection,
    },
    {
      route: ROUTES.patientsOverview,
      permission: ViewPermissions.ViewAllPatientsFull,
    },
    {
      route: ROUTES.schedule,
      permission: ViewPermissions.AllSchedulesView,
    },
    {
      route: ROUTES.reports,
      permission: ViewPermissions.AllReportsView,
    },
    {
      route: ROUTES.labOrders,
      permission: ViewPermissions.AllAnalysesView,
    },
    {
      route: ROUTES.allClinicalNotes,
      permission: ViewPermissions.AllNotesView,
    },
  ];

  useEffect(() => {
    const userDefaultPage = pages.find(({ permission }) => permissions.includes(permission));
    if (userDefaultPage) {
      navigate(userDefaultPage.route);
    } else {
      dispatch(addSnack({ type: SnackType.Error, message: tCommon('youDontHavePermission') }));
    }
  }, []);
  return <></>;
};
