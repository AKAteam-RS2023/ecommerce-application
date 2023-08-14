import { BaseAddress } from '@commercetools/platform-sdk';
import createElement from '../../dom-helper/create-element';
import { Country } from './country';
import { ElementValidator } from './validation/validate';
import validateCountry from './validation/validate-country';
import validateName from './validation/validate-name';
import {
  validatePostcodeLithuania,
  validatePostcodePoland,
  validatePostcodeVilnus,
} from './validation/validate-postcode';
import validateStreet from './validation/validate-street';
import { renderInput } from './render-input';

export class Address {
  private address = createElement<HTMLElement>('div', {
    class: 'registration__address',
  });

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

  public validate(): boolean {
    const validResults: boolean[] = [];
    validResults.push(this.streetValidator.validate());
    validResults.push(this.cityValidator.validate());
    validResults.push(this.countryValidator.validate());
    validResults.push(this.postcodeValidator.validate());

    if (validResults.indexOf(false) !== -1) {
      return false;
    }

    return true;
  }

  public createBaseAddress(): BaseAddress {
    const countryCode = Country.getCountryCode(this.country.value);
    const address: BaseAddress = {
      country: countryCode,
      streetName: this.street.value,
      postalCode: this.postcode.value,
      city: this.city.value,
    };

    return address;
  }

  private initPostCode(): void {
    this.postcode.addEventListener('input', this.onPostCode);
  }

  private onPostCode = (): void => {
    if (this.country.value === Country.Poland && this.postcode.value.length === 2) {
      this.postcode.value += '-';
    }
  };

  constructor(header: string) {
    this.initPostCode();
    this.address.textContent = header;
  }

  private postcodeValidator: ElementValidator = new ElementValidator(
    this.postcode,
    this.postcodeError,
    this.getPostCodeValidation,
  );

  public render(): HTMLElement {
    const container = createElement<HTMLElement>('div');

    const countriesId = 'countries-list';
    this.country.setAttribute('list', countriesId);

    container.append(
      this.address,
      renderInput('Country', this.country, this.countryError),
      renderInput('City', this.city, this.cityError),
      renderInput('Post code', this.postcode, this.postcodeError),
      renderInput('Street', this.street, this.streetError),
    );

    return container;
  }
}
