import createElement from '../../dom-helper/create-element';
import IProductDetails from '../../types/interfaces/productDetails';
import './product-slider.scss';

export default class ProductSlider {
  public productSlider: HTMLDivElement = createElement('div', { class: 'product-slider' });

  public wrapperProductSlider: HTMLDivElement = createElement('div', { class: 'product-slider__wrapper' });

  private productSliderWindow: HTMLDivElement = createElement('div', { class: 'product-slider__window' });

  private sliderItems: HTMLDivElement = createElement('div', { class: 'product-slider__items' });

  private buttonNext: HTMLDivElement = createElement('div', { class: 'product-slider__button--next' });

  private buttonPrev: HTMLDivElement = createElement('div', { class: 'product-slider__button--prev' });

  private index = 0;

  private sliderLength = 0;

  private allSlides: HTMLDivElement[] = [];

  public renderSlider(product: IProductDetails): HTMLDivElement | undefined {
    this.buttonNext.textContent = '>';
    this.buttonPrev.textContent = '<';
    if (product?.imagesUrl) {
      product.imagesUrl.forEach((item, index) => {
        const sliderItem = createElement<HTMLImageElement>('div', {
          class: 'product-slider__item',
        });
        const img = createElement<HTMLImageElement>('img', {
          class: 'product-details__img',
          src: item,
          alt: `${product?.name} image ${index + 1}`,
        });
        sliderItem.append(img);
        this.allSlides.push(sliderItem);
        this.sliderItems.append(sliderItem);
        this.productSliderWindow.append(this.sliderItems);
      });
      if (this.sliderLength === 1) {
        this.wrapperProductSlider.append(this.productSliderWindow);
      } else {
        this.wrapperProductSlider.append(
          this.productSliderWindow,
          this.buttonNext,
          this.buttonPrev,
        );
      }
      this.productSlider.append(this.wrapperProductSlider);
      return this.productSlider;
    }
    return undefined;
  }

  public sliderInit(): void {
    this.sliderLength = this.allSlides.length;

    this.allSlides.forEach((item) => {
      const slide = item;
      slide.style.width = `${100 / this.sliderLength}%`;
    });
    this.sliderItems.style.width = `${this.sliderLength * 100}%`;

    this.buttonPrev.addEventListener('click', () => {
      this.prev();
    });

    this.buttonNext.addEventListener('click', () => {
      this.next();
    });
  }

  private next(): void {
    this.goto(this.index + 1);
  }

  private prev(): void {
    this.goto(this.index - 1);
  }

  private goto(i: number): void {
    // изменить текущий индекс...
    if (i > this.sliderLength - 1) {
      this.index = 0;
    } else if (i < 0) {
      this.index = this.sliderLength - 1;
    } else {
      this.index = i;
    }
    this.move();
  }

  private move(): void {
    const offset: number = (100 / this.sliderLength) * this.index;
    this.sliderItems.style.transform = `translateX(-${offset}%)`;
  }
}
