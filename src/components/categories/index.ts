import { getICategories } from '../../controller/get-categories';
import createElement from '../../dom-helper/create-element';
import Category from '../category';

import './categories.scss';

class Categories {
  private container = createElement('div', { class: 'categories' });

  private categories: Category[] = [];

  public selectCategory: string | null = null;

  constructor() {
    this.init();
  }

  private init(): void {
    getICategories()
      .then((res) => {
        res.forEach((item) => {
          this.categories.push(new Category(item.id, item.name));
        });
        this.categories.forEach((item) => this.container.append(item.render()));
      })
      .catch(() => this.container.append('No categories'));
  }

  public render(): HTMLElement {
    return this.container;
  }
}

export default new Categories();
