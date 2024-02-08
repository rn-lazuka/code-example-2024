import { changeCommaToDot, transformEventCommaToDot } from '@utils';

describe('changeCommaToDot', () => {
  it('should replace comma to dot', () => {
    expect(changeCommaToDot('some, example')).toBe('some. example');
  });

  it('should transform comma to dot in event target value', () => {
    const event = { target: { value: 'some, example' } };
    expect(transformEventCommaToDot(event).target.value).toBe('some. example');
  });
});
