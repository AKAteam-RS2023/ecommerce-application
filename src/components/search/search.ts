import createElement from '../../dom-helper/create-element';
import eventEmitter from '../../dom-helper/event-emitter';
import './search.scss';

export default class Search {
  private input: HTMLInputElement = createElement<HTMLInputElement>('input', {
    type: 'text',
    class: 'search__input',
    id: 'search-input',
  });

  constructor() {
    this.input.addEventListener('keypress', (e) => this.keyPress(e));
  }

  private keyPress = (e: KeyboardEvent): void => {
    if (e.key === 'Enter') {
      eventEmitter.emit('event: search', { searchQuery: this.input.value });
    }
  };

  public render(): HTMLElement {
    const div = createElement('div', { class: 'search' });
    const label = createElement<HTMLLabelElement>('label', {
      class: 'search__label',
      for: 'search-input',
    });
    label.textContent = 'Znajdź:';
    div.append(label, this.input);
    return div;
  }
}
