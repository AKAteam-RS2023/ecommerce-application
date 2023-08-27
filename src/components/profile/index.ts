import { Customer, ClientResponse, CustomerUpdateAction } from '@commercetools/platform-sdk';

import createElement from '../../dom-helper/create-element';
import { getProfile, updateCustomer } from '../../services/ecommerce-api';
import { IPage } from '../../types/interfaces/page';
import Router from '../router/router';
import './profile.scss';
import { AddressList } from './address-list';
import { ElementValidator } from '../registration/validation/validate';
import validateBirthdate from '../registration/validation/validate-birthdate';
import validateName from '../registration/validation/validate-name';
import { renderEditableInput } from './render-editable-input';

export class Profile implements IPage {
  private router = Router.instance;

  private firstname = createElement<HTMLInputElement>('input', {
    class: 'profile__firstname--input',
    type: 'text',
    id: 'firstname',
  });

  private firstnameError = createElement<HTMLElement>('div', {
    class: 'profile__firstname--error',
  });

  private lastname = createElement<HTMLInputElement>('input', {
    class: 'profile__lastname--input',
    type: 'text',
    id: 'lastname',
  });

  private lastnameError = createElement<HTMLElement>('div', {
    class: 'profile__lastname--error',
  });

  private birthdate = createElement<HTMLInputElement>('input', {
    class: 'profile__birthdate--input',
    type: 'date',
    id: 'birthdate',
    placeholder: 'DD-MM-YYYY',
  });

  private birthdateError = createElement<HTMLElement>('div', {
    class: 'profile__birthdate--error',
  });

  private firstnameValidator: ElementValidator = new ElementValidator(
    this.firstname,
    this.firstnameError,
    validateName,
    () => this.firstname.classList.contains('edit'),
    'profile',
  );

  private lastnameValidator: ElementValidator = new ElementValidator(
    this.lastname,
    this.lastnameError,
    validateName,
    () => this.lastname.classList.contains('edit'),
    'profile',
  );

  private birthdateValidator: ElementValidator = new ElementValidator(
    this.birthdate,
    this.birthdateError,
    validateBirthdate,
    () => this.birthdate.classList.contains('edit'),
    'profile',
  );

  private shippingList = new AddressList('Shipping');

  private billingList = new AddressList('Billing');

  private customer?: { version: number; id: string };

  private saveFirstName = (): void => {
    this.saveChanges({ action: 'setFirstName', firstName: this.firstname.value });
  };

  private saveLastName = (): void => {
    this.saveChanges({ action: 'setLastName', lastName: this.lastname.value });
  };

  private saveBirthdate = (): void => {
    this.saveChanges({ action: 'setDateOfBirth', dateOfBirth: this.birthdate.value });
  };

  private saveChanges(action: CustomerUpdateAction): void {
    if (!this.customer) {
      return;
    }

    updateCustomer(this.customer.id, {
      version: this.customer.version,
      actions: [action],
    }).then((res) => this.loadProfile(res));
  }

  private loadProfile = (res: ClientResponse<Customer>): void => {
    this.customer = {
      version: res.body.version,
      id: res.body.id,
    };

    this.firstname.value = res?.body?.firstName ?? '';
    this.lastname.value = res?.body?.lastName ?? '';
    this.birthdate.value = res?.body?.dateOfBirth ?? '';

    this.shippingList.loadAddresses(
      res.body.addresses,
      res.body.shippingAddressIds ?? [],
      res.body.defaultShippingAddressId ?? '',
    );

    this.billingList.loadAddresses(
      res.body.addresses,
      res.body.billingAddressIds ?? [],
      res.body.defaultBillingAddressId ?? '',
    );
  };

  public render(): HTMLElement {
    const container = createElement('div', { class: 'profile' });
    const title = createElement('div', { class: 'profile__title' });
    title.textContent = 'My information';
    const myAddresses = createElement<HTMLDivElement>('div', {
      class: 'profile__title title__addresses',
    });
    myAddresses.textContent = 'My addresses';
    container.append(
      title,
      renderEditableInput(
        'First name',
        this.firstname,
        this.saveFirstName,
        this.firstnameError,
        this.firstnameValidator,
      ),
      renderEditableInput(
        'Last name',
        this.lastname,
        this.saveLastName,
        this.lastnameError,
        this.lastnameValidator,
      ),
      renderEditableInput(
        'Birth date',
        this.birthdate,
        this.saveBirthdate,
        this.birthdateError,
        this.birthdateValidator,
      ),
      myAddresses,
      this.shippingList.render(),
      this.billingList.render(),
    );
    getProfile().then((res) => this.loadProfile(res));
    return container;
  }
}
