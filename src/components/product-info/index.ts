import createElement from '../../dom-helper/create-element';
import './product-info.scss';

export default class ProductInfo {
  private container = createElement('div');

  constructor(
    public id: string,
    public variantID?: string,
  ) {
    this.id = id;
    this.variantID = variantID;
  }

  public render(): HTMLElement {
    this.container.textContent = `About product ${this.id}`;
    return this.container;
  }
}
