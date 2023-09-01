import createElement from '../../dom-helper/create-element';

import priceFilter from '../price-filter';

import filter from '../../assets/image/filter.png';
import './filters.scss';

export default class Filters {
  private filtersIcon = createElement<HTMLImageElement>('img', {
    class: 'filters__icon',
    alt: 'filters icon',
    src: filter,
  });

  private menu = createElement('div', { class: 'filters__menu' });

  constructor() {
    this.init();
  }

  private init(): void {
    this.menu.append(priceFilter.render());
    this.filtersIcon.onclick = (): void => {
      this.menu.classList.toggle('active');
    };
  }

  public renderMenu(): HTMLElement {
    return this.menu;
  }

  public render(): HTMLElement {
    const div = createElement('div', { class: 'filtres' });
    div.append(this.filtersIcon);
    return div;
  }
}
