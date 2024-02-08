import { FormFile } from '@src/types';

export interface StaffProfileForm {
  name: string;
  login: string;
  roles: string[];
  specialities: string[];
  profRegNumber: string;
  files?: FormFile[];
}
