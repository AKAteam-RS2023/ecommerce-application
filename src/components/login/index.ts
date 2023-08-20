import createElement from '../../dom-helper/create-element';
import ShowError from '../../dom-helper/show-error';

import { checkEmail, checkPassword } from '../../form-validation';

import { loginIfExist } from '../../controller/customers';

import hidePassword from '../../assets/image/hide-password.png';
import visiblePassword from '../../assets/image/visible-password.png';

import './login.scss';
import { IPage } from '../../types/interfaces/page';

export default class Login implements IPage {
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

  private enter = createElement<HTMLButtonElement>('button', {
    class: 'login__submit',
    disabled: '',
  });

  private emailErrorMessage = new ShowError('login__error', true);

  private passwordErrorMessage = new ShowError('login__error', true);

  private loginErrorMessage = new ShowError('authorization__error', false);

  private hasUser = !!localStorage.getItem('userToken');

  constructor() {
    this.passwordBtn.addEventListener('click', this.toggleVisiblePassword);
    this.toggleVisiblePassword();
    this.initInputElement(this.email, this.emailErrorMessage, checkEmail);
    this.initInputElement(this.password, this.passwordErrorMessage, checkPassword);
    this.initEnter();
  }

  private toggleDisabledEnter(): void {
    this.enter.disabled = this.emailErrorMessage.isError || this.passwordErrorMessage.isError;
  }

  private initEnter(): void {
    this.enter.textContent = 'Enter';
    this.enter.addEventListener('click', async () => {
      try {
        await loginIfExist(this.email.value, this.password.value);
        window.location.href = '/';
      } catch (e) {
        if (!(e instanceof Error)) {
          return;
        }
        const { right, bottom } = this.enter.getBoundingClientRect();
        this.loginErrorMessage.show(e.message, { right: right + 15, bottom });
      }
    });
  }

  private initInputElement(
    input: HTMLInputElement,
    erorrMessage: ShowError,
    cb: (value: string) => void,
  ): void {
    input.addEventListener('input', () => {
      input.classList.remove('invalid');
      this.loginErrorMessage.hide();
      const { right, bottom } = input.getBoundingClientRect();
      try {
        cb(input.value);
        erorrMessage.hide();
      } catch (e) {
        if (!(e instanceof Error)) {
          return;
        }
        input.classList.add('invalid');
        erorrMessage.show(e.message, { right, bottom });
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
    const form = createElement<HTMLFormElement>('form', { class: 'login', type: 'submit' });
    form.addEventListener('submit', (e): void => {
      e.preventDefault();
    });
    form.append(
      this.renderInput('email', this.email),
      this.renderInput('password', this.password),
      this.enter,
    );
    return form;
  }
}
