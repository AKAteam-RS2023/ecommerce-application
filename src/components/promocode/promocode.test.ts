import { DiscountCodeInfo } from '@commercetools/platform-sdk';
import PromoCode from './promocode';
import { IPromoCode } from '../../types/interfaces/promocode';

describe('PromoCode', () => {
  let promoCode: PromoCode;
  beforeEach(() => {
    promoCode = PromoCode.instance || new PromoCode();
  });
  it('should set the cartId from localStorage', () => {
    localStorage.setItem('cartId', 'testCartId');
    promoCode.init();
    expect(promoCode.cartId).toEqual('testCartId');
  });
  it('should render the discount code field with a form', () => {
    const discountCodeElement = promoCode.render();
    expect(discountCodeElement).toBeDefined();
    expect(discountCodeElement.querySelector('.discount-code__form')).toBeDefined();
  });
  it('should render a discount code item when calling renderDiscountItem', () => {
    const code = 'TESTCODE';
    const item: IPromoCode = {
      code,
      discountCodeInfo: { discountCode: { typeId: 'discount-code', id: 'id' }, state: 'MatchesCart' },
    };
    promoCode.renderDiscountItem(code, item, 0);
    const discountCodeItem = promoCode.discountCodeItems.querySelector('.discount-code__item');
    expect(discountCodeItem).toBeDefined();
    expect(discountCodeItem?.textContent).toEqual(code);
  });
  it('should delete a discount code item', () => {
    const mockDiscountCodeInfo: DiscountCodeInfo = {
      discountCode: { id: 'code1', typeId: 'discount-code' },
      state: 'MatchesCart',
    };
    promoCode.appliedCode = [{ code: 'code1', discountCodeInfo: mockDiscountCodeInfo }];
    const initialAppliedCodeLength = promoCode.appliedCode.length;
    const deleteCodeBtn = promoCode.discountCodeItems.querySelector('.discount-code__delete');
    expect(promoCode.appliedCode).toContainEqual({ code: 'code1', discountCodeInfo: mockDiscountCodeInfo });
    (deleteCodeBtn as HTMLButtonElement).click();
    expect(promoCode.appliedCode.length).toBe(initialAppliedCodeLength - 1);
    expect(promoCode.appliedCode).not.toContainEqual({ code: 'code1', discountCodeInfo: mockDiscountCodeInfo });
  });
});
