import { SterilantVe, DialyzerUseType, DialyzerStatuses } from '@enums';

export interface DialyzerBrand {
  id: string;
  name: string;
  code: string;
  type: DialyzerUseType;
}
export interface Dialyzer {
  useType: DialyzerUseType;
  dialyzer: string;
  brand: DialyzerBrand;
  surfaceArea: string;
  primedBy: string;
  reuseNumber: string;
  beforeSterilant: {
    test: SterilantVe;
    testedBy: string;
    comment: string;
  };
  afterSterilant: {
    test: SterilantVe;
    testedBy: string;
    comment: string;
  };
}

export interface Dialyzers {
  id: string;
  brand: DialyzerBrand;
  status: DialyzerStatuses;
  surfaceArea: string;
  type: DialyzerUseType;
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
    deleted: boolean;
  };
  editedAt: string;
  editedBy: {
    id: string;
    name: string;
    deleted: boolean;
  };
  disposedAt: string;
  disposedBy: {
    id: string;
    name: string;
    deleted: boolean;
  };
  history: {
    afterSterilantTestedBy: {
      deleted: boolean;
      id: string;
      name: string;
    };
    beforeSterilantTestedBy: {
      deleted: boolean;
      id: string;
      name: string;
    };
    comment: string;
    date: string;
    primedBy: {
      deleted: boolean;
      id: string;
      name: string;
    };
  }[];
}
