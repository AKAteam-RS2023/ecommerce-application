export interface ISubCategory {
  id: string;
  name: string;
  parent: string;
}

export interface ICategory {
  id: string;
  name: string;
  subCategories?: ISubCategory[];
}
