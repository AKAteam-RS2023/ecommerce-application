import { Address } from '@commercetools/platform-sdk';
import createElement from '../../dom-helper/create-element';

export class AddressList {
  private table: HTMLTableElement = createElement<HTMLTableElement>('table', {
    class: 'address-list__table',
  });

  public render(): HTMLElement {
    const container = createElement<HTMLDivElement>('div', {
      class: 'address-list',
    });

    const myAddresses = createElement<HTMLDivElement>('div', {
      class: 'profile__title',
    });
    myAddresses.textContent = 'My addresses';

    container.append(myAddresses, this.table);

    return container;
  }

  public loadAddresses(addresses: Address[]): void {
    for (let i = 0; i < addresses.length; i += 1) {
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

      country.textContent = addresses[i].country;
      postCode.textContent = addresses[i]?.postalCode ?? '';
      city.textContent = addresses[i]?.city ?? '';
      street.textContent = addresses[i]?.streetName ?? '';

      row.append(country, postCode, city, street);
      this.table.append(row);
    }
  }
}
