import { FormAutocompleteOption } from '@components/FormComponents';

export interface QuarterlyBtFormType {
  patient: FormAutocompleteOption | null;
  firstQuarterProcedure: FormAutocompleteOption | null;
  secondQuarterProcedure: FormAutocompleteOption | null;
  thirdQuarterProcedure: FormAutocompleteOption | null;
  fourthQuarterProcedure: FormAutocompleteOption | null;
}
