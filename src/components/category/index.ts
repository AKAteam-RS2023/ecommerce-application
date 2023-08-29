import createElement from '../../dom-helper/create-element';
import eventEmitter from '../../dom-helper/event-emitter';

import { getSubCategories } from '../../controller/get-subcategories';

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
    eventEmitter.subscribe('event: hide-subcategories', (data) => {
      if (!data || !('parentId' in data)) {
        return;
      }
      this.hideSubCategories();
      if (this.id === data.parentId) {
        setTimeout(() => eventEmitter.emit('event: change-category', { id: data.id }), 500);
      }
    });
  }

  private showSubCategories = (): void => {
    this.categoryIcon.classList.add('active');
    this.wrapperSubCategries.classList.add('active');
    this.categoryTitle.classList.add('active');
  };

  private hideSubCategories = (): void => {
    this.categoryIcon.classList.remove('active');
    this.wrapperSubCategries.classList.remove('active');
    this.categoryTitle.classList.remove('active');
  };

  private toggleShowingSubCategories = (): void => {
    if (this.categoryIcon.classList.contains('active')) {
      this.hideSubCategories();
    } else {
      this.showSubCategories();
    }
  };

  private renderTitle(): HTMLElement {
    const wrapper = createElement('div', { class: 'category__title' });
    this.categoryTitle.textContent = this.name;
    wrapper.append(this.categoryTitle, this.categoryIcon);
    return wrapper;
  }

  private init(): void {
    this.categoryTitle.onclick = (e): void => {
      e.stopPropagation();
      this.hideSubCategories();
      eventEmitter.emit('event: change-category', { id: this.id });
    };
    this.categoryIcon.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleShowingSubCategories();
    });
    this.container.append(this.renderTitle());
    getSubCategories(this.id).then((res) => {
      res.forEach((item) => this.categories.push(new SubCategory(item)));
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
