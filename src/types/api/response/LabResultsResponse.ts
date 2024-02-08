import { SelectOptionProps } from '@components/Select/Select';

interface Range {
  code: string;
  range: string;
  measurement: string;
  order: number;
}

interface Index {
  code: string;
  value: string;
}

interface IndexesCategory {
  categoryCode: string;
  tests: Index[];
}

export interface ResultPackage {
  procedureCode: string;
  labName: string;
  completedAt: string;
  testSets: IndexesCategory[];
  procedureName: string;
  labOrderId: number;
  filePresent: boolean;
}

export interface Specification {
  categoryCode: string;
  ranges: Range[];
}

export interface LabResultsListResponse {
  specifications: Specification[];
  resultPackages: ResultPackage[];
}

export interface LabResultsFilters {
  from: Date | null;
  to: Date | null;
  procedure: SelectOptionProps[];
  labName: string[];
}

export interface LabResultsFiltersErrors {
  from: string | null;
  to: string | null;
}
