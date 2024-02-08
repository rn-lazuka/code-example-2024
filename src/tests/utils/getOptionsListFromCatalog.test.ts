import { Dictionaries, getOptionListFromCatalog } from '@utils';
import { COUNTRIES_EN, EDUCATION_EN, ISOLATIONS_EN } from '@translations/en';

describe('getOptionListFromCatalog', () => {
  it('should return an array of string type for all dictionary types', () => {
    const options = getOptionListFromCatalog(Dictionaries.Isolations);
    expect(Array.isArray(options)).toBe(true);
    expect(typeof options[0].value).toBe('string');
    expect(typeof options[0].label).toBe('string');
  });

  it('should return all options for all dictionary types', () => {
    expect(getOptionListFromCatalog(Dictionaries.Isolations).length).toEqual(Object.keys(ISOLATIONS_EN).length);
    expect(getOptionListFromCatalog(Dictionaries.Countries).length).toEqual(Object.keys(COUNTRIES_EN).length);
    expect(getOptionListFromCatalog(Dictionaries.Educations).length).toEqual(Object.keys(EDUCATION_EN).length);
  });
});
