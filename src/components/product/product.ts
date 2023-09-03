import createElement from '../../dom-helper/create-element';
import { IPage } from '../../types/interfaces/page';
import getProductDetails from '../../controller/get-product';
import IProductDetails from '../../types/interfaces/productDetails';
import Router from '../router/router';
import { getProductDiscontById } from '../../services/ecommerce-api';
import ProductSlider from '../product-slider/product-slider';
import ModalBox from '../modal-box/modal-box';

export default class ProductView implements IPage {
  private container: HTMLElement = createElement('section', { class: 'product-view' });

  private product?: IProductDetails;

  private productId: string;

  private variantId: number;

  private oldPrice: HTMLElement | null = null;

  private router = Router.instance;

  private modalBox?: ModalBox;

  private slider?: ProductSlider;

  constructor() {
    this.productId = this.router.queryParams.productID;
    this.variantId = +this.router.queryParams.variantID;
  }

  private init(): void {
    getProductDetails(this.productId, this.variantId)
      .then((productResponse) => {
        this.product = productResponse;
        this.renderProductDetails();
      })
      .catch((err) => {
        this.container.textContent = err.message;
        this.router.navigate('not-found');
      });
  }

  public render(): HTMLElement {
    this.container.innerHTML = '';
    this.init();
    return this.container;
  }

  private renderProductDetails(): void {
    if (this.product) {
      this.slider = new ProductSlider(this.product);
      const wrapperSlider: HTMLDivElement | undefined = this.slider.render();
      const modalSlider: ProductSlider = new ProductSlider(this.product);
      this.modalBox = new ModalBox(modalSlider, 'large');
      this.slider.allSlides.forEach((item: HTMLDivElement, index: number) => {
        item.addEventListener('click', () => {
          this.modalBox?.show();
          modalSlider?.goto(index);
        });
      });
      const name = createElement('div', { class: 'product-details__name' });
      name.textContent = this.product.name;
      const price = createElement('div', { class: 'product-details__price' });
      price.textContent = this.product.price;
      const wrapperPrices = createElement('div', {
        class: 'product-details__wrapper-prices',
      });
      wrapperPrices.append(price);
      this.initOldPrice();
      if (this.oldPrice) wrapperPrices.append(this.oldPrice);
      const description = createElement('div', {
        class: 'product-details__description',
      });
      description.innerHTML = this.product.description;
      const wrapperAttribute: HTMLDivElement | undefined = this.renderAttribute();
      const wrapper = createElement('div', {
        class: 'product-details__wrapper',
      });
      if (wrapperAttribute) {
        wrapper.append(name, wrapperPrices, description, wrapperAttribute);
      } else wrapper.append(name, wrapperPrices, description);
      if (wrapperSlider) {
        const discount = this.getProductDiscount();
        if (discount) wrapperSlider.append(discount);
        this.container.append(wrapperSlider, wrapper);
      } else this.container.append(wrapper);
    }
  }

  private initOldPrice(): void {
    if (!this.product?.discount || !this.product.discount.value) {
      return;
    }
    this.oldPrice = createElement('div', { class: 'product-details__old-price' });
    this.oldPrice.textContent = this.product.discount.value;
  }

  private getProductDiscount(): HTMLDivElement | undefined {
    if (!this.product?.discount || !this.product?.discount.id) {
      return undefined;
    }
    const discount: HTMLDivElement = createElement('div', { class: 'product-details__discount' });
    getProductDiscontById(this.product.discount?.id).then((res) => {
      const { type } = res.value;
      switch (type) {
        case 'relative': {
          discount.textContent = `${res.value.permyriad / 100}%`;
          break;
        }
        case 'absolute': {
          discount.textContent = `${
            (res.value.money.filter((item) => item.currencyCode === 'PLN')[0]
              .centAmount / 100).toFixed(2)
          }`;
          break;
        }
        default:
      }
    });
    return discount;
  }

  private renderAttribute(): HTMLDivElement | undefined {
    if (this.product?.attributes) {
      const wrapperAttribute: HTMLDivElement = createElement('div', {
        class: 'product-attr__wrapper',
      });
      const attrHeader = createElement('h4', { class: 'product-attr__header' });
      attrHeader.textContent = 'Atrybuty produktu';
      wrapperAttribute.append(attrHeader);
      this.product.attributes.forEach((item) => {
        const attributeItem = createElement('div', { class: 'product-attr__item' });
        const attributeName = createElement<HTMLImageElement>('div', {
          class: 'product-attr__name',
        });
        attributeName.textContent = `${item.name}: `;
        attributeItem.append(attributeName);
        if (item.value.length > 0) {
          item.value.forEach((itemValue: { key: string; label: string }): void => {
            const attributeLabel = createElement<HTMLImageElement>('div', {
              class: 'product-attr__label',
            });
            attributeLabel.textContent = itemValue.label ? itemValue.label : '';
            attributeItem.append(attributeLabel);
          });
        } else {
          const attributeLabel = createElement<HTMLImageElement>('div', {
            class: 'product-attr__label',
          });
          attributeLabel.textContent = item.value.label ? item.value.label : '';
          attributeItem.append(attributeLabel);
        }
        wrapperAttribute.append(attributeItem);
      });
      return wrapperAttribute;
    }
    return undefined;
  }
}
