import { Category } from "./categories.types";

export interface ProductWithCategory {
  category: Category;
  created_at: string;
  heroImage: string;
  id: number;
  imagesUrl: string[];
  maxQuantity: number;
  price: number | null;
  slug: string;
  title: string;
}

export type ProductsWithCategoryResponse = ProductWithCategory[];

export interface UpdateProductSchema {
  category: number;
  heroImage: string;
  imagesUrl : string[];
  maxQuantity: number;
  price: number;
  slug: string;
  title: string;
}