import eventEmitter from './event-emitter';

describe('Event Emitter:', () => {
  test('should include emit, subscribe', () => {
    expect(eventEmitter.emit).toBeDefined();
    expect(eventEmitter.subscribe).toBeDefined();
  });

  test('should be subscribe work', () => {
    const unsubscribedFunc = eventEmitter.subscribe('testEvent', jest.fn());
    expect(unsubscribedFunc).toEqual(expect.any(Function));
    expect(eventEmitter.events).toHaveProperty('testEvent');
  });

  test('should be emit work', () => {
    const testCallback = jest.fn();
    eventEmitter.subscribe('testEvent', testCallback);
    eventEmitter.emit('testEvent', { id: 'test' });
    expect(testCallback).toBeCalledTimes(1);
    expect(testCallback).toHaveBeenLastCalledWith({ id: 'test' });
  });
});
