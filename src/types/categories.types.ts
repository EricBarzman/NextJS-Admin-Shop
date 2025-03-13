
export type Product = {
  id : number;
  title: string;
  slug: string;
  category : number;
  heroImage : string;
  imagesUrl : string[];
  maxQuantity : number;
  price : number;
}

export type Category = {
  created_at : string;
  id: number;
  imageUrl: string;
  name : string;
  slug: string;
}

export type CategoryWithProducts = {
  created_at : string;
  id: number;
  imageUrl: string;
  name : string;
  products: Product[];
  slug: string;
}

export type CategoriesWithProductsResponse = CategoryWithProducts[];