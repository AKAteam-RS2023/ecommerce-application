import { Address } from '@commercetools/platform-sdk';
import createElement from '../../dom-helper/create-element';
import { Country } from '../registration/country';

export type SetDefaultFunc = (addressId: string, addressType: string) => void;

export type DeleteFunc = (addressId: string) => void;

export type EditFunc = (address: Address) => void;

export class AddressList {
  public static Shipping = 'Shipping';

  public static Billing = 'Billing';

  private setDefault: SetDefaultFunc;

  private deleteAddress: DeleteFunc;

  private editAddress: EditFunc;

  private container = createElement<HTMLDivElement>('div', {
    class: 'address-list',
  });

  private table: HTMLTableElement = createElement<HTMLTableElement>('table', {
    class: 'address-list__table',
  });

  private header: string;

  constructor(
    header: string,
    setDefault: SetDefaultFunc,
    deleteAddress: DeleteFunc,
    editAddress: EditFunc,
  ) {
    this.header = header;
    this.setDefault = setDefault;
    this.deleteAddress = deleteAddress;
    this.editAddress = editAddress;
  }

  public render(): HTMLElement {
    const headerElement = createElement('div', {
      class: 'address-list__header',
    });
    headerElement.textContent = this.header;

    this.container.append(headerElement, this.table);

    return this.container;
  }

  public loadAddresses(addresses: Address[], addressIds: string[], defaultId: string): void {
    this.table.innerHTML = '';
    for (let i = 0; i < addressIds.length; i += 1) {
      const address = addresses.find((addr) => addr.id === addressIds[i]);
      if (address) {
        this.appendAddress(address, defaultId);
      }
    }
  }

  private appendAddress(address: Address, defaultId: string): void {
    const row = createElement<HTMLTableRowElement>('tr', { class: 'address-row' });
    const editAddress = createElement<HTMLTableCellElement>('td', { class: 'address-cell__edit' });
    editAddress.textContent = '✎';
    editAddress.addEventListener('click', () => this.editAddress(address));
    const deleteAddress = createElement<HTMLTableCellElement>('td', {
      class: 'address-cell__delete',
    });
    deleteAddress.textContent = '✕';
    deleteAddress.addEventListener('click', () => this.deleteAddress(address.id ?? ''));
    const country = createElement<HTMLTableCellElement>('td', { class: 'address-cell__country' });
    const postCode = createElement<HTMLTableCellElement>('td', { class: 'address-cell__postcode' });
    const city = createElement<HTMLTableCellElement>('td', { class: 'address-cell__city' });
    const street = createElement<HTMLTableCellElement>('td', { class: 'address-cell__street' });
    const asDefault = createElement<HTMLTableCellElement>('td', { class: 'address-cell__default' });
    const radioInput = createElement<HTMLInputElement>('input', {
      type: 'radio',
      name: this.header.toLowerCase(),
      id: `${address.id}-${this.header.toLowerCase()}`,
    });
    const labelInput = createElement<HTMLLabelElement>('label', {
      for: radioInput.id,
      class: 'address-cell-label__default',
    });
    labelInput.textContent = 'Default';
    asDefault.append(radioInput, labelInput);
    radioInput.checked = address.id === defaultId;
    radioInput.addEventListener('change', () => this.setDefault(address.id ?? '', this.header));
    country.textContent = Country.getCountryName(address.country);
    postCode.textContent = address.postalCode ?? '';
    city.textContent = address.city ?? '';
    street.textContent = address.streetName ?? '';

    row.append(editAddress, deleteAddress, country, postCode, city, street, asDefault);
    this.table.append(row);
  }
}
