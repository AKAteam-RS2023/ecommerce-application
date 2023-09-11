import createElement from '../../dom-helper/create-element';

export class MainSection {
  private main = createElement('main', {
    class: 'main',
  });

  public mainWrapper = createElement('div', {
    class: 'main__wrapper',
  });

  public render(): HTMLElement {
    this.main.append(this.mainWrapper);
    return this.main;
  }
}
