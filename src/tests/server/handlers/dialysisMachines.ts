import { rest } from 'msw';
import { defaultDialysisMachinesResponse } from '@unit-tests/server/responses';

export const dialysisMachinesHandlers = [
  rest.get(`${process.env.DEVELOPMENT_API_TARGET}/pm/dialysis-machines`, (req, res, ctx) => {
    ctx.status(200);
    ctx.json(defaultDialysisMachinesResponse);
  }),
];
