export default interface IProduct {
  id: string;
  variantId?: number;
  name: string;
  description: string;
  price: string;
  imageUrl?: string;
  discount?: {
    id?: string;
    value?: string;
  };
}
