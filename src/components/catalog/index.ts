import createElement from '../../dom-helper/create-element';
import eventEmitter from '../../dom-helper/event-emitter';

import ProductCard from '../product-card';
import BreadCrumb from '../breadcrumb';
import categories from '../categories';

import getAllProducts from '../../controller/get-all-products';
import getProductsbyCategory from '../../controller/get-products-by-category';

import './catalog.scss';
import Filters from '../filters';

export default class Catalog {
  private container = createElement('section', { class: 'catalog' });

  private products: ProductCard[] = [];

  private breadcrumb = new BreadCrumb();

  private filters = new Filters();

  private selectCategory: string | null = null;

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
  }

  private init(): void {
    this.container.innerHTML = '';
    this.products = [];
    this.selectCategory = null;
    getAllProducts()
      .then((productsResponse) => {
        this.products = productsResponse.map((product) => new ProductCard(product));
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
    const header = createElement('div', { class: 'catalog__categories-header' });
    header.append(this.filters.render(), categories.render());
    div.append(this.breadcrumb.render(), header, this.filters.renderMenu(), this.container);
    return div;
  }
}
