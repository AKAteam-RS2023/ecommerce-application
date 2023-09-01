import createElement from '../../dom-helper/create-element';
import './price-filter.scss';

const MIN_PRICE = 0;
const MAX_PRICE = 10000;
const MIN_CHANGE = 1;

class PriceFilter {
  private container = createElement('div', { class: 'filters__item' });

  public startValue = MIN_PRICE;

  public finishValue = MAX_PRICE;

  private startPrice = createElement<HTMLInputElement>('input', {
    type: 'number',
    class: 'filters__input--price',
    id: 'start-price',
    min: `${MIN_PRICE}`,
    max: `${MAX_PRICE - MIN_CHANGE}`,
    value: `${this.startValue}`,
  });

  private finishPrice = createElement<HTMLInputElement>('input', {
    type: 'number',
    class: 'filters__input--price',
    id: 'start-price',
    min: `${MIN_PRICE + MIN_CHANGE}`,
    max: `${MAX_PRICE}`,
    value: `${this.finishValue}`,
  });

  constructor() {
    this.init();
  }

  private static initInput(inputElement: HTMLInputElement, textContent: string): HTMLElement {
    const wrapper = createElement('div', { class: 'filter__price' });
    const label = createElement<HTMLLabelElement>('label', {
      class: 'filters__label--price',
      for: inputElement.id,
    });
    label.textContent = textContent;
    wrapper.append(label, inputElement);
    return wrapper;
  }

  private init(): void {
    const title = createElement('div', { class: 'filters__title' });
    title.textContent = 'Cena:';
    this.container.append(
      title,
      PriceFilter.initInput(this.startPrice, 'od:'),
      PriceFilter.initInput(this.finishPrice, 'do:'),
    );
    this.startPrice.onchange = (): void => {
      if (Number.isNaN(+this.startPrice.value) || +this.startPrice.value < MIN_PRICE) {
        this.startPrice.value = `${MIN_PRICE}`;
      }
      if (+this.startPrice.value >= MAX_PRICE) {
        this.startPrice.value = `${MAX_PRICE - MIN_CHANGE}`;
      }
      this.startValue = +this.startPrice.value;
    };
    this.finishPrice.onchange = (): void => {
      if (
        Number.isNaN(+this.finishPrice.value)
        || +this.finishPrice.value <= +this.startPrice.value
      ) {
        this.finishPrice.value = `${+this.startPrice.value + MIN_CHANGE}`;
      }
      if (+this.finishPrice.value > MAX_PRICE) {
        this.finishPrice.value = `${MAX_PRICE}`;
      }
      this.finishValue = +this.finishPrice.value;
    };
  }

  public render(): HTMLElement {
    return this.container;
  }
}

export default new PriceFilter();
