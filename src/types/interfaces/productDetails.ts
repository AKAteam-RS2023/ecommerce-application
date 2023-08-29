export default interface IProductDetails {
  id: string;
  variantId?: number;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  discount?: {
    id?: string;
    value?: string;
  };
}