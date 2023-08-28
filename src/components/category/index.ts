import { getSubCategories } from '../../controller/get-subcategories';
import createElement from '../../dom-helper/create-element';
import SubCategory from '../subcategory';

export default class Category {
  private container = createElement('div', { class: 'category' });

  private categoryElement = createElement('div', { class: 'category__title' });

  private wrapperSubCategries = createElement('div', { class: 'categories__wrapper' });

  public categories: SubCategory[] = [];

  constructor(
    public id: string,
    public name: string,
  ) {
    this.id = id;
    this.name = name;
    this.init();
  }

  private init(): void {
    this.categoryElement.textContent = this.name;
    this.container.append(this.categoryElement);
    getSubCategories(this.id).then((res) => {
      res.forEach((item) => this.categories.push(new SubCategory(item.id, item.name)));
      this.categories.forEach((item) => {
        this.wrapperSubCategries.append(item.render());
      });
      this.container.append(this.wrapperSubCategries);
    });
  }

  public render(): HTMLElement {
    return this.container;
  }
}
