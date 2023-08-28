import { getSubCategories } from '../../controller/get-subcategories';
import createElement from '../../dom-helper/create-element';
import SubCategory from '../subcategory';

import arrowImg from '../../assets/image/arrow.png';

import './category.scss';

export default class Category {
  private container = createElement('div', { class: 'category' });

  private categoryTitle = createElement('div', { class: 'category__title--name' });

  private categoryIcon = createElement<HTMLImageElement>('img', {
    class: 'category__title--icon',
    src: arrowImg,
    alt: 'arrow',
  });

  private wrapperSubCategries = createElement('div', { class: 'category__wrapper' });

  public categories: SubCategory[] = [];

  constructor(
    public id: string,
    public name: string,
  ) {
    this.id = id;
    this.name = name;
    this.init();
  }

  private toggleShowingSubCategories = (): void => {
    if (this.categoryIcon.classList.contains('active')) {
      this.categoryIcon.classList.remove('active');
      this.wrapperSubCategries.classList.remove('active');
      this.categoryTitle.classList.remove('active');
    } else {
      this.categoryIcon.classList.add('active');
      this.wrapperSubCategries.classList.add('active');
      this.categoryTitle.classList.add('active');
    }
  };

  private renderTitle(): HTMLElement {
    const wrapper = createElement('div', { class: 'category__title' });
    this.categoryTitle.textContent = this.name;
    wrapper.append(this.categoryTitle, this.categoryIcon);
    return wrapper;
  }

  private init(): void {
    this.categoryIcon.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleShowingSubCategories();
    });
    this.container.append(this.renderTitle());
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
