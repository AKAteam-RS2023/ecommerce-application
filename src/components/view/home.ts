import createElement from '../../dom-helper/create-element';
import { IPage } from '../../types/interfaces/page';

export class Home implements IPage {
  private linkWrapper?: HTMLDivElement;

  public render(): HTMLDivElement {
    this.linkWrapper = createElement('div');
    this.linkWrapper.innerHTML = '<a href="/login">Login</a>';
    return this.linkWrapper;
  }
}
