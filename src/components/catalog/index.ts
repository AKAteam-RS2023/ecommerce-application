import createElement from '../../dom-helper/create-element';
import ProductCard from '../product-card';

import getAllProducts from '../../controller/get-all-products';
import Categories from '../categories/categories';

import './catalog.scss';

export default class Catalog {
  private container = createElement('section', { class: 'catalog' });

  private categories = new Categories();

  private products: ProductCard[] | null = null;

  constructor() {
    this.init();
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
    const div = createElement('div');
    div.append(this.categories.render(), this.container);
    return div;
  }
}
