export interface ISubCategory {
  id: string;
  name: string;
}

export interface ICategory extends ISubCategory {
  subCategories?: ISubCategory[];
}
