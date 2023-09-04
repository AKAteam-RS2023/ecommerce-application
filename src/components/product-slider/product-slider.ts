import createElement from '../../dom-helper/create-element';
import IProductDetails from '../../types/interfaces/productDetails';
import './product-slider.scss';
import { IPage } from '../../types/interfaces/page';

export default class ProductSlider implements IPage {
  public productSlider: HTMLDivElement = createElement('div', { class: 'product-slider' });

  public wrapperProductSlider: HTMLDivElement = createElement('div', {
    class: 'product-slider__wrapper',
  });

  private productSliderWindow: HTMLDivElement = createElement('div', {
    class: 'product-slider__window',
  });

  private sliderItems: HTMLDivElement = createElement('div', { class: 'product-slider__items' });

  private buttonNext: HTMLDivElement = createElement('div', {
    class: 'product-slider__button--next',
  });

  private buttonPrev: HTMLDivElement = createElement('div', {
    class: 'product-slider__button--prev',
  });

  private index = 0;

  private sliderLength = 0;

  public allSlides: HTMLDivElement[] = [];

  private indicators: HTMLLIElement[] = [];

  constructor(private product: IProductDetails) {}

  public render(): HTMLDivElement {
    this.buttonNext.textContent = '>';
    this.buttonPrev.textContent = '<';
    if (this.product?.imagesUrl) {
      this.product.imagesUrl.forEach((item, index) => {
        const sliderItem = createElement<HTMLImageElement>('div', {
          class: 'product-slider__item',
        });
        const img = createElement<HTMLImageElement>('img', {
          class: 'product-details__img',
          src: item,
          alt: `${this.product?.name} image ${index + 1}`,
        });
        sliderItem.append(img);
        this.allSlides.push(sliderItem);
        this.sliderItems.append(sliderItem);
        this.productSliderWindow.append(this.sliderItems);
      });
      if (this.product.imagesUrl.length <= 1) {
        this.wrapperProductSlider.append(this.productSliderWindow);
      } else {
        this.wrapperProductSlider.append(
          this.productSliderWindow,
          this.buttonNext,
          this.buttonPrev,
        );
      }
      this.productSlider.append(this.wrapperProductSlider);
    }
    this.sliderInit();
    return this.productSlider;
  }

  private sliderInit(): void {
    this.sliderLength = this.allSlides.length;
    if (this.sliderLength > 1) this.indicators = this.indicatorsRender();
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

    this.indicators.forEach((item) => {
      item.addEventListener('click', (event) => {
        event.preventDefault();
        if (event.target) {
          const index = this.indicators.indexOf(event.target as HTMLLIElement);
          if (index === this.index) return;
          this.goto(index);
        }
      });
    });
  }

  private indicatorsRender(): HTMLLIElement[] {
    const ol: HTMLElement = createElement('ol', { class: 'product-slider__indicators' });
    const children: HTMLLIElement[] = [];
    for (let i = 0; i < this.sliderLength; i += 1) {
      const li: HTMLLIElement = createElement('li', { class: 'indicators__item' });
      if (i === 0) li.classList.add('active');
      ol.append(li);
      children.push(li);
    }
    this.productSlider.append(ol);
    return children;
  }

  private next(): void {
    this.goto(this.index + 1);
  }

  private prev(): void {
    this.goto(this.index - 1);
  }

  public goto(i: number): void {
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
    this.indicators.forEach((item) => item.classList.remove('active'));
    this.indicators[this.index]?.classList.add('active');
  }
}
