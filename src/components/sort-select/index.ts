import createElement from '../../dom-helper/create-element';
import eventEmitter from '../../dom-helper/event-emitter';

import { Sort } from '../../types/sort';

import './sort-select.scss';

class SortSelect {
  private container = createElement('div', { class: 'sort' });

  public value = Sort.nameAsc;

  private selectElement = createElement<HTMLSelectElement>('select', {
    class: 'sort__select',
    id: 'sort-select',
    name: 'sort',
  });

  constructor() {
    this.init();
  }

  private createOption(name: string, value: Sort): HTMLOptionElement {
    const option = createElement<HTMLOptionElement>('option', {
      class: 'sort__select--option',
      value,
    });
    if (this.value === value) {
      option.selected = true;
    }
    option.textContent = name;
    return option;
  }

  private init(): void {
    const label = createElement<HTMLLabelElement>('label', {
      class: 'sort__label',
      for: 'sort-select',
    });
    label.textContent = 'Sortovanie:';
    this.selectElement.append(
      this.createOption('alfabetyczne', Sort.nameAsc),
      this.createOption('cena: od najniższej', Sort.priceAsc),
      this.createOption('cena: od najwyższej', Sort.priceDesc),
    );
    this.selectElement.onchange = (): void => {
      if (this.value === this.selectElement.value) {
        return;
      }
      this.value = this.selectElement.value as Sort;
      eventEmitter.emit('event: select-sort', { sort: this.value });
    };
    this.container.append(label, this.selectElement);
  }

  public render(): HTMLElement {
    return this.container;
  }
}

export default new SortSelect();
