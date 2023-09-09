import createElement from '../../dom-helper/create-element';
import conf from '../../sdk/create-client-user';

import '../../assets/image/cart.svg';

export class Header {
  private header?: HTMLElement;

  private headerWrapper?: HTMLDivElement;

  private headerLogo?: HTMLDivElement;

  private hasUser = !!localStorage.getItem('userToken');

  private linksWrapper = createElement('div', {
    class: 'links__wrapper',
  });

  private homeLink = createElement('a', {
    class: 'links__item link--home active',
    href: '/',
  });

  private registrationLink = createElement('a', {
    class: 'links__item link--registration',
    href: '/registration',
  });

  private loginLink = createElement('a', {
    class: 'links__item link--login',
    href: '/login',
  });

  private logoutLink = createElement('a', {
    class: 'links__item link--login',
    href: '/login',
  });

  private catalogLink = createElement('a', {
    class: 'links__item link--catalog',
    href: '/catalog',
  });

  private profileLink = createElement('a', {
    class: 'links__item link--login',
    href: '/profile',
  });

  private basket = createElement('a', {
    class: 'links__item link--basket',
    href: '/basket',
  });

  constructor() {
    this.initLinks();
  }

  private initBasket(): void {
    const img = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    img.classList.add('link--basket-img');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#cart');
    img.append(use);
    img.onclick = (e): void => {
      e.preventDefault();
      const target = e.target as Element;
      const anchor = target.closest('a');
      if (anchor) {
        anchor.click();
      }
    };
    this.basket.append(img);
  }

  public toggleActive(): void {
    const url = window.location.href.split('/').pop();
    this.homeLink.classList.remove('active');
    this.loginLink.classList.remove('active');
    this.registrationLink.classList.remove('active');
    this.catalogLink.classList.remove('active');
    this.basket.classList.remove('active');
    this.profileLink.classList.remove('active');
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
    this.renderLinks();
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

  private initLinks(): void {
    this.homeLink.innerText = 'Home';

    this.loginLink.innerText = 'Login';

    this.catalogLink.innerText = 'Catalog';

    this.profileLink.innerText = 'My profile';

    this.initBasket();

    this.logoutLink.innerText = 'Logout';
    this.logoutLink.onclick = (): void => {
      localStorage.clear();
      this.hasUser = false;
      conf.client = null;
      conf.tokenCache.set({
        token: '',
        expirationTime: 0,
        refreshToken: '',
      });
    };
    this.registrationLink.innerText = 'Registration';
  }

  private renderLinks(): void {
    this.hasUser = !!localStorage.getItem('userToken');
    this.linksWrapper.innerHTML = '';
    this.linksWrapper.append(this.homeLink, this.catalogLink);
    if (this.hasUser) {
      this.linksWrapper.append(this.profileLink, this.logoutLink);
    } else {
      this.linksWrapper.append(this.registrationLink, this.loginLink);
    }
    this.linksWrapper.append(this.basket);
  }
}
