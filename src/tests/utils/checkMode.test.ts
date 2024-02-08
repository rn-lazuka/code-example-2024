import { checkIsDevelopmentMode } from '@utils/checkMode';

describe('checkIsDevelopmentMode', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV, NODE_ENV: 'development' };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('checkIsDevelopmentMode returns true', () => {
    expect(checkIsDevelopmentMode()).toBe(true);
  });

  it('checkIsDevelopmentMode returns false', () => {
    process.env.NODE_ENV = 'production';
    expect(checkIsDevelopmentMode()).toBe(false);
  });
});
