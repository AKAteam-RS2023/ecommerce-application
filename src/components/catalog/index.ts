import createElement from '../../dom-helper/create-element';
import eventEmitter from '../../dom-helper/event-emitter';

import ProductCard from '../product-card';
import Categories from '../categories/categories';

import getAllProducts from '../../controller/get-all-products';
import getProductsbyCategory from '../../controller/get-products-by-category';

import './catalog.scss';

export default class Catalog {
  private container = createElement('section', { class: 'catalog' });

  private categories = new Categories();

  private products: ProductCard[] = [];

  private breadcrumb = createElement('div', { class: 'catalog__breadcrumb' });

  constructor() {
    this.initBreadCrumb();
    this.init();
    eventEmitter.subscribe('event: change-category', (id: string) => {
      this.initByCategory(id);
    });
  }

  private initBreadCrumb(): void {
    this.breadcrumb.textContent = 'catalog >';
  }

  private init(): void {
    this.container.innerHTML = '';
    getAllProducts()
      .then((productsResponse) => {
        this.products = productsResponse.map((product) => new ProductCard(product));

        this.products?.forEach((product) => this.container.append(product.render()));
      })
      .catch((err) => {
        this.container.textContent = err.message;
      });
  }

  private initByCategory(id: string): void {
    this.container.innerHTML = '';
    getProductsbyCategory(id)
      .then((productsResponse) => {
        this.products = productsResponse.map((product) => new ProductCard(product));

        this.products?.forEach((product) => this.container.append(product.render()));
      })
      .catch((err) => {
        this.container.textContent = err.message;
      });
  }

  public render(): HTMLElement {
    const div = createElement('div', { class: 'catalog__container' });
    div.append(this.breadcrumb, this.categories.render(), this.container);
    return div;
  }
}
