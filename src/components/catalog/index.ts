import createElement from '../../dom-helper/create-element';
import ProductCard from '../product-card';

import getAllProducts from '../../controller/get-all-products';
import Categories from '../categories/categories';

import './catalog.scss';

export default class Catalog {
  private container = createElement('section', { class: 'catalog' });

  private categories = new Categories();

  private products: ProductCard[] | null = null;

  private breadcrumb = createElement('div', { class: 'catalog__breadcrumb' });

  constructor() {
    this.initBreadCrumb();
    this.init();
  }

  private initBreadCrumb(): void {
    this.breadcrumb.textContent = 'catalog >';
  }

  private init(): void {
    getAllProducts()
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
