import createElement from '../../dom-helper/create-element';
import { getCategories } from '../../services/ecommerce-api';
import './categories.scss';

export default class Categories {
  private container = createElement('div', { class: 'categories' });

  constructor() {
    this.init();
  }

  private init(): void {
    getCategories()
      .then(() => this.container.append('Categories'))
      .catch(() => this.container.append('No categories'));
  }

  public render(): HTMLElement {
    return this.container;
  }
}
