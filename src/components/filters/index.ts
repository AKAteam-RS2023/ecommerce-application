import createElement from '../../dom-helper/create-element';

import priceFilter from '../price-filter';
import colorFilter from '../color-filter';
import madeinFilter from '../madein-filter';

import filter from '../../assets/image/filter.png';

import './filters.scss';
import eventEmitter from '../../dom-helper/event-emitter';

class Filters {
  private filtersIcon = createElement<HTMLImageElement>('img', {
    class: 'filters__icon',
    alt: 'filters icon',
    src: filter,
  });

  private menu = createElement('div', { class: 'filters__menu' });

  private clearFiltersBtn = createElement<HTMLButtonElement>('button', { class: 'button--clear' });

  public filters = {
    startPrice: priceFilter.startValue,
    finishPrice: priceFilter.finishValue,
    colors: colorFilter.filtersSet,
    madein: madeinFilter.filter,
  };

  constructor() {
    this.initClearBtn();
    this.init();
    eventEmitter.subscribe('event: change-filter', () => {
      this.changeFilters();
    });
  }

  private changeFilters(): void {
    this.filters = {
      startPrice: priceFilter.startValue,
      finishPrice: priceFilter.finishValue,
      colors: colorFilter.filtersSet,
      madein: madeinFilter.filter,
    };
  }

  private init(): void {
    this.filtersIcon.onclick = (): void => {
      this.menu.classList.toggle('active');
    };
  }

  private initClearBtn(): void {
    this.clearFiltersBtn.textContent = 'Usuń wybrane filtry';
    this.clearFiltersBtn.onclick = (): void => {
      eventEmitter.emit('event: clear-filters', undefined);
    };
  }

  public renderMenu(): HTMLElement {
    const wrapper = createElement('div', { class: 'filters__menu--wrapper' });
    wrapper.append(priceFilter.render(), colorFilter.render(), madeinFilter.render());
    this.menu.append(wrapper, this.clearFiltersBtn);
    return this.menu;
  }

  public render(): HTMLElement {
    const div = createElement('div', { class: 'filters' });
    div.append(this.filtersIcon);
    return div;
  }
}

export default new Filters();