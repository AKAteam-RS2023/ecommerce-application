import createElement from '../../dom-helper/create-element';
import ShowError from '../../dom-helper/show-error';

import { checkEmail, checkPassword } from '../../form-validation';

import { loginIfExist } from '../../controller/customers';

import hidePassword from '../../assets/image/hide-password.png';
import visiblePassword from '../../assets/image/visible-password.png';

import './login.scss';
import { IPage } from '../../types/interfaces/page';
import { getCartItemsCount } from '../../controller/get-cart-items-count';
// import Router from '../router/router';

export default class Login implements IPage {
  // private router = Router.instance;

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
    autocomplete: 'on',
  });

  private passwordBtn = createElement('div', { class: 'login__password--button' });

  private isVisiblePassword = true;

  private enter = createElement<HTMLButtonElement>('button', {
    class: 'login__submit',
    disabled: '',
  });

  private registrationLink = createElement('div', { class: 'login__link' });

  private emailErrorMessage = new ShowError('login__error', true);

  private passwordErrorMessage = new ShowError('login__error', true);

  private loginErrorMessage = new ShowError('authorization__error', false);

  constructor() {
    this.passwordBtn.addEventListener('click', this.toggleVisiblePassword);
    this.toggleVisiblePassword();
    this.initInputElement(this.email, this.emailErrorMessage, checkEmail);
    this.initInputElement(this.password, this.passwordErrorMessage, checkPassword);
    this.initEnter();
    this.initRegistrationLink();
  }

  private toggleDisabledEnter(): void {
    this.enter.disabled = this.emailErrorMessage.isError || this.passwordErrorMessage.isError;
  }

  private initRegistrationLink(): void {
    this.registrationLink.textContent = 'Have not had an account yet? Go to ';
    const link = createElement<HTMLAnchorElement>('a', { href: '/registration' });
    link.textContent = 'registration';
    this.registrationLink.append(link);
  }

  private initEnter(): void {
    this.enter.textContent = 'Enter';
    this.enter.addEventListener('click', async () => {
      try {
        await loginIfExist(this.email.value, this.password.value);
        getCartItemsCount();
        // this.router?.navigate('');
        document.querySelector<HTMLAnchorElement>('a[href="/"]')?.click();
      } catch (e) {
        if (!(e instanceof Error)) {
          return;
        }
        this.loginErrorMessage.show(e.message);
      }
    });
  }

  private initInputElement(
    input: HTMLInputElement,
    errorMessage: ShowError,
    cb: (value: string) => void,
  ): void {
    input.addEventListener('input', () => {
      input.classList.remove('invalid');
      this.loginErrorMessage.hide();
      try {
        cb(input.value);
        errorMessage.hide();
      } catch (e) {
        if (!(e instanceof Error)) {
          return;
        }
        input.classList.add('invalid');
        errorMessage.show(e.message);
      } finally {
        this.toggleDisabledEnter();
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

  private renderInput(type: string, input: HTMLInputElement, error: HTMLElement): HTMLElement {
    const wrapper = createElement('div', { class: `login__${type}` });
    const label = createElement('label', { class: `login__${type}--label`, for: input.id });
    label.textContent = type;
    wrapper.append(label, input, error);
    if (type === 'password') {
      wrapper.append(this.passwordBtn);
    }
    return wrapper;
  }

  public render(): HTMLElement {
    const form = createElement<HTMLFormElement>('form', { class: 'login', type: 'submit' });
    form.addEventListener('submit', (e): void => {
      e.preventDefault();
    });
    const wrapper = createElement('div', { class: 'login__wrapper' });
    wrapper.append(this.enter, this.registrationLink, this.loginErrorMessage.render());
    form.append(
      this.renderInput('email', this.email, this.emailErrorMessage.render()),
      this.renderInput('password', this.password, this.passwordErrorMessage.render()),
      wrapper,
    );
    return form;
  }
}
