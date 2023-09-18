import { DiscountCodeInfo } from '@commercetools/platform-sdk';

export interface IPromoCode {
  code?: string,
  discountCodeInfo?: DiscountCodeInfo,
  state?: string,
}
