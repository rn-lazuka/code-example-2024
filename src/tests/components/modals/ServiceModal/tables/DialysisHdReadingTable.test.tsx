import { screen } from '@testing-library/dom';
import { render } from '@unit-tests';
import DialysisHdReadingTable from '@components/modals/ServiceModal/components/DialysisProcedureModal/components/tables/DialysisHdReadingTable';
import { dialysisFixture, dialysisHdReadingRecordFixture } from '@unit-tests/fixtures/dialysis';
import { DialysisStatus } from '@enums';
import { format } from 'date-fns';

describe('DialysisHdReadingTable', () => {
  it("should check that the component isn't being rendered", () => {
    const { container } = render(<DialysisHdReadingTable isXs={false} />, {
      preloadedState: {
        dialysis: {
          status: {
            activeStep: DialysisStatus.CheckIn,
            currentStep: DialysisStatus.CheckIn,
          },
          loading: false,
          hdReading: {
            storage: null,
            allRecords: [],
            savedRecords: [],
          },
        },
      },
    });

    expect(container.querySelectorAll('div').length).toEqual(0);
  });

  it('should check that the component is being rendered and offline rows are highlighted', () => {
    const hdRecord = dialysisHdReadingRecordFixture({ id: 1, __STATUS__: true } as any);
    render(<DialysisHdReadingTable isXs={false} />, {
      preloadedState: dialysisFixture(DialysisStatus.HDReading, [hdRecord]),
    });

    expect(screen.getByText(format(new Date(hdRecord.time), 'hh:mm a'))).toBeTruthy();
    expect(screen.getByText(hdRecord.systolicBp)).toBeTruthy();
    expect(screen.getByText(hdRecord.diastolicBp)).toBeTruthy();
    expect(screen.getByText(hdRecord.hr)).toBeTruthy();
    expect(screen.getByText(hdRecord.ap)).toBeTruthy();
    expect(screen.getByText(hdRecord.vp)).toBeTruthy();
    expect(screen.getByText(hdRecord.tmp)).toBeTruthy();
    expect(screen.getByText(hdRecord.ufRate)).toBeTruthy();
    expect(screen.getByText(hdRecord.qb)).toBeTruthy();
    expect(screen.getByText(hdRecord.qd)).toBeTruthy();
    expect(screen.getByText(hdRecord.cumUf)).toBeTruthy();
    expect(screen.getByText(hdRecord.totalUf)).toBeTruthy();
    expect(screen.getByText(hdRecord.conductivity)).toBeTruthy();
    expect(screen.getByText(hdRecord.heparinRate)).toBeTruthy();
    expect(screen.getByText(hdRecord.ktV)).toBeTruthy();
    expect(screen.getByText(hdRecord.urr)).toBeTruthy();
    expect(screen.getByText(hdRecord.duringHdNotes)).toBeTruthy();
    expect(screen.getByText(hdRecord.signedBy)).toBeTruthy();
    expect(screen.getByTestId('richTableOfflineRow')).toBeTruthy();
  });
});
