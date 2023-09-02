import createElement from '../../dom-helper/create-element';
import eventEmitter from '../../dom-helper/event-emitter';

import priceFilter from '../price-filter';
import colorFilter from '../color-filter';
import madeinFilter from '../madein-filter';

import filter from '../../assets/image/filter.png';

import './filters.scss';

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
    madein: madeinFilter.filtersSet,
  };

  constructor() {
    this.initClearBtn();
    this.init();
    eventEmitter.subscribe('event: change-filter', () => {
      this.changeFilters();
    });
  }

  private static equalSets(set1: Set<unknown>, set2: Set<unknown>): boolean {
    if (set1.size !== set2.size) {
      return false;
    }
    const commonSet = new Set([...set1, ...set2]);
    return commonSet.size === set1.size;
  }

  private checkFilters(): boolean {
    if (
      this.filters.startPrice !== priceFilter.startValue
      || this.filters.finishPrice !== priceFilter.finishValue
      || Filters.equalSets(this.filters.colors, colorFilter.filtersSet)
      || Filters.equalSets(this.filters.madein, madeinFilter.filtersSet)
    ) {
      return false;
    }
    return true;
  }

  private changeFilters(): void {
    if (this.checkFilters()) {
      return;
    }
    this.filters = {
      startPrice: priceFilter.startValue,
      finishPrice: priceFilter.finishValue,
      colors: colorFilter.filtersSet,
      madein: madeinFilter.filtersSet,
    };
    eventEmitter.emit('event: change-products', undefined);
  }

  private init(): void {
    const wrapper = createElement('div', { class: 'filters__menu--wrapper' });
    wrapper.append(priceFilter.render(), colorFilter.render(), madeinFilter.render());
    this.menu.append(wrapper, this.clearFiltersBtn);
    this.filtersIcon.onclick = (): void => {
      this.menu.classList.toggle('active');
    };
  }

  private initClearBtn(): void {
    this.clearFiltersBtn.textContent = 'Usuń wybrane filtry';
    this.clearFiltersBtn.onclick = (): void => {
      eventEmitter.emit('event: clear-filters', undefined);
      eventEmitter.emit('event: change-products', undefined);
    };
  }

  public renderMenu(): HTMLElement {
    return this.menu;
  }

  public render(): HTMLElement {
    const div = createElement('div', { class: 'filters' });
    div.append(this.filtersIcon);
    return div;
  }
}

export default new Filters();
