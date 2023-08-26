import { Address } from '@commercetools/platform-sdk';
import createElement from '../../dom-helper/create-element';
import { Country } from '../registration/country';

export class AddressList {
  private container = createElement<HTMLDivElement>('div', {
    class: 'address-list',
  });

  private table: HTMLTableElement = createElement<HTMLTableElement>('table', {
    class: 'address-list__table',
  });

  private header: string;

  constructor(header: string) {
    this.header = header;
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
    for (let i = 0; i < addressIds.length; i += 1) {
      const address = addresses.find((addr) => addr.id === addressIds[i]);
      if (address) {
        this.appendAddress(address, defaultId);
      }
    }
  }

  private appendAddress(address: Address, defaultId: string): void {
    const row = createElement<HTMLTableRowElement>('tr', {
      class: 'address-row',
    });
    const country = createElement<HTMLTableCellElement>('td', {
      class: 'address-cell__country',
    });
    const postCode = createElement<HTMLTableCellElement>('td', {
      class: 'address-cell__postcode',
    });
    const city = createElement<HTMLTableCellElement>('td', {
      class: 'address-cell__city',
    });
    const street = createElement<HTMLTableCellElement>('td', {
      class: 'address-cell__street',
    });
    const asDefault = createElement<HTMLTableCellElement>('td', {
      class: 'address-cell__default',
    });
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
    country.textContent = Country.getCountryName(address.country);
    postCode.textContent = address.postalCode ?? '';
    city.textContent = address.city ?? '';
    street.textContent = address.streetName ?? '';

    row.append(country, postCode, city, street, asDefault);
    this.table.append(row);
  }
}
