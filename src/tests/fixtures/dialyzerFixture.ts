import { Dialyzers } from '../../types';
import { DialyzerStatuses, DialyzerUseType } from '../../enums';

export const dialyzerFixture = (data: Partial<Dialyzers> = {}): Dialyzers => {
  return {
    id: '1',
    status: DialyzerStatuses.ACTIVE,
    brand: { id: '1', name: 'Test brand', type: DialyzerUseType.Reuse, code: 'testCode' },
    createdAt: '01-01-2023',
    type: DialyzerUseType.Reuse,
    createdBy: { id: '1', name: 'Test doctor', deleted: false },
    disposedAt: '01-01-2023',
    disposedBy: { id: '1', name: 'Test doctor', deleted: false },
    editedAt: '01-01-2023',
    editedBy: { id: '1', name: 'Test doctor', deleted: false },
    history: [],
    surfaceArea: 'left',
    ...data,
  };
};
