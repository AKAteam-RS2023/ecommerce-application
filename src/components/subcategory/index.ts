import createElement from '../../dom-helper/create-element';

import './subcategory.scss';

export default class SubCategory {
  private subCategory = createElement('div', { class: 'subcategory' });

  constructor(
    public id: string,
    public name: string,
  ) {
    this.id = id;
    this.name = name;
    this.init();
  }

  private init(): void {
    this.subCategory.textContent = this.name;
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
