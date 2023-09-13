import createElement from '../../dom-helper/create-element';
import { IPage } from '../../types/interfaces/page';

export class AboutUs implements IPage {
  private container: HTMLElement = createElement<HTMLDivElement>('div');

  public render(): HTMLElement {
    return this.container;
  }
}
