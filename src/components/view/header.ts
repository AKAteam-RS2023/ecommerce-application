import createElement from '../../dom-helper/create-element';
import conf from '../../sdk/create-client-user';

import '../../assets/image/cart.svg';

export class Header {
  private hasUser = !!localStorage.getItem('userToken');

  private header?: HTMLElement;

  private headerWrapper?: HTMLDivElement;

  private headerLogo?: HTMLDivElement;

  private linksWrapper?: HTMLDivElement;

  private homeLink = createElement('a', {
    class: 'links__item link--home active',
    href: '/',
  });

  private registrationLink = createElement('a', {
    class: 'links__item link--registration',
    href: this.hasUser ? '/' : '/registration',
  });

  private loginLink = createElement('a', {
    class: 'links__item link--login',
    href: '/login',
  });

  private catalogLink = createElement('a', {
    class: 'links__item link--catalog',
    href: '/catalog',
  });

  private profileLink = createElement('a', {
    class: 'links__item link--login',
    href: this.hasUser ? '/profile' : '/',
  });

  private basket = createElement('a', {
    class: 'links__item link--basket',
    href: '/basket',
  });

  private initBasket(): void {
    const img = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    img.classList.add('link--basket-img');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#cart');
    img.append(use);
    this.basket.append(img);
  }

  public toggleActive(): void {
    const url = window.location.href.split('/').pop();
    this.homeLink.classList.remove('active');
    this.loginLink.classList.remove('active');
    this.registrationLink.classList.remove('active');
    this.catalogLink.classList.remove('active');
    this.basket.classList.remove('active');
    switch (url) {
      case '': {
        this.homeLink.classList.add('active');
        break;
      }
      case 'login': {
        this.loginLink.classList.add('active');
        break;
      }
      case 'registration': {
        this.registrationLink.classList.add('active');
        break;
      }
      case 'catalog': {
        this.catalogLink.classList.add('active');
        break;
      }
      case 'profile': {
        this.profileLink.classList.add('active');
        break;
      }
      case 'basket': {
        this.basket.classList.add('active');
        break;
      }
      default:
    }
  }

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

    this.homeLink.innerText = 'Home';

    this.loginLink.innerText = 'Login';

    this.catalogLink.innerText = 'Catalog';

    this.profileLink.innerText = 'My profile';

    this.initBasket();

    const logoutLink = createElement('a', {
      class: 'links__item link--login',
      href: '/login',
    });
    logoutLink.innerText = 'Logout';
    logoutLink.onclick = (): void => {
      localStorage.clear();
      conf.client = null;
      conf.tokenCache.set({
        token: '',
        expirationTime: 0,
        refreshToken: '',
      });
    };
    this.registrationLink.innerText = 'Registration';

    this.linksWrapper.append(this.homeLink, this.catalogLink);
    if (this.hasUser) {
      this.linksWrapper.append(this.profileLink, logoutLink);
    } else {
      this.linksWrapper.append(this.registrationLink, this.loginLink);
    }
    this.linksWrapper.append(this.basket);
  }
}
