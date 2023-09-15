import createElement from '../../dom-helper/create-element';
import { IPage } from '../../types/interfaces/page';
import getProductDetails from '../../controller/get-product';
import { getItemFromCart } from '../../controller/get-item-from-cart';
import IProductDetails from '../../types/interfaces/productDetails';
import Router from '../router/router';
import {
  addProduct,
  clearApiRootUser,
  createCart,
  getProductDiscontById,
  removeProduct,
} from '../../services/ecommerce-api';
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

  private cartBtn = createElement('button', { class: 'product-view__button' });

  private cartId = localStorage.getItem('cartId');

  private errorMessage = createElement('div', {
    class: 'error-message',
  });

  constructor() {
    this.productId = this.router.queryParams.productID;
    this.variantId = +this.router.queryParams.variantID;
    this.initError();
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

  private onAddProduct = async (): Promise<void> => {
    try {
      if (!this.product) {
        return;
      }
      if (this.cartId === null) {
        this.cartId = await createCart();
      }
      await addProduct(this.cartId, this.product);
    } catch (e) {
      this.showError();
    }
    this.initCartBtn();
  };

  private onRemoveProduct = async (lineItemsId: string, quantity: number): Promise<void> => {
    try {
      if (!this.cartId) {
        return;
      }
      await removeProduct(this.cartId, lineItemsId, quantity);
    } catch {
      this.showError();
    }
    this.initCartBtn();
  };

  private initCartBtn(): void {
    if (!this.product) {
      return;
    }
    this.cartBtn.textContent = 'Add to cart';
    this.cartBtn.onclick = async (): Promise<void> => this.onAddProduct();
    this.cartId = localStorage.getItem('cartId');
    if (this.cartId) {
      getItemFromCart(this.cartId, this.productId, this.variantId)
        .then((lineItem) => {
          if (lineItem) {
            this.cartBtn.textContent = 'Remove from cart';
            this.cartBtn.onclick = async (): Promise<void> => {
              this.onRemoveProduct(lineItem.id, lineItem.quantity);
            };
          }
        })
        .catch((e) => {
          if (e.message === 'Missing required options') {
            clearApiRootUser();
            this.initCartBtn();
            return;
          }
          this.showError();
        });
    }
  }

  private initError(): void {
    this.errorMessage.textContent = 'Something went wrong. Try again';
    document.body.append(this.errorMessage);
  }

  private showError(): void {
    this.errorMessage.classList.add('show');
    setTimeout(() => {
      this.errorMessage.classList.remove('show');
    }, 2000);
  }

  public render(): HTMLElement {
    this.container.innerHTML = '';
    this.init();
    return this.container;
  }

  private static createPrice(product: IProductDetails): HTMLElement {
    const price = createElement('div', { class: 'product-details__price' });
    if (product.discount && product.discount.value) {
      price.textContent = product.discount.value;
    } else {
      price.textContent = product.price;
    }
    return price;
  }

  private renderProductDetails(): void {
    if (this.product) {
      this.initCartBtn();
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
      const price = ProductView.createPrice(this.product);
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
        wrapper.append(name, wrapperPrices, description, this.cartBtn, wrapperAttribute);
      } else wrapper.append(name, wrapperPrices, description, this.cartBtn);
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
    this.oldPrice.textContent = this.product.price;
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
          discount.textContent = `-${res.value.permyriad / 100}%`;
          break;
        }
        case 'absolute': {
          discount.textContent = `-${(
            res.value.money.filter((item) => item.currencyCode === 'PLN')[0].centAmount / 100
          ).toFixed(2)}`;
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
