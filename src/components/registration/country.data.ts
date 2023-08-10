import createElement from '../../dom-helper/create-element';

export class CountriesList {
  private id: string;

  constructor(id: string) {
    this.id = id;
  }

  public render(): HTMLElement {
    const dataList = createElement('datalist', { id: this.id });
    dataList.append(createElement('option', { value: 'Poland' }));

    return dataList;
  }
}
