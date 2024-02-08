export const treatmentInfoFixture = (data?) => ({
  isAmbulant: false,
  personInCharge: { id: 2000, fullName: 'Chuck Norris' },
  nephrologist: { id: 2000, fullName: 'Chuck Norris' },
  referralInfo: {
    status: true,
    clinic: 'Clinic name',
    doctor: 'Doctor name',
  },
  firstDialysis: '1989-05-29',
  firstCenterDialysis: '1989-08-29',
  comments: '',
});
