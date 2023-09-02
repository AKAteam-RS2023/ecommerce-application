import createElement from '../../dom-helper/create-element';
import eventEmitter from '../../dom-helper/event-emitter';

export default class Search {
  private input = createElement('input', { type: 'text' });

  constructor() {
    this.input.addEventListener('keypress', () => Search.keyPress());
  }

  private static keyPress = (): void => {
    eventEmitter.emit('event: search', {});
  };

  public render(): HTMLElement {
    const div = createElement('div');
    div.append(this.input);
    return div;
  }
}
