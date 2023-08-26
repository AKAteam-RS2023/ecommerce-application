import createElement from '../../dom-helper/create-element';
import './catalog.scss';

export default class Catalog {
  private container = createElement('div', { class: 'catalog' });

  public render(): HTMLElement {
    return this.container;
  }
}
