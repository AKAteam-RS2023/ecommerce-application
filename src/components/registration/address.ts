import { BaseAddress, Address as EcomAddress } from '@commercetools/platform-sdk';
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
  private addr: Address | null = null;

  private enabled: boolean;

  private address = createElement<HTMLElement>('div', {
    class: 'registration__address',
  });

  private country = createElement<HTMLInputElement>('input', {
    class: 'registration__country--input',
    type: 'text',
    id: `country-${Address.uniqueID()}`,
  });

  private countryError = createElement<HTMLElement>('div', {
    class: 'registration__country--error',
  });

  private postcode = createElement<HTMLInputElement>('input', {
    class: 'registration__postcode--input',
    type: 'text',
    maxlength: '6',
    id: `postcode-${Address.uniqueID()}`,
  });

  private postcodeError = createElement<HTMLElement>('div', {
    class: 'registration__postcode--error',
  });

  private city = createElement<HTMLInputElement>('input', {
    class: 'registration__city--input',
    type: 'text',
    id: `city-${Address.uniqueID()}`,
  });

  private cityError = createElement<HTMLElement>('div', {
    class: 'registration__city--error',
  });

  private street = createElement<HTMLInputElement>('input', {
    class: 'registration__street--input',
    type: 'text',
    id: `street-${Address.uniqueID()}`,
  });

  private streetError = createElement<HTMLElement>('div', {
    class: 'registration__street--error',
  });

  private streetValidator: ElementValidator = new ElementValidator(
    this.street,
    this.streetError,
    validateStreet,
    () => this.enabled,
  );

  private cityValidator: ElementValidator = new ElementValidator(
    this.city,
    this.cityError,
    validateName,
    () => this.enabled,
  );

  private countryValidator: ElementValidator = new ElementValidator(
    this.country,
    this.countryError,
    validateCountry,
    () => this.enabled,
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

  public loadFrom(address: EcomAddress): void {
    this.country.value = Country.getCountryName(address.country);
    this.postcode.value = address.postalCode ?? '';
    this.city.value = address.city ?? '';
    this.street.value = address.streetName ?? '';
  }

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
      key: Address.uniqueID(),
    };

    return address;
  }

  private static uniqueID(): string {
    return Math.floor(Math.random() * Date.now()).toString();
  }

  public disable(): void {
    this.country.setAttribute('disabled', 'disabled');
    this.city.setAttribute('disabled', 'disabled');
    this.postcode.setAttribute('disabled', 'disabled');
    this.street.setAttribute('disabled', 'disabled');
    this.enabled = false;
    this.validate();
  }

  public enable(): void {
    this.country.removeAttribute('disabled');
    this.city.removeAttribute('disabled');
    this.postcode.removeAttribute('disabled');
    this.street.removeAttribute('disabled');
    this.enabled = true;
  }

  public subscribe(addr: Address): void {
    this.addr = addr;
    this.addressChanged();
  }

  public unsubscribe(): void {
    this.addr = null;
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
    this.enabled = true;
    this.initPostCode();
    this.address.textContent = header;
    this.country.addEventListener('focusout', this.addressChanged);
    this.city.addEventListener('focusout', this.addressChanged);
    this.postcode.addEventListener('focusout', this.addressChanged);
    this.street.addEventListener('focusout', this.addressChanged);
  }

  private addressChanged = (): void => {
    if (this.addr != null) {
      this.addr.country.value = this.country.value;
      this.addr.city.value = this.city.value;
      this.addr.postcode.value = this.postcode.value;
      this.addr.street.value = this.street.value;
    }
  };

  private postcodeValidator: ElementValidator = new ElementValidator(
    this.postcode,
    this.postcodeError,
    this.getPostCodeValidation,
    () => this.enabled,
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
