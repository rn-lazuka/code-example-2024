import { DialyzerUseType } from '@enums/components';
import { AutocompleteFreeSoloOptionType } from '@components/autocompletes';

export interface AddDialyzerFormType {
  useType: DialyzerUseType;
  dialyzerBrand: AutocompleteFreeSoloOptionType | null;
  dialyzerSurfaceArea?: string | null;
}
