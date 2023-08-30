import createElement from '../../dom-helper/create-element';
import eventEmitter from '../../dom-helper/event-emitter';
import { ISubCategory } from '../../types/category';

import './subcategory.scss';

export default class SubCategory {
  private subCategory = createElement('div', { class: 'subcategory' });

  constructor(public data: ISubCategory) {
    this.data = data;
    this.init();
  }

  private init(): void {
    this.subCategory.textContent = this.data.name;
    this.subCategory.onclick = (e): void => {
      e.stopPropagation();
      eventEmitter.emit('event: hide-subcategories', {
        id: this.data.id,
        parentId: this.data.parent,
      });
    };
  }

  public show(): void {
    this.subCategory.classList.add('active');
  }

  public hide(): void {
    this.subCategory.classList.remove('active');
  }

  public render(): HTMLElement {
    return this.subCategory;
  }
}
