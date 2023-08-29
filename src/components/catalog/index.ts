import createElement from '../../dom-helper/create-element';
import eventEmitter from '../../dom-helper/event-emitter';

import ProductCard from '../product-card';
import Categories from '../categories/categories';
import BreadCrumb from '../breadcrumb/breadcrumb';

import getAllProducts from '../../controller/get-all-products';
import getProductsbyCategory from '../../controller/get-products-by-category';

import './catalog.scss';

export default class Catalog {
  private container = createElement('section', { class: 'catalog' });

  private categories = new Categories();

  private products: ProductCard[] = [];

  private breadcrumb = new BreadCrumb();

  constructor() {
    this.init();
    eventEmitter.subscribe('event: change-category', (data) => {
      if (!data || !('id' in data)) {
        return;
      }
      this.initByCategory(data.id);
    });
  }

  private init(): void {
    this.container.innerHTML = '';
    this.products = [];
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
    this.container.innerHTML = '';
    this.products = [];
    getProductsbyCategory(id)
      .then((productsResponse) => {
        this.products = productsResponse.map((product) => new ProductCard(product));
        this.products.forEach((product) => this.container.append(product.render()));
      })
      .catch((err) => {
        this.container.textContent = err.message;
      });
  }

  public render(): HTMLElement {
    const div = createElement('div', { class: 'catalog__container' });
    div.append(this.breadcrumb.render(), this.categories.render(), this.container);
    return div;
  }
}
