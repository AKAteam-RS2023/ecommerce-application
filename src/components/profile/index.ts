import {
  Customer,
  ClientResponse,
  CustomerUpdateAction,
  ErrorResponse,
  Address as EcomAddress,
} from '@commercetools/platform-sdk';

import createElement from '../../dom-helper/create-element';
import { changePasswordApi, getProfile, updateCustomer } from '../../services/ecommerce-api';
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
import validateEmail from '../registration/validation/validate-email';
import { PasswordBtn } from './password-btn';
import validatePassword from '../registration/validation/validate-password';
import { ShowMessage } from './show-message';
import { loginIfExist } from '../../controller/customers';
import { clearClient } from '../../sdk/create-client-user';

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

  private email = createElement<HTMLInputElement>('input', {
    class: 'profile__email--input',
    type: 'text',
    id: 'email',
  });

  private emailError = createElement<HTMLElement>('div', {
    class: 'profile__email--error',
  });

  private saveResult = createElement('div', { class: 'profile__saveresult' });

  private messageBox = new ShowMessage(this.saveResult);

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

  private emailValidator: ElementValidator = new ElementValidator(
    this.email,
    this.emailError,
    validateEmail,
    () => this.email.classList.contains('edit'),
    'profile',
  );

  private customer?: { version: number; id: string };

  private setDefaultShipping = (addressId: string): void => {
    const actions: CustomerUpdateAction[] = [{ action: 'setDefaultShippingAddress', addressId }];
    this.saveChanges(actions);
  };

  private setDefaultBilling = (addressId: string): void => {
    const actions: CustomerUpdateAction[] = [{ action: 'setDefaultBillingAddress', addressId }];
    this.saveChanges(actions);
  };

  private deleteAddress = (addressId: string): void => {
    const actions: CustomerUpdateAction[] = [{ action: 'removeAddress', addressId }];
    this.saveChanges(actions);
  };

  private setDefaultAddress = (addressId: string, addressType: string): void => {
    switch (addressType.toLowerCase()) {
      case AddressList.Shipping.toLowerCase():
        this.setDefaultShipping(addressId);
        break;
      case AddressList.Billing.toLowerCase():
        this.setDefaultBilling(addressId);
        break;
      default:
    }
  };

  private editAddress = (addr: EcomAddress): void => {
    const modal = createElement('div', { class: 'modal__overlay' });
    const address = new Address('Edit address');
    const addressElement = address.render();
    address.loadFrom(addr);
    addressElement.classList.add('modal__address');
    const buttons = createElement('div', { class: 'modal__buttons' });
    const saveAddressBtn = createElement('input', { type: 'button', value: 'SAVE' });
    const cancelAddressBtn = createElement('input', { type: 'button', value: 'CANCEL' });
    buttons.append(saveAddressBtn, cancelAddressBtn);
    addressElement.append(buttons);
    modal.append(addressElement);
    modal.style.display = 'block';
    document.body.appendChild(modal);
    cancelAddressBtn.addEventListener('click', () => modal.remove());
    saveAddressBtn.addEventListener('click', () => {
      if (address.validate()) {
        const actions: CustomerUpdateAction[] = [
          { action: 'changeAddress', addressId: addr.id, address: address.createBaseAddress() },
        ];
        if (actions.length > 0) {
          this.saveChanges(actions);
        }
        modal.remove();
      }
    });
  };

  private shippingList = new AddressList(
    AddressList.Shipping,
    this.setDefaultAddress,
    this.deleteAddress,
    this.editAddress,
  );

  private billingList = new AddressList(
    AddressList.Billing,
    this.setDefaultAddress,
    this.deleteAddress,
    this.editAddress,
  );

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

  private saveEmail = (): void => {
    const actions: CustomerUpdateAction[] = [{ action: 'changeEmail', email: this.email.value }];
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
      .then((res) => this.handleResponse(res, this.messageBox))
      .catch((err) => this.handleError(this.messageBox, err as ErrorResponse));
  }

  private handleResponse(
    resp: ClientResponse<Customer> | ErrorResponse,
    messageBox: ShowMessage,
  ): void {
    if (resp.statusCode !== 200) {
      this.handleError(messageBox, resp as ErrorResponse);
    } else {
      this.loadProfile(resp as ClientResponse<Customer>);
      messageBox.showSuccess();
    }
  }

  private handleError(messageBox: ShowMessage, err?: ErrorResponse): void {
    const errMessage = `✕ ${err?.message ?? 'Something went wrong. Please try again'}`;
    messageBox.showError(errMessage);
    const changedVersionCode1 = 429;
    const changedVersionCode2 = 409;
    if (err?.statusCode === changedVersionCode1 || err?.statusCode === changedVersionCode2) {
      this.reload();
    }
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
        const actions: CustomerUpdateAction[] = [];
        Profile.addShipAddress(actions, shippingCheckBox, def, address);
        Profile.addBillAddress(actions, billingCheckBox, def, address);
        if (actions.length > 0) {
          this.saveChanges(actions);
        }
        modal.remove();
      }
    });
  };

  private static addBillAddress(
    actions: CustomerUpdateAction[],
    billingCheckBox: HTMLInputElement,
    defaultCheckBox: HTMLInputElement,
    address: Address,
  ): void {
    if (billingCheckBox.checked) {
      const billAddress = address.createBaseAddress();
      actions.push({ action: 'addAddress', address: billAddress });
      actions.push({ action: 'addBillingAddressId', addressKey: billAddress.key });
      if (defaultCheckBox.checked) {
        actions.push({ action: 'setDefaultBillingAddress', addressKey: billAddress.key });
      }
    }
  }

  private static addShipAddress(
    actions: CustomerUpdateAction[],
    shippingCheckBox: HTMLInputElement,
    defaultCheckBox: HTMLInputElement,
    address: Address,
  ): void {
    if (shippingCheckBox.checked) {
      const shipAddress = address.createBaseAddress();
      actions.push({ action: 'addAddress', address: shipAddress });
      actions.push({ action: 'addShippingAddressId', addressKey: shipAddress.key });
      if (defaultCheckBox.checked) {
        actions.push({ action: 'setDefaultShippingAddress', addressKey: shipAddress.key });
      }
    }
  }

  private loadProfile = (res: ClientResponse<Customer>): void => {
    this.customer = {
      version: res.body.version,
      id: res.body.id,
    };

    this.firstname.value = res?.body?.firstName ?? '';
    this.lastname.value = res?.body?.lastName ?? '';
    this.birthdate.value = res?.body?.dateOfBirth ?? '';
    this.email.value = res?.body?.email ?? '';

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

  private static createPasswordInput(
    header: string,
    id: string,
  ): [HTMLElement, HTMLInputElement, ElementValidator] {
    const password = createElement<HTMLInputElement>('input', {
      class: 'modal__changepasswordrow--input',
      type: 'text',
      id,
    });
    const passwordError = createElement<HTMLElement>('div', {
      class: 'modal__changepasswordrow--error',
    });
    const passwordBtn = new PasswordBtn(password);
    const passwordElement = renderInput(
      'password',
      password,
      passwordError,
      passwordBtn.render(),
      header,
    );
    const passwordValidator: ElementValidator = new ElementValidator(
      password,
      passwordError,
      validatePassword,
    );
    return [passwordElement, password, passwordValidator];
  }

  private showSetNewPassword = (): void => {
    const modal = createElement('div', { class: 'modal__overlay' });
    const wrapper = createElement('div', {
      class: 'modal__changepassword',
    });
    const [oldPasswordDiv, oldPassword, oldPasswordValidator] = Profile.createPasswordInput(
      'Current password',
      'oldpassword',
    );
    const [newPasswordDiv, newPassword, newPasswordValidator] = Profile.createPasswordInput(
      'New password',
      'newpassword',
    );
    wrapper.append(oldPasswordDiv, newPasswordDiv);
    const buttons = createElement('div', { class: 'modal__buttons' });
    const saveNewPasswordBtn = createElement('input', { type: 'button', value: 'CHANGE' });
    const cancelBtn = createElement('input', { type: 'button', value: 'CANCEL' });
    buttons.append(saveNewPasswordBtn, cancelBtn);
    const container = createElement('div', {
      class: 'modal__password',
    });
    const messageDiv = createElement('div', {
      class: 'modal__message',
    });
    container.append(wrapper, buttons, messageDiv);
    const changePasswordMessageBox = new ShowMessage(messageDiv, () => modal.remove());
    modal.append(container);
    modal.style.display = 'block';
    document.body.appendChild(modal);
    cancelBtn.addEventListener('click', () => modal.remove());
    saveNewPasswordBtn.addEventListener('click', async () => {
      if (oldPasswordValidator.validate() && newPasswordValidator.validate()) {
        await this.changePassword(oldPassword.value, newPassword.value, changePasswordMessageBox);
      }
    });
  };

  private async changePassword(
    currentPassword: string,
    newPassword: string,
    messageBox: ShowMessage,
  ): Promise<void> {
    try {
      const res = await changePasswordApi(
        this.customer?.id ?? '',
        currentPassword,
        newPassword,
        this.customer?.version ?? 0,
      );
      this.handleResponse(res, messageBox);
      clearClient();
      await loginIfExist(this.email.value, newPassword);
    } catch (err) {
      if (!(err as ErrorResponse)) {
        messageBox.showError('Something went wrong. Please try again.');
        return;
      }
      this.handleError(messageBox, err as ErrorResponse);
    }
  }

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
    const setNewPassword = createElement('div', {
      class: 'profile__password--link',
    });
    setNewPassword.textContent = 'Set new password';
    setNewPassword.addEventListener('click', () => this.showSetNewPassword());
    const profileWrapper = createElement('div');
    profileWrapper.append(
      this.createFirstName(),
      this.createLastName(),
      this.createEmail(),
      this.createBirthdate(),
      setNewPassword,
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
    getProfile()
      .then((res) => this.loadProfile(res))
      .catch(() => Router.instance.navigate('login'));
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

  private createEmail(): HTMLElement {
    return renderEditableInput(
      'Email',
      this.email,
      this.saveEmail,
      this.emailError,
      this.emailValidator,
    );
  }
}
