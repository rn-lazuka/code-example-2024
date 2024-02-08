import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useAppDispatch, useConfirmNavigation, usePageUnload } from '@hooks';
import { DialysisMachineCommunicationType, DialysisMachineStatus, DrawerType, ServiceModalName } from '@enums';
import {
  addServiceModal,
  clearDialysisMachinesError,
  createDialysisMachine,
  removeDrawer,
  selectDialysisMachine,
  selectDialysisMachinesError,
  selectDialysisMachinesIsolationGroups,
  selectDialysisMachinesIsSubmitting,
  selectDrawerPayload,
  updateDialysisMachine,
  updateDrawer,
} from '@store';
import { AddDialysisMachineFormView } from '@containers/layouts/Drawer/components/AddDialysisMachineForm/AddDialysisMachineFormView';
import type { Location, LocationAvailableResponse, DialysisMachineForm, IsolationGroup } from '@types';
import { API, getTenantDate, getTenantStartCurrentDay } from '@utils';
import { ERROR_CODES } from '@constants';

const AddDialysisMachineForm = () => {
  const { t: tCommon } = useTranslation('common');
  const dispatch = useAppDispatch();
  const machine = selectDialysisMachine();
  const dialysisMachinesError = selectDialysisMachinesError();
  const isolationGroupsList = selectDialysisMachinesIsolationGroups();
  const { isEditing } = selectDrawerPayload(DrawerType.DialysisMachineForm);
  const isSubmitting = selectDialysisMachinesIsSubmitting();

  const [dataIsLoading, setDataIsLoading] = useState(false);
  const [availableLocationsList, setAvailableLocationsList] = useState<Location[]>([]);

  const getDefaultValue = (field: keyof DialysisMachineForm, defaultVal: any = '') => {
    return isEditing && machine?.[field] ? machine[field] : defaultVal;
  };

  const nonInfectionIsolationGroupId =
    isolationGroupsList.find((group) => {
      return group.isolations.length === 0;
    })?.id || 0;

  const getMachineIsolationGroup = () => {
    if (isEditing) {
      return machine?.isolationGroup?.deleted ? null : machine?.isolationGroup?.id;
    }
    return nonInfectionIsolationGroupId;
  };

  const defaultValues: DialysisMachineForm = {
    name: getDefaultValue('name'),
    serialNumber: getDefaultValue('serialNumber'),
    model: getDefaultValue('model'),
    brand: getDefaultValue('brand'),
    communicationType: getDefaultValue('communicationType', DialysisMachineCommunicationType.COM_PORT),
    slotCount: getDefaultValue('slotCount', undefined),
    description: getDefaultValue('description'),
    status: getDefaultValue('status', DialysisMachineStatus.ACTIVE),
    commissionedDate:
      isEditing && machine?.commissionedDate ? getTenantDate(machine?.commissionedDate) : getTenantStartCurrentDay(),
    isolationGroupId: getMachineIsolationGroup(),
    locationId: isEditing && !machine?.location?.deleted ? machine?.location?.id : 0,
    maintenanceFrom:
      isEditing && machine?.maintenanceFrom ? getTenantDate(machine?.maintenanceFrom) : getTenantStartCurrentDay(),
    maintenanceTo:
      isEditing && machine?.maintenanceTo ? getTenantDate(machine?.maintenanceTo) : getTenantStartCurrentDay(),
    warrantyFrom:
      isEditing && machine?.warrantyFrom ? getTenantDate(machine?.warrantyFrom) : getTenantStartCurrentDay(),
    warrantyTo: isEditing && machine?.warrantyTo ? getTenantDate(machine?.warrantyTo) : getTenantStartCurrentDay(),
    comment: getDefaultValue('comment'),
  };

  const { handleSubmit, watch, control, trigger, setValue, setError } = useForm<DialysisMachineForm>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues,
    shouldFocusError: true,
  });
  const { isDirty } = useFormState({ control });

  const selectedIsolationGroupId = watch('isolationGroupId');

  useConfirmNavigation(isDirty, ['/administration']);
  usePageUnload(isDirty, tCommon('dataLost'));

  useEffect(() => {
    dispatch(updateDrawer({ type: DrawerType.DialysisMachineForm, statuses: { isDirty } }));
    return () => {
      dispatch(updateDrawer({ type: DrawerType.DialysisMachineForm, statuses: { isDirty: false } }));
    };
  }, [isDirty]);

  useEffect(() => {
    setValue('locationId', 0);
    updateAvailableLocationsList();
  }, [selectedIsolationGroupId]);

  useEffect(() => {
    if (
      dialysisMachinesError &&
      Array.isArray(dialysisMachinesError) &&
      dialysisMachinesError[0]?.code === ERROR_CODES.DEVICE_IS_NOT_UNIQUE
    ) {
      setError('serialNumber', { type: 'custom', message: tCommon('validation.serialNumberIsAlreadyUsed') });
    }
    return () => {
      dispatch(clearDialysisMachinesError());
    };
  }, [dialysisMachinesError]);

  const updateAvailableLocationsList = async () => {
    if (!selectedIsolationGroupId) return setAvailableLocationsList([]);

    setDataIsLoading(true);
    try {
      const { data } = await API.get<LocationAvailableResponse>(
        `/pm/locations/available?isolationGroupId=${selectedIsolationGroupId}`,
      );
      let dataClone: Location[] = data.filter(({ deleted }) => !deleted);

      if (isEditing && machine?.location?.id && selectedIsolationGroupId === machine?.isolationGroup?.id) {
        dataClone.push(machine.location);
        dataClone = dataClone.sort((a, b) => {
          if (a.name > b.name) return 1;
          if (a.name < b.name) return -1;
          return 0;
        });
      }

      if (machine?.location && dataClone.find((location) => location.id === machine.location.id)) {
        setValue('locationId', machine.location.id);
      } else {
        setValue('locationId', 0);
      }

      setAvailableLocationsList(dataClone);
    } catch {
      setAvailableLocationsList([]);
    }
    setDataIsLoading(false);
  };

  const openCancellationModal = useCallback(() => {
    dispatch(
      addServiceModal({
        name: ServiceModalName.ConfirmModal,
        payload: {
          closeCallback: () => dispatch(removeDrawer(DrawerType.DialysisMachineForm)),
          title: tCommon('closeWithoutSaving'),
          text: tCommon('dataLost'),
          confirmButton: tCommon('button.continue'),
        },
      }),
    );
  }, []);

  const onClose = useCallback(() => {
    isDirty ? openCancellationModal() : dispatch(removeDrawer(DrawerType.DialysisMachineForm));
  }, [isDirty]);

  const onSubmit = (data: DialysisMachineForm) => {
    const requestData = {
      ...data,
      locationId: data.locationId ? data.locationId : null,
      commissionedDate: format(data.commissionedDate, 'yyyy-MM-dd'),
      maintenanceFrom: format(data.maintenanceFrom, 'yyyy-MM-dd'),
      maintenanceTo: format(data.maintenanceTo, 'yyyy-MM-dd'),
      warrantyFrom: format(data.warrantyFrom, 'yyyy-MM-dd'),
      warrantyTo: format(data.warrantyTo, 'yyyy-MM-dd'),
    };

    if (isEditing) dispatch(updateDialysisMachine({ id: machine.id, data: requestData }));
    else dispatch(createDialysisMachine(requestData));
  };

  const isolationGroupOptions = useMemo(() => {
    const machineIsolationFullGroup = machine?.isolationGroup?.id
      ? isolationGroupsList.find(({ id }) => id === machine.isolationGroup.id)
      : undefined;
    return isolationGroupsList.map(({ name, id, isolations }: IsolationGroup) => ({
      label: name,
      value: id,
      disabled:
        machineIsolationFullGroup && machineIsolationFullGroup.isolations?.length ? isolations.length === 0 : false,
    }));
  }, [isolationGroupsList]);

  const availableBaysOptions = useMemo(() => {
    return availableLocationsList.map(({ name, id }) => ({
      label: name,
      value: id,
    }));
  }, [availableLocationsList]);

  return (
    <>
      <Stack direction="column" pb={6.875}>
        <AddDialysisMachineFormView
          control={control}
          watch={watch}
          trigger={trigger}
          isDirty={isDirty}
          isolationGroups={isolationGroupsList}
          isolationGroupOptions={isolationGroupOptions}
          locationOptions={availableBaysOptions}
          dataIsLoading={dataIsLoading}
        />
        <Box
          sx={(theme) => ({
            px: 1,
            py: 1,
            bgcolor: theme.palette.surface.default,
            borderTop: `solid 1px ${theme.palette.border.default}`,
            position: 'absolute',
            bottom: 0,
            width: `calc(100% - ${theme.spacing(4.5)})`,
            zIndex: theme.zIndex.drawer,
          })}
        >
          <Stack spacing={2} direction="row" sx={{ justifyContent: 'flex-end' }}>
            <Button onClick={onClose} variant={'outlined'} data-testid="cancelDialysisMachineCreationButton">
              {tCommon('button.cancel')}
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              variant={'contained'}
              disabled={isSubmitting || !isDirty}
              data-testid="saveDialysisMachineCreationButton"
            >
              {tCommon('button.save')}
              {isSubmitting && <CircularProgress size="20px" color="inherit" sx={{ ml: 1 }} />}
            </Button>
          </Stack>
        </Box>
      </Stack>
    </>
  );
};

export default AddDialysisMachineForm;
