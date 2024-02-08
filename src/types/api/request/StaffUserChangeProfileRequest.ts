import { FileDocument } from '@types';

export interface StaffUserChangeProfileRequest {
  specialities: string[];
  profRegNumber: string;
  files: FileDocument[];
  photoPath: string | null;
}
