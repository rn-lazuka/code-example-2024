import { RestDay } from '@enums';
import { getAdapterLocale } from '@utils';

describe('getAdapterLocale', () => {
  it('should return adapterLocale object with default day (Monday)', () => {
    const adapterLocale = getAdapterLocale(RestDay.SUNDAY);
    expect(adapterLocale.options.weekStartsOn).toEqual(1);
  });
  it('should return adapterLocale object with default day', () => {
    const adapterLocale = getAdapterLocale(RestDay.FRIDAY);
    expect(adapterLocale.options.weekStartsOn).toEqual(6);
  });
});
