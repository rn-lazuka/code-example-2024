import type { ChangeTreatmentInfoPayload } from '@store/slices';
import type {
  DialysisProcessInfoRequest,
  PatientStatusChangeRequest,
  PatientChangeStatusHistoryResponse,
  PatientStatus,
  ClinicalInfoResponse,
  Patient,
  TreatmentInfo,
} from '@types';
import { rest } from 'msw';
import { PatientStatuses } from '@enums';
import { format } from 'date-fns';
import {
  defaultChangeTreatmentResponse,
  defaultClinicalInfoResponse,
  defaultPatientsAppointmentsSummaryResponse,
  defaultPatientsStatusesAvailableResponse,
  defaultPatientsStatusesResponse,
  defaultTreatmentInfoResponse,
} from '@unit-tests/server/responses';
import { patientPermanentFixture } from '@unit-tests/fixtures';

export const patientsHandlers = [
  rest.post<TreatmentInfo, any, ChangeTreatmentInfoPayload>(
    `${process.env.DEVELOPMENT_API_TARGET}/pm/patients/:patientId/treatment`,
    (req, res, ctx) => {
      return res.once(ctx.status(200), ctx.json(defaultChangeTreatmentResponse));
    },
  ),
  rest.get<any, { patientId: string }, Patient>(
    `${process.env.DEVELOPMENT_API_TARGET}/pm/patients/:patientId/demographics`,
    (req, res, ctx) => {
      const patientId = req.params.patientId;
      return res.once(ctx.status(200), ctx.json(patientPermanentFixture({ id: patientId })));
    },
  ),
  rest.get<any, { patientId: string }, ClinicalInfoResponse | {}>(
    `${process.env.DEVELOPMENT_API_TARGET}/pm/patients/:patientId/clinical-info`,
    (req, res, ctx) => {
      return res.once(ctx.status(200), ctx.json(defaultClinicalInfoResponse));
    },
  ),
  rest.get<any, { patientId: string }, TreatmentInfo>(
    `${process.env.DEVELOPMENT_API_TARGET}/pm/patients/:patientId/treatment`,
    (req, res, ctx) => {
      return res.once(ctx.status(200), ctx.json(defaultTreatmentInfoResponse));
    },
  ),
  rest.get<any, { patientId: string }, PatientStatuses[]>(
    `${process.env.DEVELOPMENT_API_TARGET}/pm/patients/:patientId/statuses/available`,
    (req, res, ctx) => {
      return res.once(ctx.status(200), ctx.json(defaultPatientsStatusesAvailableResponse));
    },
  ),
  rest.get<any, { patientId: string }, DialysisProcessInfoRequest>(
    `${process.env.DEVELOPMENT_API_TARGET}/pm/patients/:patientId/appointments/summary`,
    (req, res, ctx) => {
      return res.once(ctx.status(200), ctx.json(defaultPatientsAppointmentsSummaryResponse));
    },
  ),
  rest.put<PatientStatusChangeRequest, any, PatientChangeStatusHistoryResponse>(
    `${process.env.DEVELOPMENT_API_TARGET}/pm/patients/:patientId/statuses/:statusId`,
    async (req, res, ctx) => {
      const date = format(new Date(), 'yyyy-MM-dd');
      const body = await req.json();

      return res.once(
        ctx.status(200),
        ctx.json({
          ...body,
          statusId: +req.params.statusId,
          createdAt: date,
          updatedAt: date,
        }),
      );
    },
  ),
  rest.post<PatientStatusChangeRequest, any, PatientChangeStatusHistoryResponse>(
    `${process.env.DEVELOPMENT_API_TARGET}/pm/patients/:patientId/statuses`,
    async (req, res, ctx) => {
      const date = format(new Date(), 'yyyy-MM-dd');
      const body = await req.json();

      return res.once(
        ctx.status(200),
        ctx.json({
          ...body,
          statusId: 1,
          createdAt: date,
          updatedAt: date,
        }),
      );
    },
  ),
  rest.get<undefined, { patientId: string }, PatientStatus[]>(
    `${process.env.DEVELOPMENT_API_TARGET}/pm/patients/:patientId/statuses`,
    async (req, res, ctx) => {
      return res.once(ctx.status(200), ctx.json(defaultPatientsStatusesResponse));
    },
  ),
];
