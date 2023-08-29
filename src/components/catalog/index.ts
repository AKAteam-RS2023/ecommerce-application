import createElement from '../../dom-helper/create-element';
import ProductCard from '../product-card';
import './catalog.scss';

import getAllProducts from '../../controller/get-all-products';

export default class Catalog {
  private container = createElement('section', { class: 'catalog' });

  private products: ProductCard[] | null = null;

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
    this.container.innerHTML = '';
    this.init();
    return this.container;
  }
}
