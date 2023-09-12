import createElement from '../../dom-helper/create-element';
import eventEmitter from '../../dom-helper/event-emitter';

import ProductCard from '../product-card';
import breadCrumb from '../breadcrumb';
import categories from '../categories';

import filters from '../filters';
import sortSelect from '../sort-select';

import getIProducts from '../../controller/get-products';

import Sort from '../../types/sort';

import './catalog.scss';
import Search from '../search/search';

export default class Catalog {
  private container = createElement('section', { class: 'catalog' });

  private AllWasShow = createElement('div', { class: 'all-products-show' });

  private showMoreContainer?: HTMLDivElement;

  private products: ProductCard[] = [];

  private sort: Sort = sortSelect.value;

  private searchQuery?: string;

  private search: Search = new Search();

  private limitOnPage = 5;

  private offset = 0;

  private isCleaning = true;

  private total?: number;

  constructor() {
    this.AllWasShow.textContent = 'To są wszystkie towary';
    this.updateProductsContainer();
    eventEmitter.subscribe('event: change-category', (data) => {
      if (!data || !('id' in data)) {
        return;
      }
      categories.selectCategory = data.id;
      this.updateProductsContainer();
    });
    eventEmitter.subscribe('event: show-all-products', () => {
      if (!categories.selectCategory) {
        return;
      }
      categories.selectCategory = null;
      this.updateProductsContainer();
    });
    eventEmitter.subscribe('event: select-sort', (data) => {
      if (!data || !('sort' in data)) {
        return;
      }
      this.sort = data.sort as Sort;
      this.updateProductsContainer();
    });
    eventEmitter.subscribe('event: change-products', () => {
      this.updateProductsContainer();
    });
    eventEmitter.subscribe('event: search', (data) => {
      if (!data || !('searchQuery' in data)) {
        return;
      }
      if (this.searchQuery === data.searchQuery) {
        return;
      }
      this.searchQuery = data.searchQuery;
      this.updateProductsContainer();
    });
  }

  private updateProductsContainer(): void {
    this.isCleaning = true;
    this.offset = 0;
    this.init();
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
    if (this.isCleaning) {
      this.container.innerHTML = '';
    }
    getIProducts({
      limit: this.limitOnPage,
      offset: this.offset,
      sort: this.sort,
      categoryId: categories.selectCategory ? categories.selectCategory : undefined,
      filters: filters.filters,
      searchQuery: this.searchQuery,
    })
      .then((productsResponse) => {
        this.products = productsResponse.results.map((product) => new ProductCard(product));
        this.total = productsResponse.total;
        this.catalogRender();
      })
      .catch((err) => {
        this.container.textContent = err.message;
      });
  }

  private catalogRender():void {
    if (this.sort === Sort.priceAsc) {
      this.sortByPriceAsc();
    }
    if (this.sort === Sort.priceDesc) {
      this.sortByPriceDesc();
    }
    if (this.total === 0) this.container.textContent = 'Brak towarów';
    this.products.forEach((product) => this.container.append(product.render()));
    this.offset += this.limitOnPage;
    if (this.total && this.offset < this.total) {
      this.showMoreContainer = createElement('div', { class: 'show-more__container product' });
      this.showMoreContainer.textContent = 'Pokazać więcej towarów';
      this.container.append(this.showMoreContainer);
      this.showMoreContainer.addEventListener('click', () => {
        this.showMoreContainer?.remove();
        this.isCleaning = false;
        this.init();
      });
    } else this.container.append(this.AllWasShow);
  }

  public render(): HTMLElement {
    const div = createElement('div', { class: 'catalog__container' });
    const categoriesHeader = createElement('div', { class: 'catalog__categories-header' });
    categoriesHeader.append(filters.render(), categories.render());
    const header = createElement('div', { class: 'catalog__header' });
    header.append(breadCrumb.render(), this.search.render(), sortSelect.render());
    div.append(header, categoriesHeader, filters.renderMenu(), this.container);
    return div;
  }
}
