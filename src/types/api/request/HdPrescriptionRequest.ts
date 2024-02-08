export interface DiscontinueHdPrescriptionRequest {
  date: string;
  reason?: string;
  prescriptionId: string;
  patientId: string;
}
