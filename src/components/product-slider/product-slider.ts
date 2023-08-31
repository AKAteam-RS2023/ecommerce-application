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

  public renderSlider(product: IProductDetails): HTMLDivElement | undefined {
    this.productSlider.innerHTML = '';
    this.wrapperProductSlider.innerHTML = '';
    this.productSliderWindow.innerHTML = '';
    this.sliderItems.innerHTML = '';
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
        this.sliderItems.append(sliderItem);
        this.productSliderWindow.append(this.sliderItems);
      });
      this.wrapperProductSlider.append(this.productSliderWindow, this.buttonNext, this.buttonPrev);
      this.productSlider.append(this.wrapperProductSlider);
      return this.productSlider;
    }
    return undefined;
  }

  public sliderInit(): void {
    const allSlides = Array.from(this.productSlider.getElementsByClassName('product-slider__item'));
    let index = 0;
    let sliderLength: number = allSlides.length;

    allSlides.forEach((item) => {
      const slide = item as HTMLDivElement;
      slide.style.width = `${100 / sliderLength}%`;
    });
    this.sliderItems.style.width = `${sliderLength * 100}%`;
  }
}
