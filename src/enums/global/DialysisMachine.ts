export enum DialysisMachineStatus {
  ACTIVE = 'ACTIVE',
  STANDBY = 'STANDBY',
  SPARE = 'SPARE',
  RETIRED = 'RETIRED',
  UNDER_REPAIR = 'UNDER_REPAIR',
}

export enum DialysisMachineCommunicationType {
  COM_PORT = 'COM_PORT',
  TCP_PORT = 'TCP_PORT',
}

export enum DialysisMachineInfectionStatus {
  NON_INFECTION = 'NON_INFECTION',
  HEP_B = 'HEP_B',
  HEP_C = 'HEP_C',
  HIV = 'HIV',
  HEP_B_HEP_C = 'HEP_B_HEP_C',
  HEP_B_HIV = 'HEP_B_HIV',
  HEP_C_HIV = 'HEP_C_HIV',
  HEP_B_HEP_C_HIV = 'HEP_B_HEP_C_HIV',
  UNKNOWN = 'UNKNOWN',
}
