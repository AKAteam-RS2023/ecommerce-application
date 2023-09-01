import createElement from '../../dom-helper/create-element';

import filter from '../../assets/image/filter.png';
import './filters.scss';

export default class Filters {
  private filtersIcon = createElement<HTMLImageElement>('img', {
    class: 'filters__icon',
    alt: 'filters icon',
    src: filter,
  });

  public render(): HTMLElement {
    const div = createElement('div', { class: 'filtres' });
    div.append(this.filtersIcon);
    return div;
  }
}
