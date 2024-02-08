export type RescheduleSlaveLabTestRequest = {
  date: string;
  service: { labOrderId: number };
};

export type RescheduleLabTestRequest = {
  date: string;
  shiftId: number;
};
