import { fireEvent } from '@testing-library/dom';
import Search from './search';
import eventEmitter from '../../dom-helper/event-emitter';

// Mock the eventEmitter for testing
jest.mock('../../dom-helper/event-emitter', () => ({
  emit: jest.fn(),
}));

describe('Search', () => {
  let searchComponent: Search;
  let searchRoot: HTMLElement;
  let input: HTMLInputElement;

  beforeEach(() => {
    searchComponent = new Search();
    searchRoot = searchComponent.render();
    document.body.appendChild(searchRoot);
    input = document.getElementById('search-input') as HTMLInputElement;
  });

  afterEach(() => {
    document.body.removeChild(searchRoot);
  });

  it('should emit a "search" event when input value changes', () => {
    const inputValue = 'testQuery';
    fireEvent.change(input, { target: { value: inputValue } });

    expect(eventEmitter.emit).toHaveBeenCalledWith('event: search', {
      searchQuery: inputValue,
    });
  });
});
