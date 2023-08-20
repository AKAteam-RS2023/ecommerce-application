import createElement from '../../dom-helper/create-element';
import { IPage } from '../../types/interfaces/page';

export class Home implements IPage {
  private homePageWrapper?: HTMLDivElement;

  public render(): HTMLDivElement {
    this.homePageWrapper = createElement('div', {
      class: 'home-page__wrapper',
    });
    return this.homePageWrapper;
  }
}
