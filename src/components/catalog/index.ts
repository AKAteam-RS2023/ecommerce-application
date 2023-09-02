import createElement from '../../dom-helper/create-element';
import eventEmitter from '../../dom-helper/event-emitter';

import ProductCard from '../product-card';
import BreadCrumb from '../breadcrumb';
import categories from '../categories';

import filters from '../filters';
import sortSelect from '../sort-select';

import getIProducts from '../../controller/get-products';

import { Sort } from '../../types/sort';

import './catalog.scss';

export default class Catalog {
  private container = createElement('section', { class: 'catalog' });

  private products: ProductCard[] = [];

  private breadcrumb = new BreadCrumb();

  private selectCategory: string | null = null;

  private sort: Sort = sortSelect.value;

  constructor() {
    this.init();
    eventEmitter.subscribe('event: change-category', (data) => {
      if (!data || !('id' in data)) {
        return;
      }
      this.selectCategory = data.id;
      this.init();
    });
    eventEmitter.subscribe('event: show-all-products', () => {
      if (!this.selectCategory) {
        return;
      }
      this.selectCategory = null;
      this.init();
    });
    eventEmitter.subscribe('event: select-sort', (data) => {
      if (!data || !('sort' in data)) {
        return;
      }
      this.sort = data.sort as Sort;
      this.init();
    });
    eventEmitter.subscribe('event: change-products', () => {
      console.log(filters.filters);
      // this.init();
    });
  }

  private sortByPriceAsc(): void {
    this.products.sort((a, b) => {
      const priceA = +a.product.price.replace(/\D/g, '');
      const priceB = +b.product.price.replace(/\D/g, '');
      return priceA - priceB;
    });
  }

  private sortByPriceDesc(): void {
    this.products.sort((a, b) => {
      const priceA = +a.product.price.replace(/\D/g, '');
      const priceB = +b.product.price.replace(/\D/g, '');
      return priceB - priceA;
    });
  }

  private init(): void {
    this.container.innerHTML = '';
    getIProducts({
      sort: this.sort,
      id: this.selectCategory ? this.selectCategory : undefined,
    })
      .then((productsResponse) => {
        this.products = productsResponse.map((product) => new ProductCard(product));
        if (this.sort === Sort.priceAsc) {
          this.sortByPriceAsc();
        }
        if (this.sort === Sort.priceDesc) {
          this.sortByPriceDesc();
        }
        this.products.forEach((product) => this.container.append(product.render()));
      })
      .catch((err) => {
        this.container.textContent = err.message;
      });
  }

  public render(): HTMLElement {
    const div = createElement('div', { class: 'catalog__container' });

    const categoriesHeader = createElement('div', { class: 'catalog__categories-header' });
    categoriesHeader.append(filters.render(), categories.render());
    const header = createElement('div', { class: 'catalog__header' });
    header.append(this.breadcrumb.render(), sortSelect.render());
    div.append(header, categoriesHeader, filters.renderMenu(), this.container);
    return div;
  }
}
