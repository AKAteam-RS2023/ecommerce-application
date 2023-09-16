import createElement from '../../dom-helper/create-element';

import './basket-error.scss';

class ShowBasketError {
  public errorMessage = createElement('div', {
    class: 'cart-error',
  });

  constructor() {
    this.initError();
  }

  private initError(): void {
    this.errorMessage.textContent = 'Something went wrong. Try again';
    document.body.append(this.errorMessage);
  }

  public showError(): void {
    this.errorMessage.classList.add('show');
    setTimeout(() => {
      this.errorMessage.classList.remove('show');
    }, 2000);
  }
}

export default new ShowBasketError();
