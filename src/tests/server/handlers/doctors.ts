import { rest } from 'msw';
import { defaultDoctorsResponse } from '@unit-tests/server/responses';

export const doctorHandlers = [
  rest.get(`${process.env.DEVELOPMENT_API_TARGET}/pm/doctors`, (req, res, ctx) => {
    ctx.status(200);
    ctx.json(defaultDoctorsResponse);
  }),
];
