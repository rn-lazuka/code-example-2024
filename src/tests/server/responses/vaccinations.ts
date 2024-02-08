import { rest } from 'msw';

export const vaccinationDelete = [
  rest.delete(
    `${process.env.DEVELOPMENT_API_TARGET}/pm/patients/:patientId/vaccinations/:vaccinationId`,
    (req, res, ctx) => {
      return res(ctx.status(200));
    },
  ),
];
