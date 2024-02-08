import { Event } from '@services';

const EventName = 'testEvent';
const TestData = 'testData';
describe('Event observer', () => {
  it('Should subscribe for event', async () => {
    const cb = jest.fn();
    Event.subscribe(EventName, cb);
    Event.fire(EventName);

    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('Should unsubscribe for event', async () => {
    const cb = jest.fn();
    Event.subscribe(EventName, cb);
    Event.fire(EventName);

    Event.unsubscribe('testEvent', cb);
    Event.fire(EventName);
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('Should fired with data', async () => {
    const cb = jest.fn();
    Event.subscribe(EventName, cb);
    Event.fire(EventName, TestData);

    expect(cb).toHaveBeenCalledWith(TestData);
  });
});
