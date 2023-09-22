import createElement from '../../dom-helper/create-element';
import eventEmitter from '../../dom-helper/event-emitter';

import './crumb.scss';

export default class Crumb {
  private crumbElement = createElement('div', { class: 'crumb' });

  constructor(public data: { id: string; parentId?: string; name: string }) {
    this.data = data;
    this.init();
  }

  private init(): void {
    this.crumbElement.textContent = `${this.data.name}> `;
    this.crumbElement.onclick = (): void => {
      if (this.data.parentId) {
        eventEmitter.emit('event: change-category', {
          id: this.data.id,
          parentId: this.data.parentId,
        });
      } else {
        eventEmitter.emit('event: change-category', { id: this.data.id });
      }
    };
  }

  public render(): HTMLElement {
    return this.crumbElement;
  }
}
