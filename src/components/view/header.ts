import createElement from '../../dom-helper/create-element';
import { IPage } from '../../types/interfaces/page';

export class Header implements IPage {
  private header?: HTMLElement;

  private headerWrapper?: HTMLDivElement;

  private headerLogo?: HTMLDivElement;

  private headerLogoLink?: HTMLElement;

  public render(): HTMLElement {
    this.header = createElement('header', {
      class: 'header',
    });

    this.headerWrapper = createElement('div', {
      class: 'header__wrapper',
    });

    this.headerLogo = createElement('div', {
      class: 'header__logo',
    });

    this.headerLogoLink = createElement('a', {
      class: 'logo__link',
      href: '/',
    });

    this.headerLogoLink.innerText = 'Funiro.';
    this.headerLogo.append(this.headerLogoLink);
    this.headerWrapper.append(this.headerLogo);
    this.header.append(this.headerWrapper);
    return this.header;
  }
}
