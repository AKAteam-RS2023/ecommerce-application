export default interface ICartsProduct {
  name: string;
  url?: string;
  price: string;
  discountedPrice?: string;
  priceWithPromoCode?: string;
  totalPrice: string;
  quantity: number;
  lineItemId: string;
}
