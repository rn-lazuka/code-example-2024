import type { IsolationGroupsResponse, DialysisResponse, PatientIsolationDetectResponse } from '@types';
import { rest } from 'msw';
import { defaultIsolationGroupsDetectResponse, defaultIsolationGroupsResponse } from '@unit-tests/server/responses';
import { DialysisStatus, PatientStatuses } from '@enums';

export const commonHandlers = [
  rest.post<{ patientId: string | number }, any, PatientIsolationDetectResponse | null | undefined>(
    `${process.env.DEVELOPMENT_API_TARGET}/pm/isolation-groups/detect`,
    (req, res, ctx) => {
      return res.once(ctx.status(200), ctx.json(defaultIsolationGroupsDetectResponse));
    },
  ),
  rest.get<any, any, IsolationGroupsResponse>(
    `${process.env.DEVELOPMENT_API_TARGET}/pm/isolation-groups`,
    (req, res, ctx) => {
      ctx.status(200);
      ctx.json(defaultIsolationGroupsResponse);
    },
  ),
  rest.get<any, any, DialysisResponse>(
    `${process.env.DEVELOPMENT_API_TARGET}/pm/appointments/:id/summary`,
    (req, res, ctx) => {
      ctx.status(200);
      ctx.json({
        appointmentId: '1',
        appointmentDate: '01-01-2023',
        bay: 'test',
        endTime: '02-01-2023',
        status: DialysisStatus.PreDialysis,
        patient: {
          id: 1,
          patientName: 'test',
          status: PatientStatuses.Permanent,
          gender: { code: 'test', extValue: 'string' },
          birthDate: '15-03-2022',
          document: { number: '1231231', type: 'test' },
        },
        startTime: '02-01-2023',
      } as DialysisResponse);
    },
  ),
];
