import { Customer, ClientResponse } from '@commercetools/platform-sdk';

import createElement from '../../dom-helper/create-element';
import { getProfile } from '../../services/ecommerce-api';
import { IPage } from '../../types/interfaces/page';
import { renderInput } from '../registration/render-input';
import Router from '../router/router';
import './profile.scss';
import { AddressList } from './address-list';

export class Profile implements IPage {
  private router = Router.instance;

  private firstname = createElement<HTMLInputElement>('input', {
    class: 'profile__firstname--input',
    type: 'text',
    id: 'firstname',
  });

  private lastname = createElement<HTMLInputElement>('input', {
    class: 'profile__lastname--input',
    type: 'text',
    id: 'lastname',
  });

  private birthdate = createElement<HTMLInputElement>('input', {
    class: 'profile__birthdate--input',
    type: 'date',
    id: 'birthdate',
    placeholder: 'DD-MM-YYYY',
  });

  private shippingList = new AddressList('Shipping');

  private billingList = new AddressList('Billing');

  private loadProfile = (res: ClientResponse<Customer>): void => {
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
      class: 'profile__title',
    });
    myAddresses.textContent = 'My addresses';

    container.append(
      title,
      renderInput('First name', this.firstname),
      renderInput('Last name', this.lastname),
      renderInput('Birth date', this.birthdate),
      myAddresses,
      this.shippingList.render(),
      this.billingList.render(),
    );

    getProfile().then((res) => this.loadProfile(res));

    return container;
  }
}
