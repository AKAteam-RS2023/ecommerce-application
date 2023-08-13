import { BaseAddress } from '@commercetools/platform-sdk';

import createElement from '../../dom-helper/create-element';

import hidePassword from '../../assets/image/hide-password.png';

import visiblePassword from '../../assets/image/visible-password.png';

import './registration.scss';

import { ElementValidator } from './validation/validate';
import validateEmail from './validation/validate-email';
import validatePassword from './validation/validate-password';
import validateName from './validation/validate-name';
import validateBirthdate from './validation/validate-birthdate';
import validateStreet from './validation/validate-street';
import { CountriesList } from './country.data';
import validateCountry from './validation/validate-country';
import {
  validatePostcodeLithuania,
  validatePostcodePoland,
  validatePostcodeVilnus,
} from './validation/validate-postcode';
import { Country } from './country';
import { createCustomer } from '../../services/registration';

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
    maxlength: '6',
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

  private enterError = createElement<HTMLElement>('div', {
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

  private streetValidator: ElementValidator = new ElementValidator(
    this.street,
    this.streetError,
    validateStreet,
  );

  private cityValidator: ElementValidator = new ElementValidator(
    this.city,
    this.cityError,
    validateName,
  );

  private countryValidator: ElementValidator = new ElementValidator(
    this.country,
    this.countryError,
    validateCountry,
  );

  private getPostCodeValidation = (postcode: string): void => {
    if (this.country.value === '') {
      throw new Error('Please select country');
    }

    if (this.country.value.toLowerCase() === Country.Poland.toLowerCase()) {
      validatePostcodePoland(postcode);
    } else if (this.country.value.toLowerCase() === Country.Lithuania.toLowerCase()) {
      if (this.city.value.toLowerCase() === 'vilnus') {
        validatePostcodeVilnus(postcode);
      } else {
        validatePostcodeLithuania(postcode);
      }
    } else {
      throw new Error('Please select valid country');
    }
  };

  private postcodeValidator: ElementValidator = new ElementValidator(
    this.postcode,
    this.postcodeError,
    this.getPostCodeValidation,
  );

  constructor() {
    this.passwordBtn.addEventListener('click', this.toggleVisiblePassword);
    this.toggleVisiblePassword();
    this.initEnter();
    this.initPostCode();
    this.initAddress();
  }

  private initPostCode(): void {
    this.postcode.addEventListener('input', this.onPostCode);
  }

  private onPostCode = (): void => {
    if (this.country.value === Country.Poland && this.postcode.value.length === 2) {
      this.postcode.value += '-';
    }
  };

  private initEnter(): void {
    this.enter.textContent = 'Register';
    this.enter.addEventListener('click', this.validateInputs);
  }

  private validateInputs = (): void => {
    const validResults: boolean[] = [];
    validResults.push(this.emailValidator.validate());
    validResults.push(this.passwordValidator.validate());
    validResults.push(this.firstnameValidator.validate());
    validResults.push(this.lastnameValidator.validate());
    validResults.push(this.birthdateValidator.validate());
    validResults.push(this.streetValidator.validate());
    validResults.push(this.cityValidator.validate());
    validResults.push(this.countryValidator.validate());
    validResults.push(this.postcodeValidator.validate());
    if (validResults.indexOf(false) !== -1) {
      this.enterError.textContent = 'Please fix errors and try again';
    } else {
      this.enterError.textContent = '';

      const dateOfBirth = new Date(this.birthdate.value).toJSON().substring(0, 10);

      const countryCode = Country.getCountryCode(this.country.value);
      const address: BaseAddress = {
        country: countryCode,
        streetName: this.street.value,
        postalCode: this.postcode.value,
        city: this.city.value,
      };
      createCustomer({
        email: this.email.value,
        firstName: this.firstname.value,
        lastName: this.lastname.value,
        password: this.password.value,
        dateOfBirth,
        addresses: [address],
      })
        .then(console.log)
        .catch(console.error);
    }
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

  private renderInput(type: string, input: HTMLInputElement, inputError: HTMLElement): HTMLElement {
    const className = input.className.replace('--input', '');
    const wrapper = createElement('div', { class: `${className}` });
    const label = createElement('label', {
      class: `${className}--label`,
      for: input.id,
    });
    label.textContent = type;
    wrapper.append(label, input);
    if (type.toLowerCase() === 'password') {
      wrapper.append(this.passwordBtn);
    }
    wrapper.append(inputError);
    return wrapper;
  }

  public render(): HTMLElement {
    const container = createElement('div', { class: 'registration' });

    const countriesId = 'countries-list';
    const countries = new CountriesList(countriesId);
    this.country.setAttribute('list', countriesId);

    container.append(
      countries.render(),
      this.renderInput('Email address', this.email, this.emailError),
      this.renderInput('Password', this.password, this.passwordError),
      this.renderInput('First name', this.firstname, this.firstnameError),
      this.renderInput('Last name', this.lastname, this.lastnameError),
      this.renderInput('Birth date', this.birthdate, this.birthdateError),
      this.renderInput('Country', this.country, this.countryError),
      this.renderInput('City', this.city, this.cityError),
      this.renderInput('Post code', this.postcode, this.postcodeError),
      this.renderInput('Street', this.street, this.streetError),
      this.enter,
      this.enterError,
    );
    return container;
  }
}

export default Registration;
