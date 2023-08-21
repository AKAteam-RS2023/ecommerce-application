import createElement from '../../dom-helper/create-element';
import { Country } from './country';

export class CountriesList {
  private id: string;

  constructor(id: string) {
    this.id = id;
  }

  public render(): HTMLElement {
    const dataList = createElement('datalist', { id: this.id });
    dataList.append(createElement('option', { value: Country.Poland }));
    dataList.append(createElement('option', { value: Country.Lithuania }));
    return dataList;
  }
}
