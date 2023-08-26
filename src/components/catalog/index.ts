import createElement from '../../dom-helper/create-element';
import Product from '../product';
import './catalog.scss';

import { getProducts } from '../../services/ecommerce-api';

export default class Catalog {
  private container = createElement('section', { class: 'catalog' });

  private products: Product[] | null = null;

  private init(): void {
    getProducts().then((productsResponse) => {
      if (!Array.isArray(productsResponse)) {
        this.container.textContent = productsResponse;
        return;
      }
      this.products = productsResponse.map((product) => new Product(product));
      this.products?.forEach((product) => this.container.append(product.render()));
    });
  }

  public render(): HTMLElement {
    this.container.innerHTML = '';
    this.init();
    return this.container;
  }
}
