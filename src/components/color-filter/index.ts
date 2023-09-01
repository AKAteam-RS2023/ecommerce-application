import createElement from '../../dom-helper/create-element';

import getAttributes from '../../controller/get-attributes';

import './color-filter.scss';

class ColorFilter {
  private container = createElement('div', { class: 'filters__item' });

  private colorContainer = createElement('div', { class: 'filter-color__container' });

  public filtersSet = new Set();

  constructor() {
    this.init();
  }

  private createCheckBox(color: string): HTMLElement {
    const wrapper = createElement('div', { class: 'filter-color' });
    const checkBox = createElement<HTMLInputElement>('input', {
      type: 'checkbox',
      class: 'filter-color--checkbox',
      name: 'color',
      id: color,
    });
    const label = createElement<HTMLLabelElement>('label', {
      class: 'filter-color--label',
      for: color,
    });
    const colorElement = createElement('div', {
      class: 'filter-color--element',
      style: `background-color: ${color}`,
    });
    if (this.filtersSet.has(color)) {
      colorElement.classList.add('active');
    }
    label.append(colorElement);
    wrapper.append(checkBox, label);
    checkBox.onclick = (): void => {
      if (checkBox.checked) {
        colorElement.classList.add('active');
        this.filtersSet.add(color);
      } else {
        colorElement.classList.remove('active');
        this.filtersSet.delete(color);
      }
    };
    return wrapper;
  }

  private init(): void {
    getAttributes('color').then((res) => {
      const colorsSet = new Set();
      res.forEach((item) => {
        item.values.forEach((value) => {
          colorsSet.add(value.key);
        });
      });
      colorsSet.forEach((value) => {
        this.colorContainer.append(this.createCheckBox(value as string));
      });
    });
    const title = createElement('div', { class: 'filters__title' });
    title.textContent = 'Kolor:';
    this.container.append(title, this.colorContainer);
  }

  public render(): HTMLElement {
    return this.container;
  }
}

export default new ColorFilter();
