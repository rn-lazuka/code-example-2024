import { capitalize } from '@utils';

describe('capitalize', () => {
  it('should not fail', () => {
    expect(capitalize('')).toBe('');
  });

  it('should capitalize every word in a sentence', () => {
    const initialSentence = 'should capitalize every word in a sentence';
    const expectedValue = 'Should Capitalize Every Word In A Sentence';
    expect(capitalize(initialSentence)).toBe(expectedValue);
  });
});
