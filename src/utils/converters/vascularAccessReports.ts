import type { VascularAccessFilters, VascularAccessChipsCountersResponse, VascularAccessReportsContent } from '@types';
import { format } from 'date-fns';
import { getCodeValueFromCatalog } from '@utils/getOptionsListFormCatalog';
import { CvcTimeCategory, VascularAccessType, ChipsCountersSumNames, VascularAccessFilterNames } from '@enums';

export const setValueFromCatalog = (catalogName, value) => {
  return value ? getCodeValueFromCatalog(catalogName, value) : '';
};

export const convertVascularAccessReportsDataToTableFormat = (data: VascularAccessReportsContent[]) => {
  return data.map(
    ({
      vaCreationDate,
      category,
      vaType,
      cvcCategory,
      side,
      vaNeedleType,
      vaNeedleSizeA,
      vaNeedleSizeV,
      cvcInstillation,
      ...patientInfo
    }) => {
      return {
        ...patientInfo,
        vaCreationDate: vaCreationDate ? format(new Date(vaCreationDate), 'dd/MM/yyyy') : 'N.A.',
        category: setValueFromCatalog('accessCategories', category),
        vaType: setValueFromCatalog('accessTypes', vaType),
        cvcCategory: setValueFromCatalog('cvcCategories', cvcCategory),
        side: setValueFromCatalog('sides', side),
        vaNeedleType: setValueFromCatalog('needleTypes', vaNeedleType),
        vaNeedleSizeA: setValueFromCatalog('needleSizes', vaNeedleSizeA),
        vaNeedleSizeV: setValueFromCatalog('needleSizes', vaNeedleSizeV),
        cvcInstillation: setValueFromCatalog('instillation', cvcInstillation),
      };
    },
  );
};

export const setVascularAccessReportsFiltersBadges = (
  data: VascularAccessChipsCountersResponse,
  filters: VascularAccessFilters,
) => {
  const setAccessTypesCounters = (name: VascularAccessType | ChipsCountersSumNames.vascular) => {
    switch (name) {
      case VascularAccessType.AVF:
        return data.avf;
      case VascularAccessType.AVG:
        return data.avg;
      case ChipsCountersSumNames.vascular:
        return data.avg + data.avf;
      default:
        return 0;
    }
  };
  const setCategoryCounters = (name: CvcTimeCategory | ChipsCountersSumNames.cvc) => {
    switch (name) {
      case CvcTimeCategory.Permanent:
        return data.permanent;
      case CvcTimeCategory.Temporary:
        return data.temporary;
      case ChipsCountersSumNames.cvc:
        return data.temporary + data.permanent;
      default:
        return 0;
    }
  };

  return {
    ...filters,
    [VascularAccessFilterNames.accessTypes]: filters.accessTypes.map((item) => ({
      ...item,
      badge: setAccessTypesCounters(item.name).toString(),
    })),
    [VascularAccessFilterNames.categories]: filters.categories.map((item) => ({
      ...item,
      badge: setCategoryCounters(item.name).toString(),
    })),
  };
};
