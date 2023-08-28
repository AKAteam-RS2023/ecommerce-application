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
      .then((res) => {
        const categories = res.filter((item) => !item.parent);
        categories.forEach((item) => {
          const category = createElement('div', { class: 'categories__item' });
          category.textContent = item.name['en-US'];
          const subCategories = res.filter((elem) => elem.parent?.id === item.id);
          subCategories.forEach((elem) => {
            const subCategory = createElement('div', { class: 'categories__item--sub' });
            subCategory.textContent = elem.name['en-US'];
            category.append(subCategory);
          });
          this.container.append(category);
        });
      })
      .catch(() => this.container.append('No categories'));
  }

  public render(): HTMLElement {
    return this.container;
  }
}
