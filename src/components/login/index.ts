import createElement from '../../dom-helper/create-element';
import ShowError from '../../dom-helper/show-error';

import { checkEmail, checkPassword } from '../../form-validation';

import hidePassword from '../../assets/image/hide-password.png';
import visiblePassword from '../../assets/image/visible-password.png';

import './login.scss';

export default class Login {
  private email = createElement<HTMLInputElement>('input', {
    class: 'login__email--input',
    type: 'text',
    id: 'email',
    placeholder: 'user@example.com',
  });

  private password = createElement<HTMLInputElement>('input', {
    class: 'login__password--input',
    type: 'text',
    id: 'password',
  });

  private passwordBtn = createElement('div', { class: 'login__password--button' });

  private isVisiblePassword = true;

  private enter = createElement('button', { class: 'login__submit' });

  private errorMessage = new ShowError('login__error');

  constructor() {
    this.passwordBtn.addEventListener('click', this.toggleVisiblePassword);
    this.toggleVisiblePassword();
    this.initEmail();
    this.initPassword();
    this.initEnter();
  }

  private initEnter(): void {
    this.enter.textContent = 'Enter';
  }

  private initEmail(): void {
    this.email.addEventListener('input', () => {
      const { left, top } = this.email.getBoundingClientRect();
      try {
        checkEmail(this.email.value);
        this.errorMessage.hide();
      } catch (e) {
        if (!(e instanceof Error)) {
          return;
        }
        this.errorMessage.show(e.message, { left, top });
      }
    });
  }

  private initPassword(): void {
    this.password.addEventListener('input', () => {
      const { left, top } = this.password.getBoundingClientRect();
      try {
        checkPassword(this.password.value);
        this.errorMessage.hide();
      } catch (e) {
        if (!(e instanceof Error)) {
          return;
        }
        this.errorMessage.show(e.message, { left, top });
      }
    });
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

  private renderInput(type: string, input: HTMLInputElement): HTMLElement {
    const wrapper = createElement('div', { class: `login__${type}` });
    const label = createElement('label', { class: `login__${type}--label`, for: input.id });
    label.textContent = type;
    wrapper.append(label, input);
    if (type === 'password') {
      wrapper.append(this.passwordBtn);
    }
    return wrapper;
  }

  public render(): HTMLElement {
    const container = createElement('div', { class: 'login' });
    container.append(
      this.renderInput('email', this.email),
      this.renderInput('password', this.password),
      this.enter,
    );
    return container;
  }
}
