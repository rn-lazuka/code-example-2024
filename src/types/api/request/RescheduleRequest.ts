export interface RescheduleHdPrescriptionRequest {
  date: string;
  shiftId: string;
}

export interface RescheduleSlaveServicesRequest {
  date: string;
  service: {
    vaccinationId?: string;
    medicationId?: string;
  };
}
