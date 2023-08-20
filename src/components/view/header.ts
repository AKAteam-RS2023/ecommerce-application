import createElement from '../../dom-helper/create-element';

export class Header {
  private hasUser = !!localStorage.getItem('userToken');

  private header?: HTMLElement;

  private headerWrapper?: HTMLDivElement;

  private headerLogo?: HTMLDivElement;

  private linksWrapper?: HTMLDivElement;

  public render(): HTMLElement {
    this.header = createElement('header', {
      class: 'header',
    });

    this.headerWrapper = createElement('div', {
      class: 'header__wrapper',
    });

    this.renderLogo();
    this.renderLinks();

    if (this.headerLogo) {
      this.headerWrapper.append(this.headerLogo);
    }

    if (this.linksWrapper) {
      this.headerWrapper.append(this.linksWrapper);
    }

    this.header.append(this.headerWrapper);
    return this.header;
  }

  private renderLogo(): void {
    this.headerLogo = createElement('div', {
      class: 'header__logo',
    });

    const headerLogoLink = createElement('a', {
      class: 'logo__link',
      href: '/',
    });
    headerLogoLink.innerText = 'Furniro.';

    this.headerLogo.append(headerLogoLink);
  }

  private renderLinks(): void {
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
      href: this.hasUser ? '/' : '/login',
    });
    loginLink.innerText = 'Login';

    const logoutLink = createElement('a', {
      class: 'links__item link--login',
      href: '/login',
    });
    logoutLink.innerText = 'Logout';
    logoutLink.onclick = (): void => {
      localStorage.clear();
      // conf.client = null;
    };

    const registrationLink = createElement('a', {
      class: 'links__item link--registration',
      href: '/registration',
    });
    registrationLink.innerText = 'Registration';

    this.linksWrapper.append(homeLink, registrationLink, loginLink);
    if (this.hasUser) {
      this.linksWrapper.append(logoutLink);
    }
  }
}
