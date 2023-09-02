import createElement from '../../dom-helper/create-element';
import hidePassword from '../../assets/image/hide-password.png';

import visiblePassword from '../../assets/image/visible-password.png';

export class PasswordBtn {
  private passwordBtn: HTMLElement = createElement('div', {
    class: 'modal__changepassword--button',
  });

  private password: HTMLInputElement;

  private isVisiblePassword = true;

  constructor(password: HTMLInputElement) {
    this.password = password;
    this.passwordBtn.addEventListener('click', this.toggleVisiblePassword);
    this.toggleVisiblePassword();
  }

  public render(): HTMLElement {
    return this.passwordBtn;
  }

  private toggleVisiblePassword = (): void => {
    this.isVisiblePassword = !this.isVisiblePassword;
    this.passwordBtn.innerHTML = '';
    const buttonImage = createElement<HTMLImageElement>('img');
    if (this.isVisiblePassword) {
      buttonImage.src = visiblePassword;
      buttonImage.alt = 'password is visible';
      this.password.type = 'text';
    } else {
      buttonImage.src = hidePassword;
      buttonImage.alt = 'password is hidden';
      this.password.type = 'password';
    }
    this.passwordBtn.append(buttonImage);
  };
}
