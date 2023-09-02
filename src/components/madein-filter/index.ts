import getAttributes from '../../controller/get-attributes';
import createElement from '../../dom-helper/create-element';
import eventEmitter from '../../dom-helper/event-emitter';

import './madein-filter.scss';

const ALL = 'Wszystkie';

class MadeInFilter {
  private container = createElement('div', { class: 'filters__item' });

  public filter: string | undefined = undefined;

  constructor() {
    this.init();
    eventEmitter.subscribe('event: clear-filters', () => {
      if (!this.filter) {
        return;
      }
      this.filter = undefined;
      const input = this.container.querySelector<HTMLInputElement>(`[id="${ALL}"]`);
      if (input) {
        input.checked = true;
      }
    });
  }

  private createRadio(madein: string): HTMLElement {
    const wrapper = createElement('div', { class: 'filter-madein' });
    const radio = createElement<HTMLInputElement>('input', {
      type: 'radio',
      class: 'filter-madein--radio',
      name: 'madein',
      id: madein,
      value: madein,
    });
    const label = createElement<HTMLLabelElement>('label', {
      class: 'filter-color--label',
      for: madein,
    });
    label.textContent = madein;
    wrapper.append(radio, label);
    if (this.filter === madein || (this.filter === undefined && madein === ALL)) {
      radio.checked = true;
    }
    radio.onclick = (): void => {
      if (this.filter === radio.value) {
        return;
      }
      this.filter = radio.value === ALL ? undefined : radio.value;
      eventEmitter.emit('event: change-filter', undefined);
    };
    return wrapper;
  }

  private init(): void {
    getAttributes('made-in').then((res) => {
      const madeinSet = new Set();
      res.forEach((item) => {
        item.values.forEach((value) => {
          madeinSet.add(value.key);
        });
      });
      madeinSet.forEach((value) => {
        this.container.append(this.createRadio(value as string));
      });
    });
    const title = createElement('div', { class: 'filters__title' });
    title.textContent = 'Made in:';
    const all = this.createRadio(ALL);
    this.container.append(title, all);
  }

  public render(): HTMLElement {
    return this.container;
  }
}

export default new MadeInFilter();
