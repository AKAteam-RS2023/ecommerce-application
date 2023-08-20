import createElement from '../../dom-helper/create-element';
import { IPage } from '../../types/interfaces/page';

export class Home implements IPage {
  private linksWrapper?: HTMLDivElement;

  public render(): HTMLDivElement {
    this.linksWrapper = createElement('div', {
      class: 'links__wrapper',
    });

    const homeLink = createElement('a', {
      class: 'links__item link--home',
      href: '/',
    });
    homeLink.innerText = 'Home';

    const loginLink = createElement('a', {
      class: 'links__item link--login',
      href: '/login',
    });
    loginLink.innerText = 'Login';

    const registrationLink = createElement('a', {
      class: 'links__item link--registration',
      href: '/registration',
    });
    registrationLink.innerText = 'Registration';

    this.linksWrapper.append(homeLink, loginLink, registrationLink);
    return this.linksWrapper;
  }
}
