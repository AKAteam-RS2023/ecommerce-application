import {
  Customer,
  ClientResponse,
  CustomerUpdateAction,
  ErrorResponse,
} from '@commercetools/platform-sdk';

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
import { Address } from '../registration/address';
import { renderInput } from '../registration/render-input';

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

  private saveResult = createElement('div', { class: 'profile__saveresult' });

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
    const actions: CustomerUpdateAction[] = [
      { action: 'setFirstName', firstName: this.firstname.value },
    ];
    this.saveChanges(actions);
  };

  private saveLastName = (): void => {
    const actions: CustomerUpdateAction[] = [
      { action: 'setLastName', lastName: this.lastname.value },
    ];
    this.saveChanges(actions);
  };

  private saveBirthdate = (): void => {
    const actions: CustomerUpdateAction[] = [
      { action: 'setDateOfBirth', dateOfBirth: this.birthdate.value },
    ];
    this.saveChanges(actions);
  };

  private saveChanges(action: CustomerUpdateAction[]): void {
    if (!this.customer) {
      return;
    }

    updateCustomer(this.customer.id, {
      version: this.customer.version,
      actions: action,
    })
      .then((res) => this.handleResponse(res))
      .catch((err) => this.handleError(err as ErrorResponse));
  }

  private handleResponse(resp: ClientResponse<Customer> | ErrorResponse): void {
    if (resp.statusCode !== 200) {
      this.handleError(resp as ErrorResponse);
    } else {
      this.loadProfile(resp as ClientResponse<Customer>);
      this.showMessage('✓ Saved successfully', 'profile-success');
    }
  }

  private handleError(err?: ErrorResponse): void {
    const errMessage = `✕ ${err?.message ?? 'Something went wrong. Please try again'}`;
    this.showMessage(errMessage, 'profile-error');
    const changedVersionCode1 = 429;
    const changedVersionCode2 = 409;
    if (err?.statusCode === changedVersionCode1 || err?.statusCode === changedVersionCode2) {
      this.reload();
    }
  }

  private showMessage(msg: string, cssClass: string): void {
    this.saveResult.textContent = msg;
    this.saveResult.classList.add(cssClass);
    const timeout = cssClass === 'profile-error' ? 5000 : 1500;
    setTimeout(() => {
      this.saveResult.textContent = '';
      this.saveResult.classList.remove(cssClass);
    }, timeout);
  }

  private static createAddressCheckbox(type: string): HTMLInputElement {
    return createElement('input', {
      type: 'checkbox',
      class: `address__${type}`,
      id: `address__${type}`,
    });
  }

  private addAddress = (): void => {
    const modal = createElement('div', { class: 'modal__overlay' });
    const address = new Address('New address');
    const addressElement = address.render();
    addressElement.classList.add('modal__address');
    const shippingCheckBox: HTMLInputElement = Profile.createAddressCheckbox('shipping');
    const billingCheckBox: HTMLInputElement = Profile.createAddressCheckbox('billing');
    const def: HTMLInputElement = Profile.createAddressCheckbox('default');
    const buttons = createElement('div', { class: 'modal__buttons' });
    const saveAddressBtn = createElement('input', { type: 'button', value: 'ADD' });
    const cancelAddressBtn = createElement('input', { type: 'button', value: 'CANCEL' });
    buttons.append(saveAddressBtn, cancelAddressBtn);
    addressElement.append(
      renderInput('Shipping address', shippingCheckBox),
      renderInput('Billing address', billingCheckBox),
      renderInput('Default address', def),
      buttons,
    );
    modal.append(addressElement);
    modal.style.display = 'block';
    document.body.appendChild(modal);
    cancelAddressBtn.addEventListener('click', () => modal.remove());
    saveAddressBtn.addEventListener('click', () => {
      if (address.validate()) {
        const baseAddress = address.createBaseAddress();
        const actions: CustomerUpdateAction[] = [{ action: 'addAddress', address: baseAddress }];
        if (shippingCheckBox.checked) {
          actions.push({ action: 'addShippingAddressId', addressKey: baseAddress.key });
        }
        if (billingCheckBox.checked) {
          actions.push({ action: 'addBillingAddressId', addressKey: baseAddress.key });
        }
        this.saveChanges(actions);
        modal.remove();
      }
    });
  };

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
    const addAdressBtn = createElement('div', {
      class: 'addAdress__btn',
    });
    addAdressBtn.textContent = '+';
    const span = createElement('span', {
      class: 'tooltip',
    });
    span.textContent = 'Add address';
    addAdressBtn.append(span);
    addAdressBtn.addEventListener('click', this.addAddress);
    const profileWrapper = createElement('div');
    profileWrapper.append(
      this.createFirstName(),
      this.createLastName(),
      this.createBirthdate(),
      myAddresses,
      this.shippingList.render(),
      this.billingList.render(),
      addAdressBtn,
    );
    container.append(title, profileWrapper, this.saveResult);
    this.reload();
    return container;
  }

  private reload(): void {
    getProfile().then((res) => this.loadProfile(res));
  }

  private createFirstName(): HTMLElement {
    return renderEditableInput(
      'First name',
      this.firstname,
      this.saveFirstName,
      this.firstnameError,
      this.firstnameValidator,
    );
  }

  private createLastName(): HTMLElement {
    return renderEditableInput(
      'Last name',
      this.lastname,
      this.saveLastName,
      this.lastnameError,
      this.lastnameValidator,
    );
  }

  private createBirthdate(): HTMLElement {
    return renderEditableInput(
      'Birth date',
      this.birthdate,
      this.saveBirthdate,
      this.birthdateError,
      this.birthdateValidator,
    );
  }
}
