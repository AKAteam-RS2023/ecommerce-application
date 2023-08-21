import createElement from './create-element';

describe('create element:', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create element without class name', () => {
    const res = document.createElement('div');
    const createElementSpy = jest.spyOn(document, 'createElement');
    createElementSpy.mockReturnValue(res);
    const actual = createElement('div');
    expect(actual).toBe(res);
    expect(actual.classList).toHaveLength(0);
  });

  test('should create element with class name', () => {
    const res = document.createElement('div');
    const createElementSpy = jest.spyOn(document, 'createElement');
    createElementSpy.mockReturnValue(res);
    const actual = createElement('div', { class: 'testClass' });
    expect(actual).toBe(res);
    expect(actual.classList).toContain('testClass');
  });
});
