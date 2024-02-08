import type { Speciality, StaffEntity, StaffListContentItem } from '@types';
import { getCodeValueFromCatalog } from '@utils/getOptionsListFormCatalog';

export const convertStaffListDataToTableFormat = (data: StaffListContentItem[]): StaffEntity[] => {
  return data.map(({ userName, userId, specialities, roles, ...staffInfo }) => {
    return {
      ...staffInfo,
      id: userId,
      name: userName,
      roles: roles.map((role: string) => getCodeValueFromCatalog('userRoles', role)),
      specialities: specialities.reduce(
        (specialities, resp: Speciality) =>
          resp?.name ? [...specialities, getCodeValueFromCatalog('staffSpecialities', resp.name)] : specialities,
        [] as string[],
      ),
    };
  });
};
