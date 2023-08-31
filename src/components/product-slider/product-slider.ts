import createElement from '../../dom-helper/create-element';
import IProductDetails from '../../types/interfaces/productDetails';

export default class ProductSlider {
  public wrapperProductSlider:HTMLDivElement = createElement('div', { class: 'product-slider__wrapper' });

  private sliderItems: HTMLDivElement = createElement('div', { class: 'product-slider__items' });

  public renderSlider(product: IProductDetails): HTMLDivElement | undefined {
    this.wrapperProductSlider.innerHTML = '';
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
        this.wrapperProductSlider.append(this.sliderItems);
      });
      return this.wrapperProductSlider;
    }
    return undefined;
  }
}
