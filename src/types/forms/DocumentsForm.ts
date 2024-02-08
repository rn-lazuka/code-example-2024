import type { FileDocument } from '@types';
import { FileTypes } from '@enums';

export interface DocumentsForm {
  [FileTypes.IdentityDocument]: FileDocument[];
  [FileTypes.VirologyStatus]: FileDocument[];
  [FileTypes.MedicalReport]: FileDocument[];
  [FileTypes.Consultation]: FileDocument[];
  [FileTypes.BloodTest]: FileDocument[];
  [FileTypes.HdPrescription]: FileDocument[];
  [FileTypes.Other]: FileDocument[];
}
