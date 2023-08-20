import createElement from '../../dom-helper/create-element';
import { IPage } from '../../types/interfaces/page';

export class Footer implements IPage {
  private footer?: HTMLElement;

  private footerWrapper?: HTMLDivElement;

  private footerLogo?: HTMLDivElement;

  private footerLogoLink?: HTMLElement;

  private footerCopyright?: HTMLElement;

  public render(): HTMLElement {
    this.footer = createElement('footer', {
      class: 'footer',
    });

    this.footerWrapper = createElement('div', {
      class: 'footer__wrapper',
    });

    this.footerLogo = createElement('div', {
      class: 'footer__logo',
    });

    this.footerLogoLink = createElement('a', {
      class: 'logo__link',
      href: '/',
    });

    this.footerCopyright = createElement('div', {
      class: 'footer__copyright',
    });
    this.footerCopyright.innerText = '2023 furino. All rights reverved';

    this.footerLogoLink.innerText = 'Funiro.';
    this.footerLogo.append(this.footerLogoLink);
    this.footerWrapper.append(this.footerLogo, this.footerCopyright);
    this.footer.append(this.footerWrapper);
    return this.footer;
  }
}
