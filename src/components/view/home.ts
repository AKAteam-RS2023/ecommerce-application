import createElement from '../../dom-helper/create-element';
import { IPage } from '../../types/interfaces/page';

export class Home implements IPage {
  private linksWrapper?: HTMLDivElement;

  // private hasUser = !!localStorage.getItem('userToken');

  public render(): HTMLDivElement {
    this.linksWrapper = createElement('div', {
      class: 'home-links__wrapper',
    });

    const homeLink = createElement('a', {
      class: 'home-links__item link--home',
      href: '/',
    });
    homeLink.innerText = 'Home';

    const loginLink = createElement('a', {
      class: 'home-links__item link--login',
      href: '/login',
    //  href: this.hasUser ? '/' : '/login',
    });
    loginLink.innerText = 'Login';

    const registrationLink = createElement('a', {
      class: 'home-links__item link--registration',
      href: '/registration',
    });
    registrationLink.innerText = 'Registration';

    this.linksWrapper.append(homeLink, registrationLink, loginLink);
    return this.linksWrapper;
  }
}
