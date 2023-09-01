import getAttributes from '../../controller/get-attributes';
import createElement from '../../dom-helper/create-element';

import './madein-filter.scss';

class MadeInFilter {
  private container = createElement('div', { class: 'filters__item' });

  public filter = 'Wszystkie';

  constructor() {
    this.init();
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
    if (this.filter === madein) {
      radio.checked = true;
    }
    radio.onclick = (): void => {
      this.filter = radio.value;
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
    const all = this.createRadio('Wszystkie');
    this.container.append(title, all);
  }

  public render(): HTMLElement {
    return this.container;
  }
}

export default new MadeInFilter();
