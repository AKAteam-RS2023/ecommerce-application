import getAttributes from '../../controller/get-attributes';
import createElement from '../../dom-helper/create-element';
import eventEmitter from '../../dom-helper/event-emitter';

import './madein-filter.scss';

class MadeInFilter {
  private container = createElement('div', { class: 'filters__item' });

  public filtersSet = new Set();

  constructor() {
    this.init();
    eventEmitter.subscribe('event: clear-filters', () => {
      if (this.filtersSet.size === 0) {
        return;
      }
      this.filtersSet.clear();
      this.container.querySelectorAll<HTMLInputElement>('[type="checkbox"]').forEach((item) => {
        item.checked = false; // eslint-disable-line
      });
      this.container.querySelectorAll<HTMLElement>('.filter-madein--element').forEach((item) => {
        item.classList.remove('active');
      });
    });
  }

  private createCheckBox(madein: string): HTMLElement {
    const wrapper = createElement('div', { class: 'filter-madein' });
    const checkBox = createElement<HTMLInputElement>('input', {
      type: 'checkbox',
      class: 'filter-madein-checkbox',
      name: 'madein',
      id: madein,
    });
    const label = createElement<HTMLLabelElement>('label', {
      class: 'filter-madein--label',
      for: madein,
    });
    label.textContent = madein;
    wrapper.append(checkBox, label);
    checkBox.onclick = (): void => {
      if (checkBox.checked) {
        this.filtersSet.add(madein);
      } else {
        this.filtersSet.delete(madein);
      }
      eventEmitter.emit('event: change-filter', undefined);
    };
    return wrapper;
  }

  // private createRadio(madein: string): HTMLElement {
  //   const wrapper = createElement('div', { class: 'filter-madein' });
  //   const radio = createElement<HTMLInputElement>('input', {
  //     type: 'radio',
  //     class: 'filter-madein--radio',
  //     name: 'madein',
  //     id: madein,
  //     value: madein,
  //   });
  //   const label = createElement<HTMLLabelElement>('label', {
  //     class: 'filter-color--label',
  //     for: madein,
  //   });
  //   label.textContent = madein;
  //   wrapper.append(radio, label);
  //   if (this.filter === madein || (this.filter === undefined && madein === ALL)) {
  //     radio.checked = true;
  //   }
  //   radio.onclick = (): void => {
  //     if (this.filter === radio.value) {
  //       return;
  //     }
  //     this.filter = radio.value === ALL ? undefined : radio.value;
  //     eventEmitter.emit('event: change-filter', undefined);
  //   };
  //   return wrapper;
  // }

  private init(): void {
    getAttributes('made-in').then((res) => {
      const madeinSet = new Set();
      res.forEach((item) => {
        item.values.forEach((value) => {
          madeinSet.add(value.key);
        });
      });
      madeinSet.forEach((value) => {
        this.container.append(this.createCheckBox(value as string));
      });
    });
    const title = createElement('div', { class: 'filters__title' });
    title.textContent = 'Made in:';
    this.container.append(title);
  }

  public render(): HTMLElement {
    return this.container;
  }
}

export default new MadeInFilter();
