import { render } from '@unit-tests';
import { dialysisVaccineAdministeringFixture } from '@unit-tests/fixtures/dialysis';
import { screen } from '@testing-library/dom';
import VaccineMedicationAdministeringModal from '@components/modals/ServiceModal/components/VaccineMedicationAdministeringModal/VaccineMedicationAdministeringModal';
import { server } from '@unit-tests/server/serverMock';
import { rest } from 'msw';
import { AllergiesInfo } from '@enums/global';

describe('VaccineMedicationAdministeringModal', () => {
  it('should render the pre HD form with fields', async () => {
    server.use(
      rest.get(`${process.env.DEVELOPMENT_API_TARGET}/pm/patients/:id/allergies`, (req, res, ctx) => {
        return res.once(
          ctx.status(200),
          ctx.json({
            patientId: 1,
            allergy: { type: AllergiesInfo.Allergy, values: [{ name: 'Penicillin' }] },
          }),
        );
      }),
    );
    await render(<VaccineMedicationAdministeringModal index={0} />, {
      preloadedState: dialysisVaccineAdministeringFixture(),
    });
    expect(screen.getByText('COVID-19 Vaccine')).toBeInTheDocument();
  });
});
