import { useTranslation } from 'react-i18next';
import { theme } from '@src/styles';
import { FullScreenModal } from '@components';
import { useAppDispatch } from '@hooks/storeHooks';
import { addSnack, selectServiceModal } from '@store/slices';
import { LabResultFieldsResponse, ManualEnterLabResultTestSetItem, FileDocument, ServiceModalProps } from '@types';
import { ServiceModalName, SnackType } from '@enums/components';
import { EnterLabResultsForm } from '@components/modals/ServiceModal/components/EnterLabResultsModal/components/EnterLabResultsForm';
import { useEffect, useState } from 'react';
import { API } from '@utils/api';
import { Event } from '@services/Event/Event';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

const EnterLabResultsModal = ({ index }: ServiceModalProps) => {
  const { t } = useTranslation('labOrders');
  const { t: tCommon } = useTranslation('common');
  const dispatch = useAppDispatch();
  const [dynamicFieldsData, setDynamicFields] = useState<LabResultFieldsResponse[]>([]);
  const {
    labOrder: { id },
    isEditing,
  } = selectServiceModal(ServiceModalName.EnterLabResultModal);
  const [testSets, setTestSets] = useState<ManualEnterLabResultTestSetItem[]>([]);
  const [labResultFile, setLabResultFile] = useState<FileDocument[]>([]);
  const [loading, setLoading] = useState(true);

  const onCloseHandler = () => {
    Event.fire('closeEnterLabResultsModal');
  };

  useEffect(() => {
    Promise.all([API.get(`/pm/lab-results/${id}`), API.get(`/pm/lab-orders/${id}/specifications`)])
      .then(([resultsData, specificationsData]) => {
        resultsData.data?.file && setLabResultFile([resultsData.data.file]);
        const filteredResultsData = resultsData.data.specifications.map((category) => {
          return {
            ...category,
            ranges: category.ranges.filter((range) => !range.paramDeleted),
          };
        });
        const filteredSpecificationsData = specificationsData.data.map((category) => {
          return {
            ...category,
            ranges: category.ranges.filter((range) => !range.paramDeleted),
          };
        });
        setDynamicFields(isEditing ? filteredResultsData : filteredSpecificationsData);
        const mappedTestSets = resultsData.data.resultPackage.testSets.reduce((acc, { tests }) => {
          const mappedTests = tests.map(({ code, value = '', isAbnormal }) => ({ name: code, value, isAbnormal }));
          return [...acc, ...mappedTests];
        }, []);
        setTestSets(mappedTestSets);
      })
      .catch(() => {
        dispatch(addSnack({ type: SnackType.Error, message: tCommon('systemError') }));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <FullScreenModal
      isOpen={true}
      title={t('modals.enterLabResult')}
      onClose={onCloseHandler}
      titleBlockColor={theme.palette.primary.light}
      contentBlockColor={theme.palette.background.default}
      sx={{ zIndex: index }}
    >
      {loading ? (
        <Stack direction="row" justifyContent="center" p={3} data-testid="labResultsLoader">
          <CircularProgress />
        </Stack>
      ) : (
        <EnterLabResultsForm
          dynamicFieldsData={dynamicFieldsData}
          testSets={testSets}
          labResultFile={labResultFile}
          onCancel={onCloseHandler}
        />
      )}
    </FullScreenModal>
  );
};

export default EnterLabResultsModal;
