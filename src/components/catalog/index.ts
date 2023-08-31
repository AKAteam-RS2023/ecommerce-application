import createElement from '../../dom-helper/create-element';
import eventEmitter from '../../dom-helper/event-emitter';

import ProductCard from '../product-card';
import BreadCrumb from '../breadcrumb';
import categories from '../categories';
import sortSelect from '../sort-select';

import getAllProducts from '../../controller/get-all-products';
import getProductsbyCategory from '../../controller/get-products-by-category';

import './catalog.scss';
import { Sort } from '../../types/sort';

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
      this.initByCategory(data.id);
    });
    eventEmitter.subscribe('event: show-all-products', () => {
      if (!this.selectCategory) {
        return;
      }
      this.init();
    });
    eventEmitter.subscribe('event: select-sort', (data) => {
      if (!data || !('sort' in data)) {
        return;
      }
      this.sort = data.sort as Sort;
      this.init();
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
    this.products = [];
    this.selectCategory = null;
    getAllProducts(this.sort)
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

  private initByCategory(id: string): void {
    if (this.selectCategory && id === this.selectCategory) {
      return;
    }
    this.container.innerHTML = '';
    this.products = [];
    getProductsbyCategory(id)
      .then((productsResponse) => {
        this.products = productsResponse.map((product) => new ProductCard(product));
        this.products.forEach((product) => this.container.append(product.render()));
        this.selectCategory = id;
      })
      .catch((err) => {
        this.container.textContent = err.message;
      });
  }

  public render(): HTMLElement {
    const div = createElement('div', { class: 'catalog__container' });
    div.append(sortSelect.render(), this.breadcrumb.render(), categories.render(), this.container);
    return div;
  }
}
