import createElement from '../../dom-helper/create-element';
import { IPage } from '../../types/interfaces/page';
import getProductDetails from '../../controller/get-product';
import IProductDetails from '../../types/interfaces/productDetails';

export default class ProductView implements IPage {
  private container: HTMLElement = createElement('section', { class: 'product-view' });

  private product?: IProductDetails;

  private productId: string;

  private oldPrice: HTMLElement | null = null;

  public currencyCode = 'zł';

  constructor() {
    this.productId = 'bc6257e0-667f-4b83-a763-0c0bc787c154';
  }

  private init(): void {
    getProductDetails(this.productId)
      .then((productResponse) => {
        this.product = productResponse;
        this.renderProductDetails();
      })
      .catch((err) => {
        this.container.textContent = err.message;
      });
  }

  public render(): HTMLElement {
    this.container.innerHTML = '';
    this.init();
    return this.container;
  }

  private renderProductDetails(): void {
    if (this.product) {
      const imgContainer = createElement('div', { class: 'product-img__wrapper' });
      if (this.product.imagesUrl) {
        this.product.imagesUrl.forEach((item) => {
          const img = createElement<HTMLImageElement>('img', {
            class: 'product-details__img',
            src: item,
          });
          imgContainer.append(img);
        });
      }

      const name = createElement('div', {
        class: 'product-details__name',
      });
      name.textContent = this.product.name;
      const description = createElement('div', {
        class: 'product-details__description',
      });
      description.innerHTML = this.product.description;
      const price = createElement('div', {
        class: 'product-details__price',
      });
      price.textContent = this.product.price;
      const wrapperPrices = createElement('div', { class: 'product-details__wrapper-prices' });
      wrapperPrices.append(price);
      this.initOldPrice();
      if (this.oldPrice) {
        wrapperPrices.append(this.oldPrice);
      }
      const wrapper = createElement('div', {
        class: 'product-details__wrapper',
      });
      wrapper.append(name, wrapperPrices, description);
      this.container.append(imgContainer, wrapper);
    }
  }

  private initOldPrice(): void {
    if (!this.product?.discount || !this.product.discount.value) {
      return;
    }
    this.oldPrice = createElement('div', { class: 'product-details__old-price' });
    this.oldPrice.textContent = this.product.discount.value;
  }
}
