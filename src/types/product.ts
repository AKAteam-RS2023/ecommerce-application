export default interface IProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  discount?: {
    id?: string;
    value?: string;
  };
}
