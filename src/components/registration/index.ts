import createElement from '../../dom-helper/create-element';

import hidePassword from '../../assets/image/hide-password.png';

import visiblePassword from '../../assets/image/visible-password.png';

import './registration.scss';

import { ElementValidator } from './validation/validate';
import validateEmail from './validation/validate-email';
import validatePassword from './validation/validate-password';
import validateName from './validation/validate-name';
import validateBirthdate from './validation/validate-birthdate';

class Registration {
  private email = createElement<HTMLInputElement>('input', {
    class: 'registration__email--input',
    type: 'text',
    id: 'email',
    placeholder: 'user@example.com',
  });

  private emailError = createElement<HTMLElement>('div', {
    class: 'registration__email--error',
  });

  private password = createElement<HTMLInputElement>('input', {
    class: 'registration__password--input',
    type: 'text',
    id: 'password',
  });

  private passwordError = createElement<HTMLElement>('div', {
    class: 'registration__password--error',
  });

  private passwordBtn = createElement('div', { class: 'registration__password--button' });

  private isVisiblePassword = true;

  private firstname = createElement<HTMLInputElement>('input', {
    class: 'registration__firstname--input',
    type: 'text',
    id: 'firstname',
  });

  private firstnameError = createElement<HTMLElement>('div', {
    class: 'registration__firstname--error',
  });

  private lastname = createElement<HTMLInputElement>('input', {
    class: 'registration__lastname--input',
    type: 'text',
    id: 'lastname',
  });

  private lastnameError = createElement<HTMLElement>('div', {
    class: 'registration__lastname--error',
  });

  private birthdate = createElement<HTMLInputElement>('input', {
    class: 'registration__birthdate--input',
    type: 'date',
    id: 'birthdate',
    placeholder: 'DD-MM-YYYY',
  });

  private birthdateError = createElement<HTMLElement>('div', {
    class: 'registration__birthdate--error',
  });

  private address = createElement<HTMLElement>('div', {
    class: 'registration__address',
  });

  private initAddress(): void {
    this.address.textContent = 'Adress';
  }

  private country = createElement<HTMLInputElement>('input', {
    class: 'registration__country--input',
    type: 'text',
    id: 'country',
  });

  private countryError = createElement<HTMLElement>('div', {
    class: 'registration__country--error',
  });

  private postcode = createElement<HTMLInputElement>('input', {
    class: 'registration__postcode--input',
    type: 'text',
    id: 'postcode',
    placeholder: 'XX-XXX',
  });

  private postcodeError = createElement<HTMLElement>('div', {
    class: 'registration__postcode--error',
  });

  private city = createElement<HTMLInputElement>('input', {
    class: 'registration__city--input',
    type: 'text',
    id: 'city',
  });

  private cityError = createElement<HTMLElement>('div', {
    class: 'registration__city--error',
  });

  private street = createElement<HTMLInputElement>('input', {
    class: 'registration__street--input',
    type: 'text',
    id: 'street',
  });

  private streetError = createElement<HTMLElement>('div', {
    class: 'registration__street--error',
  });

  private enter = createElement('button', { class: 'registration__submit' });

  private emailValidator: ElementValidator = new ElementValidator(
    this.email,
    this.emailError,
    validateEmail,
  );

  private passwordValidator: ElementValidator = new ElementValidator(
    this.password,
    this.passwordError,
    validatePassword,
  );

  private firstnameValidator: ElementValidator = new ElementValidator(
    this.firstname,
    this.firstnameError,
    validateName,
  );

  private lastnameValidator: ElementValidator = new ElementValidator(
    this.lastname,
    this.lastnameError,
    validateName,
  );

  private birthdateValidator: ElementValidator = new ElementValidator(
    this.birthdate,
    this.birthdateError,
    validateBirthdate,
  );

  constructor() {
    this.passwordBtn.addEventListener('click', this.toggleVisiblePassword);
    this.toggleVisiblePassword();
    this.initEnter();
    this.initAddress();
  }

  private initEnter(): void {
    this.enter.textContent = 'Register';
    this.enter.addEventListener('click', this.validateInputs);
  }

  private validateInputs = (): void => {
    this.emailValidator.validate();
    this.passwordValidator.validate();
    this.firstnameValidator.validate();
    this.lastnameValidator.validate();
    this.birthdateValidator.validate();
  };

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
    const className = type.toLocaleLowerCase().replace(' ', '_');
    const wrapper = createElement('div', { class: `registration__${className}` });
    const label = createElement('label', {
      class: `registration__${className}--label`,
      for: input.id,
    });
    label.textContent = type;
    wrapper.append(label, input);
    if (className === 'password') {
      wrapper.append(this.passwordBtn);
    }
    return wrapper;
  }

  public render(): HTMLElement {
    const container = createElement('div', { class: 'registration' });
    container.append(
      this.renderInput('Email address', this.email),
      this.emailError,
      this.renderInput('Password', this.password),
      this.passwordError,
      this.renderInput('First name', this.firstname),
      this.firstnameError,
      this.renderInput('Last name', this.lastname),
      this.lastnameError,
      this.renderInput('Birth date', this.birthdate),
      this.birthdateError,
      this.address,
      this.renderInput('Country', this.country),
      this.countryError,
      this.renderInput('Post code', this.postcode),
      this.postcodeError,
      this.renderInput('City', this.city),
      this.cityError,
      this.renderInput('Street', this.street),
      this.streetError,
      this.enter,
    );
    return container;
  }
}

export default Registration;
