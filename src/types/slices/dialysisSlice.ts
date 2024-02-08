import { IndexedDbStorage } from '@services';
import {
  HdProgressRecord,
  Dialysis,
  DialysisPatient,
  PostHd,
  DialysisServicesResponse,
  PerformAndOmitDoctorsReviewForm,
} from '@types';
import {
  DialysisStatus,
  DialyzerUseType,
  DoctorSpecialities,
  DoctorsReviewResolutions,
  PerformAndOmitDoctorReviewPlaces,
  RowHighlightType,
  SterilantVe,
} from '@enums';

export interface DialysisSliceState {
  loading: boolean;
  isFutureAppointment: boolean;
  isSubmitting: boolean;
  error: any;
  saveSuccess: boolean;
  preHd: Dialysis | null;
  hdReading: {
    rowsHighlight: { id: number; type: RowHighlightType }[];
    storage?: IndexedDbStorage<HdProgressRecord> | null;
    savedRecords: HdProgressRecord[];
    allRecords: HdProgressRecord[];
    isEditing: boolean;
  };
  postHd: PostHd | null;
  appointmentId: string | null;
  date: string | null;
  dialysisId: string | null;
  isolationGroup: { id: number; name: string } | null;
  patient: DialysisPatient | null;
  status: {
    activeStep: DialysisStatus;
    currentStep: DialysisStatus;
  };
  startTime?: string;
  endTime?: string;
  bay?: string;
  services: DialysisServicesResponse;
  hasBeenRedirectedToAddAccess: boolean;
  withDialysis: boolean;
  addedNewDialyzer: PreHdDailyzer | null;
}

export type PerformAndOmitDoctorsReviewPayload = {
  formData: PerformAndOmitDoctorsReviewForm;
  resolution: DoctorsReviewResolutions;
  appointmentId: number;
  reviewId: number;
  doctorSpeciality: DoctorSpecialities;
  place: PerformAndOmitDoctorReviewPlaces;
};

export type PreHdDailyzer = {
  id: string;
  type: DialyzerUseType;
  brand: string;
  surfaceArea: string;
  history: {
    date: string;
    dialysisId: string;
    used: boolean;
    primedBy: {
      id: string;
      name: string;
      deleted: boolean;
    };
    comment: string;
    beforeSterilant: {
      test: SterilantVe;
      testedBy: {
        id: string;
        name: string;
        deleted: boolean;
      };
    };
    afterSterilant: {
      test: SterilantVe;
      testedBy: {
        id: string;
        name: string;
        deleted: boolean;
      };
    };
  }[];
};
