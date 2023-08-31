import createElement from '../../dom-helper/create-element';
import './sort-select.scss';

class SortSelect {
  private container = createElement('div', { class: 'sort' });

  private selectElement = createElement<HTMLSelectElement>('select', {
    class: 'sort__select',
    id: 'sort-select',
    name: 'sort',
  });

  constructor() {
    this.init();
  }

  private init(): void {
    const label = createElement<HTMLLabelElement>('label', {
      class: 'sort__label',
      for: 'sort-select',
    });
    label.textContent = 'Sortovanie:';
    this.container.append(label, this.selectElement);
  }

  public render(): HTMLElement {
    return this.container;
  }
}

export default new SortSelect();
