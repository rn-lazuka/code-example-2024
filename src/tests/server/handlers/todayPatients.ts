import type { TodayPatientsPlannedInjectionsResponse } from '@types';
import { rest } from 'msw';

export const todayPatientsHandlers = [
  rest.post<any, any, TodayPatientsPlannedInjectionsResponse | null | undefined>(
    `${process.env.DEVELOPMENT_API_TARGET}/pm/appointments/injections/search`,
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json([{}] as any));
    },
  ),
  rest.post(`${process.env.DEVELOPMENT_API_TARGET}/pm/appointments/schedules/view`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([]));
  }),
  rest.post(`${process.env.DEVELOPMENT_API_TARGET}/pm/appointments/schedules/date/available`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([]));
  }),
];
