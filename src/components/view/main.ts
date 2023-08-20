import createElement from '../../dom-helper/create-element';

export class MainSection {
  private main?: HTMLElement;

  public mainWrapper?: HTMLDivElement;

  public render(): HTMLElement {
    this.main = createElement('main', {
      class: 'main',
    });
    this.mainWrapper = createElement('div', {
      class: 'main__wrapper',
    });
    this.main.append(this.mainWrapper);
    return this.main;
  }
}
