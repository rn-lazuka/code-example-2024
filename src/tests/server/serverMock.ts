import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { doctorHandlers } from '@unit-tests/server/handlers/doctors';
import { vaccinationDelete } from '@unit-tests/server/handlers/vaccinations';
import { commonHandlers } from '@unit-tests/server/handlers/common';
import { patientsHandlers } from '@unit-tests/server/handlers/patients';
import { todayPatientsHandlers } from '@unit-tests/server/handlers/todayPatients';

export const server = setupServer(
  ...commonHandlers,
  ...doctorHandlers,
  ...vaccinationDelete,
  ...patientsHandlers,
  ...todayPatientsHandlers,
  rest.get('*', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([]));
  }),
);
