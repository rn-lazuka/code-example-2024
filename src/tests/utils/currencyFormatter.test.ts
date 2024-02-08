import { currencyFormatter } from '@utils';

describe('currencyFormatter', () => {
  it('should replace number with spaces after each 3 symbols', () => {
    expect(currencyFormatter('1000000')).toStrictEqual('1 000 000');
  });
});
