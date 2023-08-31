import { Attribute } from '@commercetools/platform-sdk';

export default interface IProductDetails {
  id: string;
  variantId?: number;
  name: string;
  description: string;
  price: string;
  imagesUrl?: string[];
  discount?: {
    id?: string;
    value?: string;
  };
  attributes?: Attribute[];
}
