import { ClientResponse, CustomerSignInResult, ErrorResponse } from '@commercetools/platform-sdk';

import createElement from '../../dom-helper/create-element';

import hidePassword from '../../assets/image/hide-password.png';

import visiblePassword from '../../assets/image/visible-password.png';

import './registration.scss';

import { ElementValidator } from './validation/validate';
import validateEmail from './validation/validate-email';
import validatePassword from './validation/validate-password';
import validateName from './validation/validate-name';
import validateBirthdate from './validation/validate-birthdate';
import { CountriesList } from './country.data';
import { createCustomer } from '../../services/registration';
import { Address } from './address';
import { renderInput } from './render-input';
import { IPage } from '../../types/interfaces/page';
import { loginIfExist } from '../../controller/customers';
import App from '../../app';

class Registration implements IPage {
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

  private addressCheckbox = createElement<HTMLInputElement>('input', {
    class: 'registration__sameaddress',
    type: 'checkbox',
    id: 'sameaddress',
  });

  private enter = createElement('button', { class: 'registration__submit' });

  private loginLink = createElement('div', { class: 'registration__login' });

  private enterMessage = createElement<HTMLElement>('div', {
    class: 'registration__enter--error',
  });

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

  private shippingAddress = new Address('Shipping address:');

  private billingAddress = new Address('Billing address:');

  constructor() {
    this.passwordBtn.addEventListener('click', this.toggleVisiblePassword);
    this.toggleVisiblePassword();
    this.initEnter();
    this.initAddressCheckbox();
    this.initLoginLink();
  }

  private initLoginLink(): void {
    this.loginLink.textContent = 'Already have an account? ';
    const a = createElement('a', { href: '/login' });
    a.textContent = 'Login';
    this.loginLink.append(a);
  }

  private initAddressCheckbox(): void {
    this.addressCheckbox.addEventListener('change', this.copyAddress);
  }

  private initEnter(): void {
    this.enter.textContent = 'Register';
    this.enter.addEventListener('click', this.validateInputs);
  }

  private copyAddress = (): void => {
    if (this.addressCheckbox.checked) {
      this.billingAddress.disable();
      this.shippingAddress.subscribe(this.billingAddress);
    } else {
      this.billingAddress.enable();
      this.shippingAddress.unsubscribe();
    }
  };

  private validateInputs = (): void => {
    const validResults: boolean[] = [];
    validResults.push(this.emailValidator.validate());
    validResults.push(this.passwordValidator.validate());
    validResults.push(this.firstnameValidator.validate());
    validResults.push(this.lastnameValidator.validate());
    validResults.push(this.birthdateValidator.validate());
    validResults.push(this.shippingAddress.validate());
    validResults.push(this.billingAddress.validate());

    if (validResults.indexOf(false) !== -1) {
      this.showError();
    } else {
      this.hideError();

      this.createCustomer();
    }
  };

  private createCustomer(): void {
    const dateOfBirth = new Date(this.birthdate.value).toJSON().substring(0, 10);

    const shippingAddress = this.shippingAddress.createBaseAddress();
    const billingAddress = this.billingAddress.createBaseAddress();

    this.enter.setAttribute('disabled', 'disabled');

    createCustomer({
      email: this.email.value,
      firstName: this.firstname.value,
      lastName: this.lastname.value,
      password: this.password.value,
      dateOfBirth,
      addresses: [shippingAddress, billingAddress],
      shippingAddresses: [0],
      billingAddresses: [1],
      defaultShippingAddress: 0,
      defaultBillingAddress: 1,
    })
      .then((resp) => this.handleResponse(resp, this.email.value, this.password.value))
      .catch((err: ErrorResponse) => {
        this.handleError(err);
      });
  }

  private enableEnter(): void {
    this.enter.removeAttribute('disabled');
  }

  private showError(): void {
    this.enterMessage.textContent = 'Please fix errors and try again';
  }

  private hideError(): void {
    this.enterMessage.textContent = '';
  }

  private handleResponse(
    resp: ClientResponse<CustomerSignInResult> | ErrorResponse,
    email: string,
    password: string,
  ): void {
    this.enableEnter();
    if (resp.statusCode === 201) {
      this.enterMessage.textContent = 'Registration has been completed successfully!';
      this.enterMessage.style.color = 'green';
      this.loginAndRedirect(email, password);
    } else if ((resp as ErrorResponse) != null) {
      this.handleError(resp as ErrorResponse);
    }
  }

  private async loginAndRedirect(email: string, password: string): Promise<void> {
    try {
      await loginIfExist(email, password);
      App.appRouter?.navigate('');
    } catch (e) {
      if (!(e instanceof Error)) {
        return;
      }
      this.showServerError();
    }
  }

  private handleError(err?: ErrorResponse): void {
    if (err == null || err.statusCode >= 500) {
      this.showServerError();
    } else {
      const duplicateEmailError = 'There is already an existing customer with the provided email.';
      if (err.message === duplicateEmailError) {
        this.enterMessage.textContent = `${duplicateEmailError} Try to login or use another email`;
      } else {
        const validationErrorMessage = 'Validation on the server has failed. Please check your data';
        this.enterMessage.textContent = validationErrorMessage;
      }
    }
  }

  private showServerError(): void {
    this.enterMessage.style.color = 'red';
    this.enterMessage.textContent = 'Something went wrong. Try again';
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

  public render(): HTMLElement {
    const container = createElement('div', { class: 'registration' });

    const countriesId = 'countries-list';
    const countries = new CountriesList(countriesId);

    container.append(
      countries.render(),
      renderInput('Email address', this.email, this.emailError),
      renderInput('Password', this.password, this.passwordError, this.passwordBtn),
      renderInput('First name', this.firstname, this.firstnameError),
      renderInput('Last name', this.lastname, this.lastnameError),
      renderInput('Birth date', this.birthdate, this.birthdateError),
      this.shippingAddress.render(),
      renderInput('Set as address for billing and shipping', this.addressCheckbox),
      this.billingAddress.render(),
      this.enter,
      this.loginLink,
      this.enterMessage,
    );
    return container;
  }
}

export default Registration;
