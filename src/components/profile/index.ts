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

  private addressList = new AddressList();

  private loadProfile = (res: ClientResponse<Customer>): void => {
    this.firstname.value = res?.body?.firstName ?? '';
    this.lastname.value = res?.body?.lastName ?? '';
    this.birthdate.value = res?.body?.dateOfBirth ?? '';

    this.addressList.loadAddresses(res.body.addresses);
  };

  public render(): HTMLElement {
    const container = createElement('div', { class: 'profile' });
    const title = createElement('div', { class: 'profile__title' });
    title.textContent = 'My information';

    container.append(
      title,
      renderInput('First name', this.firstname),
      renderInput('Last name', this.lastname),
      renderInput('Birth date', this.birthdate),
      this.addressList.render(),
    );

    getProfile().then((res) => this.loadProfile(res));

    return container;
  }
}
