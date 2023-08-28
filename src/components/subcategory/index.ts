import createElement from '../../dom-helper/create-element';

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

  public render(): HTMLElement {
    return this.subCategory;
  }
}
